//
//  InsoleClient.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/17.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import CoreBluetooth
import XCGLogger
import RxSwift
import CoreGraphics

protocol FirmwareDelegate {
    func didFirmwareUpgradeProgress(progress: Float)
    func didFirmwareUpgradeFinished()
}

class InsoleClient: Client, InsoleServiceDelegate {
    
    var isSelected = false
    
    enum Side {
        case left, right
    }
    
    enum RecordStatus {
        
    }
    
    private var quaternionSubject: PublishSubject<Quaternion> = PublishSubject()
    private var motionSubject: PublishSubject<MotionFrame> = PublishSubject()
    
    private var quaternionAndMotionSubject: PublishSubject<(Quaternion, MotionFrame, Bool, Bool)> = PublishSubject()
    
    

    // TODO: 原子操作
    var isRecording = false
    var motionFrames: [MotionFrame]?
    
    
    
    var side: Side
    var serialNumber: [UInt8]
    
    var editTime : [UInt8]?
    var firmwareVision:String?
    
    var batteryVoltage: Double = 0
    
    var deviceInformationServiceHandler = DeviceInformationServiceHandler()
    var insoleServiceHandler = InsoleServiceHandler()
    var settingsServiceHandler = SettingsServiceHandler()
    
    
    var firmwareDelegate: FirmwareDelegate?
    
    required init?(peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        
        guard let manufacturerData = advertisementData[CBAdvertisementDataManufacturerDataKey] as? Data,
            let localName = advertisementData[CBAdvertisementDataLocalNameKey] as? String else {
                return nil
        }
        
        if localName != "SennoIMU" {
            return nil
        }
        
        //        let manufacturerBytes = Array<UInt8>(repeating: 0, count: manufacturerData.count)
        let manufacturerBuffer = ByteBuffer(data: manufacturerData)
        
        let _: UInt8? = manufacturerBuffer.get()
        let _: UInt8? = manufacturerBuffer.get()
        
        guard let sideByte: Character = manufacturerBuffer.get(),
            let serialNumber = manufacturerBuffer.get(8) else {
                return nil
        }
        
        self.editTime = manufacturerBuffer.get(4)
        self.serialNumber = serialNumber
        
        if sideByte == Character("L") {
            self.side = .left
        } else if sideByte == Character("R") {
            self.side = .right
        } else {
            return nil
        }
        
        super.init(peripheral: peripheral, rssi: RSSI)
        
        addServiceHandler(deviceInformationServiceHandler)
        addServiceHandler(settingsServiceHandler)
        addServiceHandler(insoleServiceHandler)
//        settingsServiceHandler.delegate = self
        
        insoleServiceHandler.delegate = self
        
    }
    
    
    override var description: String {
        return "Insole side: \(side), serialNumber: \(bytesToHexString(serialNumber))"
    }
    
    //MARK: Notify

    //QuaternionAndMotion
    func startNotifyQuaternionAndMotion() -> Observable<(Quaternion, MotionFrame, Bool, Bool)> {
        if !quaternionAndMotionSubject.hasObservers {
            insoleServiceHandler.quaternionHandler.notify(true)
            insoleServiceHandler.motionHandler.notify(true)
        }
        return quaternionAndMotionSubject.asObservable()
    }
    
    
    func stopNotifyQuaternionAndMotion(disposable: Disposable?) {
        guard let disposable = disposable else {
            return
        }
        disposable.dispose()
        if !quaternionAndMotionSubject.hasObservers {
            insoleServiceHandler.quaternionHandler.notify(false)
            insoleServiceHandler.motionHandler.notify(false)
        }
    }
    
    
    
    func startRecord() {
        if motionFrames == nil {
            motionFrames = [MotionFrame]()
        }
        isRecording = true
    }
    
    
    func stopRecord() {
        startRecordBool = false
        isLostConnectionMotionFromZero = 0
        isRecording = false
        isStaticOnCountDown = false
        isStaticCountOnCountDown = 0
    }
    
    
    func clearRecordFrames() {
         //清除数据记录
        motionFrames?.removeAll(keepingCapacity: true)
        recordAllMotion?.removeAll(keepingCapacity: true)
        
        startRecordBool = false
        isLostConnectionMotionFromZero = 0
    }
    
    
    // MARK: - 固件升级部分
    func upgradeFirmware(_ path: String) -> Observable<Double>? {
        let address:UInt32 = 0x3C000
        return settingsServiceHandler.upgradeFirmware(path, address: address)
    }
    
    
    func upgradeFirmware(_ data: Data) -> Observable<Double>? {
        let address:UInt32 = 0x3C000
        return settingsServiceHandler.upgradeFirmware(data, address: address)
    }
    
    
    var lastMotionID: Double = 0 //上次motion的ID
    var firstMotionId: Double = 0 //第一帧motion的ID
    //记录多少次不丢帧
    var validMotionCount = 0
    var motionCount = 0
    var lostMotionCount = 0 //丢帧的次数
    var allMotionCount = 0
    
    // MARK: - InsoleServiceDelegate
    func didQuaternionUpdated(quaternion: QuaternionFrame) {
//        quaternionSubject.onNext(quaternion)
    }
    
    
    var motionFusion = MotionFusion()
    var lastMotionFrame: MotionFrame? //上一针motion

    
    //第一帧 用来做角速度的偏移
    var sumGyroscopeX: Float = 0
    var sumGyroscopeY: Float = 0
    var sumGyroscopeZ: Float = 0
    var averageGyroscope: [Float] = [0,0,0]
    
    var isStatic: Bool = false
    var isStaticCount = 0
    
    //在显示倒计时321的时候是否静止
    var isStaticOnCountDown: Bool = false
    var isStaticCountOnCountDown = 0
    var lastCountDownMotionFrame: MotionFrame? //321时上一针motion
    
    var startRecordBool: Bool = false
    var isLostConnectionMotionFromZero = 0
    
    func changeisStaticOnCountDown(){
        isStaticOnCountDown = false
    }
    
    
    
    func didMotionUpdated(motion: MotionFrame) {
//        if side == .left{
//           print("-- left  ----- \(motion.id) - \(motion.gyroscopeX) - \(motion.gyroscopeY)  -  \(motion.gyroscopeZ) - \(motion.accelerometerX)  -  \(motion.accelerometerY) - \(motion.accelerometerZ)")
//        }else{
//            print("-- right  ----- \(motion.id) - \(motion.gyroscopeX) - \(motion.gyroscopeY)  -  \(motion.gyroscopeZ) - \(motion.accelerometerX)  -  \(motion.accelerometerY) - \(motion.accelerometerZ)")
//        }
        
        if lastMotionID == 0 {
            lastMotionFrame = motion
            firstMotionId = motion.id
            lastCountDownMotionFrame = motion
        }else{
            //在此做角速度的offset 取100帧做平均值
                //1、进入测试页面就是静止的
                //2、进入测试页面的时候是运动的，等到静止的时候在计算offset
            
            if isStatic {
            }else{
                //非静止
                let absGyroscopeX = abs(motion.gyroscopeX - (lastMotionFrame?.gyroscopeX)!)
                let absGyroscopeY = abs(motion.gyroscopeY - (lastMotionFrame?.gyroscopeY)!)
                let absGyroscopeZ = abs(motion.gyroscopeZ - (lastMotionFrame?.gyroscopeZ)!)
                let amp = absGyroscopeX + absGyroscopeY + absGyroscopeZ
                if amp < 5 {
                    isStaticCount += 1
                    if isStaticCount <= 20{
                    }else{
                        if isStaticCount <= 170{
                            sumGyroscopeX += motion.gyroscopeX
                            sumGyroscopeY += motion.gyroscopeY
                            sumGyroscopeZ += motion.gyroscopeZ
                            averageGyroscope[0] = sumGyroscopeX / Float(150)
                            averageGyroscope[1] = sumGyroscopeY / Float(150)
                            averageGyroscope[2] = sumGyroscopeZ / Float(150)
                        }else{
                            isStatic = true
                        }
                    }
                }
            }
            lastMotionFrame = motion
            motionFusion.update(motion: motion, dt: 0.01, averageGyroscope: averageGyroscope)
        }
        
        if isRecording{
            if motion.id == 0 {
                if isLostConnectionMotionFromZero == 0 {
                    startRecordBool = true
                    isLostConnectionMotionFromZero += 1
                }else{
                    startRecordBool = false
                    isLostConnectionMotionFromZero = 0
                }
            }
            //321倒计时时动了，motionFrames移除数据，allMotionCount=0，validMotionCount=0
            
            //判断前3秒是否动，通过角速度或加速度判断，如果超出某范围，就是动了
            //首先假设是动的
            
            if !isStaticOnCountDown {
                let absGyroscopeX = abs(motion.gyroscopeX - (lastCountDownMotionFrame?.gyroscopeX)!)
                let absGyroscopeY = abs(motion.gyroscopeY - (lastCountDownMotionFrame?.gyroscopeY)!)
                let absGyroscopeZ = abs(motion.gyroscopeZ - (lastCountDownMotionFrame?.gyroscopeZ)!)
                let amp = absGyroscopeX + absGyroscopeY + absGyroscopeZ
                if amp > 8 {
                    //倒计时中计数+1 ,超过10帧都大于，
                    isStaticCountOnCountDown = 0
                    isStaticOnCountDown = false
                    self.motionFrames?.removeAll()
                    allMotionCount = 0
                    firstMotionId = motion.id
                    validMotionCount = 0
                    lostMotionCount += 1
                    lastMotionID = 0
                    motionCount = 0
                }else{
                    isStaticCountOnCountDown += 1
                    if isStaticCountOnCountDown > 20 && isStaticCountOnCountDown < 50{
                        isStaticOnCountDown = true
                    }
                }
            }
            lastCountDownMotionFrame = motion

            if startRecordBool {
                motionFrames?.append(motion)
            }
            allMotionCount += 1
            if allMotionCount == 1 {
                firstMotionId = motion.id
            }
            
            if lastMotionID != 0 {
                if motion.id - lastMotionID < 0.018 && motion.id - lastMotionID > 0.009 {
                    lastMotionID = motion.id
                    motionCount += 1
                } else {
                    if motion.id - firstMotionId > 5{
                        validMotionCount += motionCount
                    }
                    firstMotionId = motion.id
                    lostMotionCount += 1
                    lastMotionID = 0
                    motionCount = 0
                }
            }
        }
        lastMotionID =  motion.id
        quaternionAndMotionSubject.onNext((motionFusion.quaternion, motion, isRecording, isStaticOnCountDown))
    }
    
    
    
    
    
    
    private var syncProgressSubject: PublishSubject<Double>?
    
    func syncProgressObservable() -> Observable<Double>? {
        return syncProgressSubject?.asObservable()
    }
    
    
    var syncTimer: Timer?
    
    var alreadySyncDataCount: Int = 0
    //同步motion数据
    func syncMotionUpdateValue(motion: MotionFrame){
//        if side == .left {
//            log.debug("--已经获取的同步的ID------- \(motion.id) ----- \(motion.gyroscopeX) ---- \(motion.gyroscopeY)  -----  \(motion.gyroscopeZ) ------  \(motion.accelerometerX)  -----  \(motion.accelerometerY) ------ \(motion.accelerometerZ)")
//        }else{
//            log.debug("--right------- \(motion.id) ----- \(motion.gyroscopeX) ---- \(motion.gyroscopeY)  -----  \(motion.gyroscopeZ) ------  \(motion.accelerometerX)  -----  \(motion.accelerometerY) ------ \(motion.accelerometerZ)")
//        }
        
        //添加计时器，判断超过多长时间看做同步结束,之后在同步；还要判断获取的最后一个motion的id和当前六轴记录的最后一条ID是否相同
        self.recordAllMotion?[Int(motion.id)] = motion
        alreadySyncDataCount += 1
        getSyncDataPercent()
        
        if let _ = endSyncID {
            if let _ = syncTimer {
                syncTimer?.invalidate()
                syncTimer = nil
            }
            last = CGFloat(Date.init().timeIntervalSince1970)
            if motion.id == Double(endSyncID! - 1) {
                endRecordAndStartSync()
            }else{
//                DispatchQueue.global().asyncAfter(deadline: .now()+0.5, execute: {
                DispatchQueue.global().async{
//                     log.debug("当前时间--- \(CGFloat(Date.init().timeIntervalSince1970) - self.last) -- \(self.last)")
                    if CGFloat(Date.init().timeIntervalSince1970) - self.last > 0.5{
                        DispatchQueue.main.async {
                            self.didSyncTimeout()
                        }
                    }
//                })
                }
            }
        }
    }
    
    
    var time: CGFloat = 0
    var last: CGFloat = 0
    
    func didSyncTimeout() {
        endRecordAndStartSync()
    }
    
    
    //TODO: 迭代  结束记录后创建完整数组将motion对应，开始同步
    var index:Int?
    
    var startSyncID: UInt32?
    var endSyncID: UInt32?
    
    func endRecordAndStartSync() {
        let firstId = motionFrames?.first?.id
        if (recordAllMotion?.count)! - 1 <= 0 {
            syncProgressSubject?.onCompleted()
            return
        }
        
        for i in 0 ... recordAllMotion!.count-1 {
            if i >= Int(firstId!) {
                if recordAllMotion![i] == nil {
                    startSyncID = UInt32(i)
                    index = i
//                    log.debug("开始的ID ： \(self.startSyncID ?? 0)")
                    break
                    
                }else if i == recordAllMotion!.count-1 {
                    syncProgressSubject?.onCompleted()
                    shouldSyncDataCount = 0
                    alreadySyncDataCount = 0
                    startSyncID = nil
                    endSyncID = nil
                    insoleServiceHandler.recordDataHandler.notify(false)
                    log.debug("我没有丢数据")
                    return
                }
            }
        }
        
        
        if let _ = index {
            for i in index! ... recordAllMotion!.count {
                if i == recordAllMotion!.count-1 {
                    endSyncID = UInt32(i)
                    log.debug("最后一帧没有获取到 ------ ： \(self.endSyncID ?? 0)")
                    break
                }
                if recordAllMotion![i] != nil{
                    endSyncID = UInt32(i)
                    break
                }
            }
        }
        
        
        if startSyncID != nil && endSyncID != nil {
            log.debug("开始的同步ID  \(self.startSyncID ?? 0)  ----   \(self.endSyncID ?? 0)")
            insoleServiceHandler.recordDataHandler.notify(true)
            
            //同步ID
            insoleServiceHandler.onControlSyncWriteValue(recordStart: startSyncID!, recordEnd: endSyncID! - 1)
        }
        
        // 0: 找到第一个nil，和当前的index，break，如果找到末尾：同步完成。 
        // 1: 从index开始往后找 !nil或到达末尾，endSyncID = 当前的index - 1
        // 2:  startSyncID != nil && endSyncID != nil: 同步
    }
    
    
        
    //获取当前六轴记录的最后一条ID，完成后创建该ID大小的数组
    var recordLastID:UInt32 = 0
    var recordAllMotion:[MotionFrame?]?
    var shouldSyncDataCount: Int = 0
    private var recordStatusDisposable: Disposable?

    
    func createRecordAllMotion(){
        syncProgressSubject = PublishSubject<Double>()
        
        if let _ = self.motionFrames{
            if self.motionFrames!.count > 0 {
                let lastID = self.motionFrames?.last?.id
                let firstID = self.motionFrames?.first?.id
                if let _ = lastID, let _ = firstID {
                    self.shouldSyncDataCount = Int(lastID!) + 1 - self.motionFrames!.count - Int(firstID!)

                    let mediationMotion = [MotionFrame?](repeating: nil, count: (Int(lastID!)+1))
                    self.recordAllMotion = mediationMotion
                    if self.shouldSyncDataCount < 0 {
                        self.recordAllMotion = self.motionFrames
                        return
                    }

                    for (_, value) in self.motionFrames!.enumerated() {
                        self.recordAllMotion?[Int(value.id)] = value
                    }
                    
                    self.endRecordAndStartSync()
                }
            }
        }
    }
    func getSyncDataPercent(){
        let syncProgress = Double(alreadySyncDataCount)/Double(shouldSyncDataCount)
        syncProgressSubject?.onNext(syncProgress)
    }
}






//
//  InsoleServiceHandler.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/20.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import CoreBluetooth
import RxSwift
import XCGLogger


protocol InsoleServiceDelegate {
    func didQuaternionUpdated(quaternion: QuaternionFrame)
    func didMotionUpdated(motion: MotionFrame)
    func syncMotionUpdateValue(motion: MotionFrame)
}


class InsoleServiceHandler: ServiceHandler {
    
    static let uuidService      = CBUUID(string: "33000100-121F-3E53-656E-6E6F54656368")
    
    static let uuidControl      = CBUUID(string: "33000101-121F-3E53-656E-6E6F54656368")
    static let uuidStatus       = CBUUID(string: "33000102-121F-3E53-656E-6E6F54656368")
    static let uuidRecordData   = CBUUID(string: "33000103-121F-3E53-656E-6E6F54656368")
    
    static let uuidMotion       = CBUUID(string: "33000104-121F-3E53-656E-6E6F54656368")
    static let uuidQuaternion   = CBUUID(string: "33000105-121F-3E53-656E-6E6F54656368")
    
//    static let uuidQuaternion   = CBUUID(string: "33000103-121F-3E53-656E-6E6F54656368")
//    static let uuidMotion       = CBUUID(string: "33000104-121F-3E53-656E-6E6F54656368")

    override func getUuid() -> CBUUID? {
        return InsoleServiceHandler.uuidService
    }

    var delegate: InsoleServiceDelegate?
    
    private var lastId = UInt32(0)
    
    var controlHandler: CharacteristicHandler!
    var statusHandler: CharacteristicHandler!
    var recordDataHandler: CharacteristicHandler!
    var motionHandler: CharacteristicHandler!
    var quaternionHandler: CharacteristicHandler!
    
    //我需要知道lastId类型
    var statusLastIDSubject = PublishSubject<UInt32>()
    
    private func addControlHandler(){
        //六轴数据记录控制
        controlHandler = CharacteristicHandler(InsoleServiceHandler.uuidControl)
        controlHandler.onDiscovered {
            log.debug("controlHandler onDiscovered")
        }
        addCharacteristicHandler(controlHandler)
    }
    
    
    private func addStatusHandler(){
        //六轴数据记录的状态
        statusHandler = CharacteristicHandler(InsoleServiceHandler.uuidStatus)
        statusHandler.onDiscovered {
            log.debug("statusHandler onDiscovered")
        }
        
        statusHandler.onUpdateValue {
            [weak self] bytes in
            log.debug("statusHandler onUpdateValue")
            let byteBuffer = ByteBuffer(bytes: bytes)
            guard let statusLastIDInt: UInt32 = byteBuffer.get() else {
                return
            }
            log.debug("statusHandler statusLastIDSubject onNext")
            self?.statusLastIDSubject.onNext(statusLastIDInt)
        }
        addCharacteristicHandler(statusHandler)
    }
    
    private func addRecordDataHandler(){
        //六轴记录数据
        recordDataHandler = CharacteristicHandler(InsoleServiceHandler.uuidRecordData)
        
        recordDataHandler.onDiscovered {
            log.debug("recordDataHandler onDiscovered")
            self.recordDataHandler.read()
        }
        
        recordDataHandler.onUpdateValue {
            [weak self] bytes in
            self?.syncMotionUpdateValue(bytes)
        }
        addCharacteristicHandler(recordDataHandler)
    }
    
    private func addMotionHandler(){
        //六轴
        motionHandler = CharacteristicHandler(InsoleServiceHandler.uuidMotion)
        motionHandler.onDiscovered {
            log.debug("motionHandler onDiscovered")
        }
        
        motionHandler.onUpdateValue() {
            [weak self] bytes in
            self?.onMotionUpdateValue(bytes)
        }
        addCharacteristicHandler(motionHandler)
    }
    
    private func addQuaternionHandler(){
        //四元数
        quaternionHandler = CharacteristicHandler(InsoleServiceHandler.uuidQuaternion)
        quaternionHandler.onDiscovered {
            log.debug("quaternionHandler.onDiscovered")
        }
        
        quaternionHandler.onUpdateValue() { [weak self] bytes in
            self?.onQuaternionUpdateValue(bytes)
        }
        
        quaternionHandler.onUpdateNotificationState { [weak self] in
            let state = self?.quaternionHandler.characteristic?.isNotifying
//            log.debug("quaternionHandler.onUpdateNotificationState: \(state)")
        }
        addCharacteristicHandler(quaternionHandler)
    }
    
    override init() {
        super.init()
        
        addControlHandler()
        addStatusHandler()
        addRecordDataHandler()
        
        addMotionHandler()
        addQuaternionHandler()
    }

    
    func onQuaternionUpdateValue(_ value: [UInt8]) {
        
        let byteBuffer = ByteBuffer(bytes: value)
        guard
            let id: UInt32 = byteBuffer.get(),
            let w: Int32 = byteBuffer.get(),
            let x: Int32 = byteBuffer.get(),
            let y: Int32 = byteBuffer.get(),
            let z: Int32 = byteBuffer.get() else {
                return
        }
        
        let quaternion = QuaternionFrame(id: id, w: w, x: x, y: y, z: z)
//        quaternionSubject.onNext(quaternion)
        delegate?.didQuaternionUpdated(quaternion: quaternion)
    }

    
    func onMotionUpdateValue(_ value: [UInt8]) {
        let byteBuffer = ByteBuffer(bytes: value)
        
        guard let id: UInt32 = byteBuffer.get(),
            let gyroscopeX: Int16 = byteBuffer.get(),
            let gyroscopeY: Int16 = byteBuffer.get(),
            let gyroscopeZ: Int16 = byteBuffer.get(),
            let accelerometerX: Int16 = byteBuffer.get(),
            let accelerometerY: Int16 = byteBuffer.get(),
            let accelerometerZ: Int16 = byteBuffer.get()
            else {
                return
        }

        let motion = MotionFrame(id: Double(id), gx: Float(gyroscopeX), gy: Float(gyroscopeY), gz: Float(gyroscopeZ), ax: Float(accelerometerX), ay: Float(accelerometerY), az: Float(accelerometerZ))
        delegate?.didMotionUpdated(motion: motion)
    }
    
    
    //六轴数据记录控制 RecordControl Write
    //TODO: 需要知道是那种write类型  
    //需要知道 1类型:Uint8  2-3记录时间:Uint16  4-7起始ID:Uint32  8-11终止ID:Uint32
    
    func syncMotionUpdateValue(_ value: [UInt8]) {
        let byteBuffer = ByteBuffer(bytes: value)
        
        guard let id: UInt32 = byteBuffer.get(),
            let gyroscopeX: Int16 = byteBuffer.get(),
            let gyroscopeY: Int16 = byteBuffer.get(),
            let gyroscopeZ: Int16 = byteBuffer.get(),
            let accelerometerX: Int16 = byteBuffer.get(),
            let accelerometerY: Int16 = byteBuffer.get(),
            let accelerometerZ: Int16 = byteBuffer.get()
            else {
                return
            }
        
        let motion = MotionFrame(id: Double(id), gx: Float(gyroscopeX), gy: Float(gyroscopeY), gz: Float(gyroscopeZ), ax: Float(accelerometerX), ay: Float(accelerometerY), az: Float(accelerometerZ))
        delegate?.syncMotionUpdateValue(motion: motion)
    }
    
    //六轴数据记录控制    00停止  01开始记录  02开始同步
    func onControlRecordWriteValue(recordTime: UInt16) {
        let byteBuffer = ByteBuffer()
        byteBuffer.put(UInt8(0x01))
        byteBuffer.put(recordTime)
        byteBuffer.put(UInt32(0))
        byteBuffer.put(UInt32(0))
        controlHandler.writeWithResponse(byteBuffer.buffer)
    }
    
    
    func onControlStopWriteValue() {
        let byteBuffer = ByteBuffer()
        byteBuffer.put(UInt8(0x00))
        byteBuffer.put(UInt16(0))
        byteBuffer.put(UInt32(0))
        byteBuffer.put(UInt32(0))
        controlHandler.writeWithResponse(byteBuffer.buffer)
    }
    
    
    func onControlSyncWriteValue(recordStart:UInt32, recordEnd: UInt32) {
        let byteBuffer = ByteBuffer()
        byteBuffer.put(UInt8(0x02))
        byteBuffer.put(UInt16(0))
        byteBuffer.put(recordStart)
        byteBuffer.put(recordEnd)
        controlHandler.writeWithResponse(byteBuffer.buffer)
    }
    
    
    //六轴数据记录的状态  GyroRecordStatus READ
    func readRecordStatusValue() -> Observable<UInt32>{
        statusHandler.read()
        log.debug("-------------------------  优美的分割线  --------------------------")
        return statusLastIDSubject.asObserver()
    }
}









//
//  ServiceTimeHandler.swift
//  PedoRing
//
//  Created by YangZhiyong on 15/11/7.
//  Copyright © 2015年 YangZhiyong. All rights reserved.
//

import Foundation
import CoreBluetooth
import XCGLogger
import RxSwift


class SettingsServiceHandler: ServiceHandler {
    
    static let uuidService           = CBUUID(string: "33000000-121F-3E53-656E-6E6F54656368")
    static let uuidTime              = CBUUID(string: "33000001-121F-3E53-656E-6E6F54656368")
    static let uuidBattery           = CBUUID(string: "33000002-121F-3E53-656E-6E6F54656368")
    static let uuidConnectionSetting = CBUUID(string: "33000003-121F-3E53-656E-6E6F54656368")
    static let uuidConnectionParam   = CBUUID(string: "33000004-121F-3E53-656E-6E6F54656368")
    static let uuidFirmwareControl   = CBUUID(string: "33000005-121F-3E53-656E-6E6F54656368")
    static let uuidFirmwareData      = CBUUID(string: "33000006-121F-3E53-656E-6E6F54656368")
    static let uuidFirmwareStatus    = CBUUID(string: "33000007-121F-3E53-656E-6E6F54656368")
    static let uuidFirmwareBuildTime = CBUUID(string: "33000008-121F-3E53-656E-6E6F54656368")
    
    override func getUuid() -> CBUUID? {
        return SettingsServiceHandler.uuidService
    }
    
    
    fileprivate var firmwareBuildTimeSubject = PublishSubject<Date?>()
    fileprivate var firmwareUpgradeProgressSubject: PublishSubject<Double>?
    
    
    var timeHandler: CharacteristicHandler!
    var batteryHandler: CharacteristicHandler!
    var connectionSettingHandler: CharacteristicHandler!
    var connectionParamHandler: CharacteristicHandler!
    
    var firmwareControlHandler: CharacteristicHandler!
    var firmwareDataHandler: CharacteristicHandler!
    var firmwareStatusHandler: CharacteristicHandler!
    var firmwareBuildTimeHandler: CharacteristicHandler!
    
    var connectionInterval = TimeInterval(0.1)
    
    var timeSubject = PublishSubject<Date>()
    
    
    fileprivate var batteryVoltageSubject = BehaviorSubject<Double>(value: 0)
    var batteryVoltageObservable: Observable<Double> {
        return batteryVoltageSubject.asObservable()
    }
    var batteryVoltage: Double {
        return try! batteryVoltageSubject.value()
    }
    
    
    fileprivate func addConnectionSettingHandler() {
        connectionSettingHandler = CharacteristicHandler(SettingsServiceHandler.uuidConnectionSetting)
        addCharacteristicHandler(connectionSettingHandler)
    }
    
    
    fileprivate func addConnectionParamHandler() {
        connectionParamHandler = CharacteristicHandler(SettingsServiceHandler.uuidConnectionParam)
        connectionParamHandler.onDiscovered { [weak self] in
            self?.connectionParamHandler.read()
            self?.connectionParamHandler.notify(true)
        }
        connectionParamHandler.onUpdateValue() { [weak self] bytes in
            let buffer = ByteBuffer(bytes: bytes)
            guard
                let interval: UInt16 = buffer.get(),
                let latency: UInt16 = buffer.get(),
                let timeout: UInt16 = buffer.get() else {
                    return
            }
            
            self?.connectionInterval = Double(interval)*1.25/1000
            log.debug("didConnectionParamUpdateValue interval: \(Double(interval)*1.25)ms, latency: \(latency), timeout: \(Double(timeout)*10.0)ms")
        }
        addCharacteristicHandler(connectionParamHandler)
    }
    
    
    
    func readTime() -> Observable<Date> {
        timeHandler.read()
        return timeSubject.asObserver()
    }
    
    
    func writeTime(time: Date) {
        let newTime = UInt32(time.timeIntervalSince1970)
        let timeByteBuffer = ByteBuffer()
        timeByteBuffer.put(newTime)
        timeHandler.writeWithResponse(timeByteBuffer.buffer)
    }
    
    
    func readFirmwareBuildTime() -> Observable<Date?> {
        firmwareBuildTimeHandler.read()
        return firmwareBuildTimeSubject.asObservable()
    }
    
    
    private func addTimeHandler() {
        timeHandler = CharacteristicHandler(SettingsServiceHandler.uuidTime)
        timeHandler.onUpdateValue() { [weak self] bytes in
            if bytes.count != 4 {
                return
            }
            
            let byteBuffer = ByteBuffer(bytes: bytes)
            guard let time: Int32 = byteBuffer.get() else {
                return
            }
            
            let date = Date(timeIntervalSince1970: Double(time))
            self?.timeSubject.onNext(date)
        }
        
        addCharacteristicHandler(timeHandler)
    }
    
    
    private func addFirmwareBuildTimeHandler() {
        firmwareBuildTimeHandler = CharacteristicHandler(SettingsServiceHandler.uuidFirmwareBuildTime)
        firmwareBuildTimeHandler.onUpdateValue() { [weak self] bytes in
            let byteBuffer = ByteBuffer(bytes: bytes)
            guard let buildTimeInt: Int32 = byteBuffer.get() else {
                return
            }
            
            let buildTime = Date(timeIntervalSince1970: TimeInterval(buildTimeInt))
            self?.firmwareBuildTimeSubject.onNext(buildTime)
        }
        addCharacteristicHandler(firmwareBuildTimeHandler)
    }
    
    
    private func addBatteryHandler() {
        batteryHandler = CharacteristicHandler(SettingsServiceHandler.uuidBattery)
        batteryHandler.onDiscovered { [weak self] in
            self?.batteryHandler.notify(true)
        }
        
        batteryHandler.onUpdateValue() { [weak self] bytes in
            if bytes.count != 2 {
                return
            }
            
            let byteBuffer = ByteBuffer(bytes: bytes)
            guard let battery: UInt16 = byteBuffer.get() else {
                return
            }
            
            let voltage = Double(battery)/1024 * 5.347
            self?.batteryVoltageSubject.onNext(voltage)
        }
        addCharacteristicHandler(batteryHandler)
    }

    
    override init() {
        super.init()
        
        addTimeHandler()
        addBatteryHandler()
        
        addConnectionSettingHandler()
        addConnectionParamHandler()
        addFirmwareControlHandler()
        addFirmwareDataHandler()
        addFirmwareStatusHandler()
        
        addFirmwareBuildTimeHandler()
    }
    
    
    func updateConnection(minInterval: Int, maxInterval: Int, latency: Int, timeout: Int) {
        
        let min = UInt16(round(Double(minInterval)/1.25))
        let max = UInt16(round(Double(maxInterval)/1.25))
        let to = UInt16(round(Double(timeout)/10.0))
        
        let byteBuffer = ByteBuffer()
        byteBuffer.put(min)
        byteBuffer.put(max)
        byteBuffer.put(UInt16(latency))
        byteBuffer.put(to)
        
        connectionSettingHandler.writeWithResponse(byteBuffer.buffer)
    }
    
    
    
    ///////////////////////////////////////////////////////////////
    // MARK: - Fimware Upgrade
    fileprivate enum FirmwareOpcode: UInt8 {
        case prepare    = 0x00
        case activate   = 0x01
    }
    
    fileprivate enum FirmwareStatus: UInt8 {
        case idle       = 0x00
        case erase      = 0x01
        case waiting    = 0x02
        case ready      = 0x03
        case resend     = 0x04
        case downloaded = 0x05
    }
    
    fileprivate var firmwareBytes: [UInt8]?
    fileprivate var firmwareCount = 0
    fileprivate var firmwareDownloading = false
    
    fileprivate func addFirmwareControlHandler() {
        firmwareControlHandler = CharacteristicHandler(SettingsServiceHandler.uuidFirmwareControl)
        addCharacteristicHandler(firmwareControlHandler)
    }
    
    
    fileprivate func addFirmwareDataHandler() {
        firmwareDataHandler = CharacteristicHandler(SettingsServiceHandler.uuidFirmwareData)
        addCharacteristicHandler(firmwareDataHandler)
    }
    
    
    fileprivate func addFirmwareStatusHandler() {
        firmwareStatusHandler = CharacteristicHandler(SettingsServiceHandler.uuidFirmwareStatus)
        firmwareStatusHandler.onDiscovered { [weak self] in
            self?.firmwareStatusHandler.notify(true)
        }
        firmwareStatusHandler.onUpdateValue() { [weak self] bytes in
            self?.didFirmwareStatusUpdated(bytes)
        }
        addCharacteristicHandler(firmwareStatusHandler)
    }
    
    
    func write(_ bytes: [UInt8], offset: Int) {
        let byteBuffer = ByteBuffer()
        byteBuffer.put(UInt32(offset))
        byteBuffer.put(bytes)
        
        firmwareDataHandler.writeWithoutResponse(byteBuffer.buffer)
    }
    
    // TODO: 检测蓝牙是否断开
    var isDisconnected = false
    
    func downloadNext() {
        guard let firmware = firmwareBytes else {
            return
        }
        
        if isDisconnected {
            return
        }
        
        if Int(firmwareCount) >= firmware.count {
            return
        }
        
        var length: Int
        let remain = firmware.count - Int(firmwareCount)
        if remain > 16 {
            length = 16
        } else {
            length = remain
        }
        
        let begin = firmwareCount
        let end = firmwareCount + length
        
        log.debug("down firmware to: \(self.firmwareCount), length: \(length)")
        self.write(Array(firmware[begin..<end]), offset: begin)
        
        firmwareCount += length
        if Int(firmwareCount) < firmware.count {
            firmwareDownloading = true
            let progress = Double(firmwareCount)/Double(firmware.count)
            firmwareUpgradeProgressSubject?.onNext(progress)
            DispatchQueue.main.asyncAfter(deadline: DispatchTime.now()+self.connectionInterval/5) {
//            DispatchQueue.main.asyncAfter(deadline: DispatchTime.now()+0.020) {
                self.downloadNext()
            }
            
        } else {
            firmwareDownloading = false
        }
        
    }
    
    
    func didFirmwareStatusUpdated(_ bytes: [UInt8]) {
        
        let byteBuffer = ByteBuffer(bytes: bytes)
        
        guard let statusByte: UInt8 = byteBuffer.get(),
            let status = FirmwareStatus(rawValue: statusByte) else {
                log.error("didFirmwareStatusUpdated FirmwareStatus")
                return
        }
        
        switch status {
        case .ready, .resend:
            guard let count: UInt32 = byteBuffer.get() else {
                log.error("address == nil")
                break
            }
            
            firmwareCount = Int(count)
            log.debug("Start count: \(self.firmwareCount)")
            if firmwareDownloading == false {
                downloadNext()
            }
            
        case .downloaded:
            log.debug("downloaded: finished")
            firmwareDownloading = false
            activateFirmware()
            firmwareUpgradeProgressSubject?.onCompleted()
            break
            
        default:
            log.error("didFirmwareStatusUpdated unknowed status")
            break
        }
        
    }
    
    
    func activateFirmware() {
        var command = [UInt8](repeating: 0, count: 1)
        command[0] = FirmwareOpcode.activate.rawValue
        firmwareControlHandler.writeWithResponse(command)
    }
    
    
    func upgradeFirmware(_ binData: Data, address: UInt32) -> Observable<Double> {
        log.debug("upgradeFirmware length: \(binData.count), address: \(address)")
        firmwareBytes = [UInt8](repeating: 0, count: binData.count)
        binData.copyBytes(to: &(firmwareBytes!), count: firmwareBytes!.count)
        
        //        firmwareCount = UInt32(address)
        let size = UInt32(binData.count)
        
        let byteBuffer = ByteBuffer()
        byteBuffer.put(FirmwareOpcode.prepare.rawValue)
        byteBuffer.put(address)
        byteBuffer.put(size)
        
        firmwareStatusHandler.notify(true)
        firmwareControlHandler.writeWithResponse(byteBuffer.buffer)
        
        firmwareUpgradeProgressSubject = PublishSubject()
        return firmwareUpgradeProgressSubject!.asObserver()
    }
    
    
    func upgradeFirmware(_ path: String, address: UInt32) -> Observable<Double>? {
        guard let binData = try? Data(contentsOf: URL(fileURLWithPath: path)) else {
            return nil
        }
        
        return upgradeFirmware(binData, address: address)
    }
    
    
    func didFirmwareTimeUpdated(_ bytes: [UInt8]) {
        let byteBuffer = ByteBuffer(bytes: bytes)
        guard let buildTimeInt: Int32 = byteBuffer.get() else {
            return
        }
        
        let buildTime = Date(timeIntervalSince1970: TimeInterval(buildTimeInt))
        log.debug("firmwareTime: \(buildTime))")
        firmwareBuildTimeSubject.onNext(buildTime)
    }
    
}







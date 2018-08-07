//
//  DeviceInformationServiceHandler.swift
//  BajaLamp
//
//  Created by YangZhiyong on 16/3/13.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import CoreBluetooth


protocol DeviceInformationServiceDelegate {
    func didSerialNumberUpdated(_ serialNumber: String?)
    func didModelNumberUpdated(_ modelNumber: String?)
    func didFirmwareRevisionUpdated(_ firmwareRevision: String?)
}


class DeviceInformationServiceHandler: ServiceHandler {
    
    static let uuidService           = CBUUID(string: "180A")
    static let uuidManufacturerName  = CBUUID(string: "2A29")
    static let uuidModelNumber       = CBUUID(string: "2A24")
    static let uuidSerialNumber      = CBUUID(string: "2A25")
    static let uuidFirmwareRevision  = CBUUID(string: "2A26")
    static let uuidSoftwareRevision  = CBUUID(string: "2A28")

    
    override func getUuid() -> CBUUID? {
        return DeviceInformationServiceHandler.uuidService
    }
    
    
    var delegate: DeviceInformationServiceDelegate?
    
    var manufacturerNameHandler: CharacteristicHandler!
    
    lazy var didManufacturerNameDiscovered: () -> Void = {
        [weak self] in
        print("didManufacturerNameDiscovered")
    }
    
    
    
    var serialNumberHandler: CharacteristicHandler!
    var serialNumber: String?
    
    lazy var didSerialNumberDiscovered: () -> Void = {
        [weak self] in
        print("didSerialNumberDiscovered")
        self?.serialNumberHandler.read()
    }
    
    lazy var didSerialNumberUpdateValue: ([UInt8]) -> Void = {
        [weak self] bytes in
        self?.didSerialNumberUpdated(bytes)
    }
    
    func didSerialNumberUpdated(_ bytes: [UInt8]) {
        serialNumber = String(bytes: bytes, encoding: String.Encoding.utf8)
        delegate?.didSerialNumberUpdated(serialNumber)
    }
    
    var modelNumberHandler: CharacteristicHandler!
    var modelNumber: String?
    
    lazy var didModelNumberDiscovered: () -> Void = {
        [weak self] in
        print("didModelNumberDiscovered")
        self?.modelNumberHandler.read()
    }
    
    lazy var didModelNumberUpdateValue: ([UInt8]) -> Void = {
        [weak self] bytes in
        self?.didModelNumberUpdated(bytes)
    }
    
    func didModelNumberUpdated(_ bytes: [UInt8]) {
        modelNumber = String(bytes: bytes, encoding: String.Encoding.utf8)
        delegate?.didModelNumberUpdated(modelNumber)
    }
    
    var firmwareRevisionHandler: CharacteristicHandler!
    var firmwareRevision: String?
    
    lazy var didFirmwareRevisionDiscovered: () -> Void = {
        [weak self] in
        print("didFirmwareRevisionDiscovered")
        self?.firmwareRevisionHandler.read()
    }
    
    lazy var didFirmwareRevisionUpdateValue: ([UInt8]) -> Void = {
        [weak self] bytes in
        self?.didFirmwareRevisionUpdated(bytes)
    }
    
    func didFirmwareRevisionUpdated(_ bytes: [UInt8]) {
        firmwareRevision = String(bytes: bytes, encoding: String.Encoding.utf8)
        delegate?.didFirmwareRevisionUpdated(firmwareRevision)
    }
    
    private func addManufacturerNameHandler(){
        manufacturerNameHandler = CharacteristicHandler(DeviceInformationServiceHandler.uuidManufacturerName)
        manufacturerNameHandler.onDiscovered { [weak self] in
            self?.didManufacturerNameDiscovered()
        }
        addCharacteristicHandler(manufacturerNameHandler)
    }
    
    private func addSerialNumberHandler(){
        serialNumberHandler = CharacteristicHandler(DeviceInformationServiceHandler.uuidSerialNumber)
        serialNumberHandler.onDiscovered { [weak self] in
            self?.didSerialNumberDiscovered()
        }
        serialNumberHandler.onUpdateValue { [weak self] bytes in
            self?.didSerialNumberUpdated(bytes)
        }
        addCharacteristicHandler(serialNumberHandler)
    }
    
    private func addModelNumberHandler(){
        modelNumberHandler = CharacteristicHandler(DeviceInformationServiceHandler.uuidModelNumber)
        modelNumberHandler.onDiscovered { [weak self] in
            self?.didModelNumberDiscovered()
        }
        modelNumberHandler.onUpdateValue() { [weak self] bytes in
            self?.didModelNumberUpdated(bytes)
        }
        addCharacteristicHandler(modelNumberHandler)
    }
    
    private func addFirmwareRevisionHandler(){
        firmwareRevisionHandler = CharacteristicHandler(DeviceInformationServiceHandler.uuidFirmwareRevision)
        firmwareRevisionHandler.onDiscovered { [weak self] in
            self?.didFirmwareRevisionDiscovered()
        }
        firmwareRevisionHandler.onUpdateValue() { [weak self] bytes in
            self?.didFirmwareRevisionUpdated(bytes)
        }
        addCharacteristicHandler(firmwareRevisionHandler)
    }
    
    override init() {
        
        super.init()
        addManufacturerNameHandler()
        addSerialNumberHandler()
        addModelNumberHandler()
        addFirmwareRevisionHandler()
    }

}






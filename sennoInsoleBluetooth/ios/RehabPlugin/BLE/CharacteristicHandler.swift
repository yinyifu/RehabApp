//
//  CharacteristicHandler.swift
//  XBand
//
//  Created by YangZhiyong on 15/5/1.
//  Copyright (c) 2015年 YangZhiyong. All rights reserved.
//

import Foundation
import CoreBluetooth

//typealias DiscoverCallback = () -> ()
//typealias UpdateValueCallback = ([UInt8]) -> ()
//typealias WriteValueCallback = () -> ()

class CharacteristicHandler {
    var characteristic: CBCharacteristic?
    var uuid: CBUUID?
    
    private var didDiscoverCallback: (()->())?
    private var didUpdateValueCallback: (([UInt8])->())?
    private var didWriteValueCallback: (()->())?
    private var didUpdateNotificationStateCallback: (()->())?

    init(
        didDiscover: (() -> Void)?,
        didUpdateValue: (([UInt8]) -> Void)?,
        didWriteValue: (() -> Void)?,
        forUUID uuid: CBUUID )
    {
        self.uuid = uuid
        self.didDiscoverCallback = didDiscover
        self.didUpdateValueCallback = didUpdateValue
        self.didWriteValueCallback = didWriteValue
    }

    init(_ uuid: CBUUID) {
        self.uuid = uuid
    }

    func onDiscovered(_ callback: @escaping () -> Void) {
        didDiscoverCallback = callback
    }
    
    func onUpdateValue(_ callback: @escaping ([UInt8]) -> Void) {
        didUpdateValueCallback = callback
    }
    
    func onWriteValue(_ callback: @escaping () -> Void) {
        didWriteValueCallback = callback
    }
    
    func onUpdateNotificationState(_ callback: @escaping () -> Void) {
        didUpdateNotificationStateCallback = callback
    }

    func getBytes() -> [UInt8]? {
        if let value = characteristic?.value {
            var bytes = [UInt8](repeating: 0, count: value.count)
            value.copyBytes(to: &bytes, count: bytes.count)
            return bytes
        }
        return nil
    }
    
    func getValue() -> Data? {
        return characteristic?.value
    }
    
    
    var bytes: [UInt8]? {
        get {
            if let value = characteristic?.value {
                var bytes = [UInt8](repeating: 0, count: value.count)
                value.copyBytes(to: &bytes, count: bytes.count)
                return bytes
            }
            return nil
        }
    }
    
    
    func didDiscover(_ characteristic: CBCharacteristic?) {
        print("       didDiscover characteristic: \(String(describing: characteristic?.uuid))")
        self.characteristic = characteristic
        didDiscoverCallback?()
    }
    
    func didUpdateValue() {
        if let data = characteristic?.value {
            var bytes = [UInt8](repeating: 0, count: data.count)
            data.copyBytes(to: &bytes, count: bytes.count)
            didUpdateValueCallback?(bytes)
        }
    }
    
    func didWriteValue() {
        didWriteValueCallback?()
    }
    
    func didUpdateNotificationState() {
        didUpdateNotificationStateCallback?()
    }
    
    func notify(_ enable: Bool) {
        if let peripheral = characteristic?.service.peripheral {
            peripheral.setNotifyValue(enable, for: characteristic!)
        }
    }
    
    func read() {
        if let peripheral = characteristic?.service.peripheral {
            peripheral.readValue(for: characteristic!)
        }
    }
    
    func writeWithResponse(_ bytes: [UInt8]) {
        if let peripheral = characteristic?.service.peripheral {
            peripheral.writeValue(Data(bytes: bytes), for: characteristic!, type: .withResponse)
        }
    }
    
    func writeWithoutResponse(_ bytes: [UInt8]) {
        if let peripheral = characteristic?.service.peripheral {
            peripheral.writeValue(Data(bytes: bytes), for: characteristic!, type: .withoutResponse);
        }
    }
    
}




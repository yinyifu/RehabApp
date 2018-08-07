
import Foundation
import CoreBluetooth
import RxSwift


// MARK: ClientDelegate
//protocol ClientDelegate {
//    func didConnected()
//    func didClientReady()
//    func didDisConnected()
//    func didUpdateSignalLevel(signalLevel: Int)
//}


class Client: NSObject {
    
    
    enum State {
        case disappeared
        case discovered
        case connecting
        case connected
        case gattDiscovering
        case gattDiscovered
        case disconnecting
        case disconnected
    }
    
    var peripheral: CBPeripheral!
    
    init(peripheral: CBPeripheral, rssi RSSI: NSNumber) {
        super.init()
        
        self.peripheral = peripheral
        peripheral.delegate = self
        
        self.update(RSSI)
    }
    
    required init?(peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        self.peripheral = peripheral
        return nil
    }
    
   
    
//    var clientDelegate: ClientDelegate?
    var serviceHandlers = [CBUUID: ServiceHandler]()

    var discoveryTime = Date()

    var signalLevel: Int = 0
    var isConnected: Bool {
        return peripheral.state == .connected
    }
    
    var stateSubject: BehaviorSubject<State> = BehaviorSubject(value: State.disappeared)

    func update(_ rssi: NSNumber) {
        if signalLevel != rssi.intValue {
            signalLevel = rssi.intValue
//            clientDelegate?.didUpdateSignalLevel(rssi.integerValue)
        }

        discoveryTime = Date()
    }
    
    func onDiscovered() {
        if try! stateSubject.value() != .discovered {
            stateSubject.onNext(.discovered)
        }
    }

    var batteryLevel: Int = 0 {
        didSet {
            if batteryLevel > 100 {
                batteryLevel = 100
            } else if batteryLevel < 0 {
                batteryLevel = 0
            }
        }
    }
    
    
    func addServiceHandler(_ serviceHandler: ServiceHandler) {
        serviceHandlers[serviceHandler.getUuid()!] = serviceHandler
    }
    
//    class func createClient(_ peripheral: CBPeripheral, manufacturerData: Data) -> Client? {
//        
//        if manufacturerData.count != 10 {
//            print("wrong data length: \(manufacturerData.count)")
//            return nil
//        }
//        
//        var byteArray: [UInt8] = Array(repeating: 0, count: manufacturerData.count)
//        (manufacturerData as NSData).getBytes(&byteArray, length: manufacturerData.count)
//
//        let client = Client()
//        client.peripheral = peripheral
//        
//        return client
//    }



    func didConnected(_ peripheral: CBPeripheral!) {

//        clientDelegate?.didConnected()
        stateSubject.onNext(State.connected)
        
        for (_, value) in serviceHandlers {
            value.discovered = false
        }
        
        if let services = self.peripheral.services {
            log.info("peripheral already have services")
            for service in services {
                print("   \(service.uuid)")
//                let serviceHandler = serviceHandlers[service.UUID]
            }

        } else {
            log.info("discoverServices: \(Array(self.serviceHandlers.keys))")
            stateSubject.onNext(State.gattDiscovering)
            self.peripheral.discoverServices(Array(serviceHandlers.keys))
        }
        
    }
    
    func didDisconnected() {
        signalLevel = 0
//        clientDelegate?.didDisConnected()
        stateSubject.onNext(State.disconnected)
    }
    

    func didFailToConnectPeripheral(_ peripheral: CBPeripheral!, error: NSError!) {
        stateSubject.onNext(State.disconnected)
    }


}


// MARK: CBPeripheralDelegate
extension Client: CBPeripheralDelegate {

    @objc func peripheralDidUpdateName(_ peripheral: CBPeripheral) {
        
    }
    

    @objc func peripheral(_ peripheral: CBPeripheral, didModifyServices invalidatedServices: [CBService]) {
        
    }
    
    
//    func peripheralDidUpdateRSSI(peripheral: CBPeripheral!, error: NSError!) {
//        println("Client: \(clientBean?.uid), peripheralDidUpdateRSSI: \(peripheral.RSSI)")
//    }
    

    @objc func peripheral(_ peripheral: CBPeripheral, didReadRSSI RSSI: NSNumber, error: Error?) {
//        println("Client: \(clientBean?.uid), peripheralDidUpdateRSSI: \(RSSI)")
        update(RSSI)
    }

    @objc func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        log.debug("didDiscoverServices")
        
        if error != nil {
            log.error("Client didDiscoverServices ERROR: \(String(describing: error))")
            return
        }
        
        guard let services = peripheral.services else {
            return
        }

        for service in services {
            print("   \(service.uuid)")
            serviceHandlers[service.uuid]?.didDiscovered(service)
        }
    }
    
    
//    @objc(peripheral:didDiscoverIncludedServicesForService:error:)(peripheral:didDiscoverIncludedServicesForService:error:) func peripheral(_ peripheral: CBPeripheral, didDiscoverIncludedServicesFor service: CBService, error: Error?) {
//        
//    }

    @objc(peripheral:didDiscoverCharacteristicsForService:error:) func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        
        log.debug("didDiscoverCharacteristicsForService Service: \(service.uuid)")
        serviceHandlers[service.uuid]?.didDiscoverCharacteristics()
        
//        serviceHandlers.forEach() {
//            (key, value) in
//            if value.discovered == false {
//                break
//            }
//        }
        
        // TODO: value.discovered = true
        for (_, value) in serviceHandlers {
            if value.discovered == false {
                return
            }
        }
        
        stateSubject.onNext(.gattDiscovered)
    }
    

    @objc(peripheral:didUpdateValueForCharacteristic:error:) func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        serviceHandlers[characteristic.service.uuid]?.characteristicHandlers[characteristic.uuid]?.didUpdateValue()
    }
    

    @objc(peripheral:didWriteValueForCharacteristic:error:) func peripheral(_ peripheral: CBPeripheral, didWriteValueFor characteristic: CBCharacteristic, error: Error?) {
        serviceHandlers[characteristic.service.uuid]?.characteristicHandlers[characteristic.uuid]?.didWriteValue()
    }
    

    @objc(peripheral:didUpdateNotificationStateForCharacteristic:error:) func peripheral(_ peripheral: CBPeripheral, didUpdateNotificationStateFor characteristic: CBCharacteristic, error: Error?) {
        
    }
 
    
    @objc(peripheral:didDiscoverDescriptorsForCharacteristic:error:) func peripheral(_ peripheral: CBPeripheral, didDiscoverDescriptorsFor characteristic: CBCharacteristic, error: Error?) {
        
    }
    

    @objc(peripheral:didUpdateValueForDescriptor:error:) func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor descriptor: CBDescriptor, error: Error?) {
        
    }
    

    @objc(peripheral:didWriteValueForDescriptor:error:) func peripheral(_ peripheral: CBPeripheral, didWriteValueFor descriptor: CBDescriptor, error: Error?) {
        
    }
    
}

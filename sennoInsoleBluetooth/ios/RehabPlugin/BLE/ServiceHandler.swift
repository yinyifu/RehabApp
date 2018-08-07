

import Foundation
import CoreBluetooth


class ServiceHandler {
    
    var service: CBService?
    var characteristicHandlers = [CBUUID: CharacteristicHandler]()
    var discovered = false
    
    func addCharacteristicHandler(_ characteristicHandler: CharacteristicHandler) {
        characteristicHandlers[characteristicHandler.uuid!] = characteristicHandler
    }
    
    func getUuid() -> CBUUID? {
        return nil
    }
    
    func didDiscovered(_ service: CBService) {
        print("   didDiscover service: \(service.uuid)")
        self.service = service
        
        print("       discoverCharacteristics")
        self.service?.peripheral.discoverCharacteristics(Array(characteristicHandlers.keys), for: self.service!)
    }
    
    func didDiscoverCharacteristics() {
        if let characteristics = service?.characteristics {
            for characteristic in characteristics {
                print("       discoverCharacteristic: \(characteristic.uuid)")
                characteristicHandlers[characteristic.uuid]?.didDiscover(characteristic)
            }
        }
        
        discovered = true
    }

}




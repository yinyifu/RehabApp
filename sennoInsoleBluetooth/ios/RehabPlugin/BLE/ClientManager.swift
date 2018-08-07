

import UIKit
import Foundation
import CoreBluetooth
import RxSwift
import XCGLogger

let kCentralManagerIdentifier = "CentralManagerIdentifier"

enum DiscoverEvent<ClientType> {
    case discovered(ClientType)
    case update(ClientType)
    case disappeared(ClientType)
}

class ClientManager<ClientType: Client>: NSObject, CBCentralManagerDelegate {
    
    let kMonitorTimeInterval: TimeInterval = 0.5
    let kDiscoveryDeadTime: TimeInterval = 5
    
    var centralManager: CBCentralManager!
    
    var discoveredClients = [ClientType]()
    var connectingClients = [ClientType]()
    var connectedClients = [ClientType]()
    
    var clientsMonitorTimer: Timer!
    var restoredPeripherals: [CBPeripheral]?
    
    var nearestClient: ClientType?
    
    let bluetoothStateSubject = BehaviorSubject<Bool>(value: false)
    
    let discoveryStatusSubject = BehaviorSubject<Bool>(value: false)
    
    let discoverClientSubject = PublishSubject<DiscoverEvent<ClientType>>()
    
    let nearestClientSubject = BehaviorSubject<ClientType?>(value: nil)
    
    var lock = NSLock()
    
    override init() {
        super.init()
        log.debug("ClientManager init")
        centralManager = CBCentralManager(delegate: self, queue: DispatchQueue.global(qos: .background)/*, options: [CBCentralManagerOptionRestoreIdentifierKey:kCentralManagerIdentifier]*/);
        
        clientsMonitorTimer = Timer.scheduledTimer(timeInterval: kMonitorTimeInterval, target: self, selector: #selector(ClientManager.onClientsMonitorTimerFired), userInfo: nil, repeats: true)
        //NSRunLoop.currentRunLoop().addTimer(clientsMonitorTimer, forMode: NSRunLoopCommonModes)
    }
    func discoverClient() -> PublishSubject<DiscoverEvent<ClientType>> {
        let status = try! discoveryStatusSubject.value()
        log.debug("scan status \(status)")
        if !status {
            startScan(nil)
        }
        
        return discoverClientSubject
    }
    
    
    
    func discoverNearestClient() -> BehaviorSubject<ClientType?> {
        let status = try! discoveryStatusSubject.value()
        log.debug("scan status \(status)")
         print("boosted");
        if !status {
            startScan(nil)
        }
        return nearestClientSubject
    }
    
    
    
    func stopDiscovery(_ disposable: Disposable?) {
        disposable?.dispose()
        if !nearestClientSubject.hasObservers && !discoverClientSubject.hasObservers {
            stopScan()
        }
    }
    
    
    @objc func onClientsMonitorTimerFired() {
        print("timer fired");
        var removeList = [Int]()
        var nearestClientDisappeared = false
        
        //TODO: discoveredClients, nearestClient 加锁
//        objc_sync_enter(discoveredClients)
//        objc_sync_enter(nearestClient)
        lock.lock()
        for (i, client) in discoveredClients.enumerated() {
            let interval = client.discoveryTime.timeIntervalSinceNow
            if interval < -kDiscoveryDeadTime {
                removeList.append(i)
//                log.debug("disapear \(client) for \(interval) seconds")
                if nearestClient == client {
                    nearestClient = nil
                    nearestClientDisappeared = true
                }
            }
        }
        
        if !removeList.isEmpty {
            for i in removeList.reversed() {
                let client = discoveredClients.remove(at: i)
                client.update(0)
                discoverClientSubject.onNext(.disappeared(client))
            }
        }
        
        if nearestClient == nil {
            if discoveredClients.isEmpty {
                if nearestClientDisappeared {
                    nearestClientSubject.onNext(nil)
                }
            } else {
                nearestClient = discoveredClients.first
                for client in discoveredClients {
                    if client.signalLevel > nearestClient!.signalLevel {
                        nearestClient = client
                    }
                }
                nearestClientSubject.onNext(nearestClient)
            }
        }
        lock.unlock()
//        objc_sync_exit(nearestClient)
//        objc_sync_exit(discoveredClients)
    }
    
    
    private func startScan (_ serviceUUIDs: [CBUUID]?) {
        log.debug("startScan")
        discoveryStatusSubject.onNext(true)
        centralManager.scanForPeripherals(withServices: serviceUUIDs, options: [CBCentralManagerScanOptionAllowDuplicatesKey:true])
    }
    
    
//    func startScan() {
//        startScan(nil)
//    }
    
    private func stopScan () {
        log.debug("stopScan")
        centralManager.stopScan()
        discoveryStatusSubject.onNext(false)
        nearestClientSubject.onNext(nil)
        nearestClient = nil
        
        discoveredClients.removeAll(keepingCapacity: false)
    }
    
    
    
    private func retrieveConnectedPeripheralsWithServices(_ serviceUUIDs: [CBUUID]) -> [CBPeripheral] {
        return centralManager.retrieveConnectedPeripherals(withServices: serviceUUIDs)
    }
    
    func connect(_ client: ClientType) {
        connectingClients.append(client)
        let options = [ CBConnectPeripheralOptionNotifyOnConnectionKey: true,
                        CBConnectPeripheralOptionNotifyOnDisconnectionKey: true,
                        CBConnectPeripheralOptionNotifyOnNotificationKey: true ]
        centralManager.connect(client.peripheral, options: options)
    }
    
    
    func disconnect(_ client: ClientType) {
        centralManager.cancelPeripheralConnection(client.peripheral)
    }
    
    
    // MARK: CBCentralManagerDelegate
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        //        log.debugln("centralManagerDidUpdateState: \(central.state)")
        switch central.state {
        case .unknown:
            log.debug("centralManagerDidUpdateState: Unknown")
            bluetoothStateSubject.onNext(false)
            
        case .resetting:
            log.debug("centralManagerDidUpdateState: Resetting")
            bluetoothStateSubject.onNext(false)
            
        case .unsupported:
            log.debug("centralManagerDidUpdateState: Unsupported")
            bluetoothStateSubject.onNext(false)
            
        case .unauthorized:
            log.debug("centralManagerDidUpdateState: Unauthorized")
            bluetoothStateSubject.onNext(false)
            
        case .poweredOff:
            log.debug("centralManagerDidUpdateState: PoweredOff")
            bluetoothStateSubject.onNext(false)
            
        case .poweredOn:
            log.debug("centralManagerDidUpdateState: PoweredOn")
            bluetoothStateSubject.onNext(true)
            
            if let peripherals = restoredPeripherals {
                for peripheral in peripherals {
                    log.debug("   cancelPeripheralConnection \(peripheral)")
                    centralManager.cancelPeripheralConnection(peripheral)
                }
                restoredPeripherals = nil
            }
            
            log.debug("ClientManager centralManager retrieveConnectedPeripherals")
            
            if nearestClientSubject.hasObservers || discoverClientSubject.hasObservers {
                startScan(nil)
            }
            
        }
        
    }
    
    
    func centralManager(_ central: CBCentralManager, willRestoreState dict: [String : Any]) {
        // TODO:
        log.debug("ClientManager centralManager willRestoreState")
        restoredPeripherals = dict[CBCentralManagerRestoredStatePeripheralsKey] as? [CBPeripheral]
        
    }
    
    
    
    func centralManager(_ central: CBCentralManager!, didRetrievePeripherals peripherals: [AnyObject]!) {
        log.debug("ClientManager centralManager didRetrievePeripherals")
        for item in peripherals {
            if let peripheral = item as? CBPeripheral {
                log.debug("    peripheral: \(String(describing: peripheral.name))")
            }
        }
    }
    
    
    
    func centralManager(_ central: CBCentralManager!, didRetrieveConnectedPeripherals peripherals: [AnyObject]!) {
        log.debug("ClientManager centralManager didRetrieveConnectedPeripherals")
        for item in peripherals {
            if let peripheral = item as? CBPeripheral {
                log.debug("    peripheral: \(String(describing: peripheral.name))")
            }
        }
    }
    
    
    @objc(centralManager:didDiscoverPeripheral:advertisementData:RSSI:) func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        
        if RSSI.int32Value > 0 {
            return
        }
//        objc_sync_enter(discoveredClients)
//        objc_sync_enter(nearestClient)
        for client in discoveredClients {
            if client.peripheral == peripheral {
                client.update(RSSI)
                client.onDiscovered()
                discoverClientSubject.onNext(.update(client))
                
                if nearestClient == nil {
                    nearestClient = client
                    nearestClientSubject.onNext(nearestClient)
                    return
                } else if nearestClient != client {
                    if nearestClient != nil {
                        if nearestClient!.signalLevel < client.signalLevel {
                            nearestClient = client
                            nearestClientSubject.onNext(nearestClient)
                        }
                    }
                } else {
                    nearestClientSubject.onNext(nearestClient)
                }
                
                return
            }
        }
//        objc_sync_exit(nearestClient)
//        objc_sync_exit(discoveredClients)
        if let client = ClientType(peripheral: peripheral, advertisementData: advertisementData, rssi: RSSI) {
//            log.debug("discover new \(client)")
            lock.lock()
            client.update(RSSI)
            client.onDiscovered()
            
            discoveredClients.insert(client, at: 0)
            discoverClientSubject.onNext(.discovered(client))
            lock.unlock()
        }
    }
    
    
    @objc(centralManager:didConnectPeripheral:) func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        log.debug("ClientManager didConnectPeripheral: \(peripheral)")
        
        var connectedClient: ClientType?
        
        for (index, client) in connectingClients.enumerated() {
            if client.peripheral == peripheral {
                connectingClients.remove(at: index)
                connectedClient = client
                //client.didConnectPeripheral(peripheral)
                break
            }
        }
        
        for (index, client) in discoveredClients.enumerated() {
            if client.peripheral == peripheral {
                discoveredClients.remove(at: index)
                connectedClient = client
                break
            }
        }
        
        if let connectedClient = connectedClient {
            connectedClients.append(connectedClient)
            connectedClient.didConnected(peripheral)
        } else {
            log.debug("connectedClient == nil")
        }
    }
    
    
    @objc(centralManager:didFailToConnectPeripheral:error:) func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?) {
        log.debug("ClientManager didFailToConnectPeripheral \(peripheral)")
        
        for client in connectingClients {
            if client.peripheral == peripheral {
                client.didFailToConnectPeripheral(peripheral, error: error as NSError!)
            }
        }
    }
    
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        //        delegate?.didOwnedClientsChanged?()
        log.debug("ClientManager didDisconnectPeripheral \(peripheral)")
        
        for (index, client) in connectedClients.enumerated() {
            log.debug("client in connectedClients: \(client.peripheral.identifier)")
            if client.peripheral == peripheral {
                client.didDisconnected()
                connectedClients.remove(at: index)
                break
            }
        }
    }
}





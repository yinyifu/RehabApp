//
//  RxNetworkReachability.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/11/22.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import SystemConfiguration
import RxSwift
import XCGLogger


private func callback(reachability: SCNetworkReachability, flags: SCNetworkReachabilityFlags, info: UnsafeMutableRawPointer?) {
    RxNetworkReachability.sharedInstance.update(reachability: reachability, flags: flags, info: info)
//    log.debug("callback flags: \(flags)")
//    
//    if flags.contains(.connectionAutomatic) {
//        log.debug("connectionAutomatic")
//    }
//    
//    if flags.contains(.reachable) {
//        log.debug("reachable")
//    }
//    
//    if flags.contains(.connectionRequired) {
//        log.debug("connectionRequired")
//    }
//    
//    if flags.contains(.connectionOnTraffic) {
//        log.debug("connectionOnTraffic")
//    }
//    
//    if flags.contains(.interventionRequired) {
//        log.debug("interventionRequired")
//    }
//    
//    if flags.contains(.connectionOnDemand) {
//        log.debug("connectionOnDemand")
//    }
//    
//    if flags.contains(.isLocalAddress) {
//        log.debug("isLocalAddress")
//    }
//    
//    if flags.contains(.isDirect) {
//        log.debug("isDirect")
//    }
//    
//    if flags.contains(.isWWAN) {
//        log.debug("isWWAN")
//    }
//    
//    if flags.contains(.connectionAutomatic) {
//        log.debug("connectionAutomatic")
//    }
}


class RxNetworkReachability {
    
    enum Reachability {
        case none, wifi, cellular
        
        static func convert(flags: SCNetworkReachabilityFlags) -> Reachability {
            if flags.contains(.reachable) {
                if flags.contains(.isWWAN) {
                    return .cellular
                } else {
                    return .wifi
                }
            } else {
                return .none
            }
        }
    }
    
    static let sharedInstance = RxNetworkReachability()
    
    let subject: BehaviorSubject<Reachability>!
    
    
    // TODO: 处理异常错误
    init() {
        var result = false
        
        let networkReachability = SCNetworkReachabilityCreateWithName(nil, "www.sennotech.com")!
        
        var flags = SCNetworkReachabilityFlags()
        result = SCNetworkReachabilityGetFlags(networkReachability, &flags)
        if result == false {
            log.error("SCNetworkReachabilityGetFlags failed")
        }
        
        log.debug("networkReachability flags: \(flags)")
        subject = BehaviorSubject<Reachability>(value: Reachability.convert(flags: flags))
        
        var context = SCNetworkReachabilityContext()
        result = SCNetworkReachabilitySetCallback(networkReachability, callback, &context)
        if result == false {
            log.error("SCNetworkReachabilitySetCallback failed")
        }
        
        log.debug("SCNetworkReachabilitySetCallback succeed")
        
        let queue = DispatchQueue.global(qos: DispatchQoS.background.qosClass)
        result = SCNetworkReachabilitySetDispatchQueue(networkReachability, queue)
        if result == false {
            log.error("SCNetworkReachabilitySetDispatchQueue failed")
        }
        
        log.debug("SCNetworkReachabilitySetDispatchQueue succeed")
    }
    
    fileprivate func update(reachability: SCNetworkReachability, flags: SCNetworkReachabilityFlags, info: UnsafeMutableRawPointer?) {
        let reachability = Reachability.convert(flags: flags)
        
        let oldValue = try! RxNetworkReachability.sharedInstance.subject.value()
        
        if reachability != oldValue {
            RxNetworkReachability.sharedInstance.subject.onNext(reachability)
        }
    }
}







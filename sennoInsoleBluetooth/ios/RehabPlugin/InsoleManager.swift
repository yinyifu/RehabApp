//
//  InsoleManager.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/17.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import RxSwift
import XCGLogger

let log = XCGLogger.default;
class InsoleManager {
    
    static let shareInstance = InsoleManager()
    
    let clientManager = ClientManager<InsoleClient>()
    
    

    
    init() {
        insoleManagerChangeNewUser()
    }
    
    func insoleManagerChangeNewUser(){
    }
    
    
    
    
    
    deinit {
//        reportResultsToken?.stop()
    }
    
    
    func connect(_ leftClient: InsoleClient, _ rightClient : InsoleClient) {
        clientManager.connect(leftClient)
        clientManager.connect(rightClient)
    }
    
    
    
//    func add(_ report: Report) {
//        try! realm.write {
//            realm.add(report)
//        }
//    }
    
//    func add(_ readModel: ReadReportModel){
//        let realm = MainRealm.sharedInstance.realm!
//        try! realm.write {
//            realm.add(readModel)
//        }
//    }
    
    
    
}






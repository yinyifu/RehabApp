//
//  PairedInsoleConnection.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/19.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import RxSwift


// TODO 优化左右脚model和client关系。
class PairedInsoleConnection {
    
    var model: PairedInsoleModel
    
    var leftClient: InsoleClient?
    var rightClient: InsoleClient?
    
    var leftStateDisposable: Disposable?
    var rightStateDisposable: Disposable?
    
    enum State {
        case discoverLeft
        case discoverRight
        case connectLeft
        case connectRight
        case connected
    }

    init(model: PairedInsoleModel) {
        self.model = model
    }
    
    
    func connect() {
        guard let _ = leftClient, let _ = rightClient else {
            return
        }
        
        

    }
    
    
    func disconnect() {
        
    }
    
    
}


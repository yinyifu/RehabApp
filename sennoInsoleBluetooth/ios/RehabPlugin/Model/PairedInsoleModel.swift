//
//  PairedInsoleModel.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/18.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import RealmSwift

class PairedInsoleModel: Object {
    dynamic var left: InsoleModel?
    dynamic var right: InsoleModel?
    
    dynamic var InsoleName: String?
    dynamic var createTime = Date()
}


//
//  InsoleModel.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/18.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import RealmSwift


class InsoleModel: Object {
    
    dynamic var serialNumber: Data?
    dynamic var firmwareEditTime: Data?
    dynamic var firmwareVersion: String?
}


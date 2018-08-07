//
//  TagModel.swift
//  SennoInsole
//
//  Created by Sennotech on 2016/12/7.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import UIKit
import RealmSwift

class TagModel: Object {
    
    dynamic var describeString: String?
    dynamic var createTime = Date()
    dynamic var tagCount : Int = 0
    
}

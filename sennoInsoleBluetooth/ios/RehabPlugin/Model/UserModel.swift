//
//  UserModel.swift
//  SennoInsole
//
//  Created by Sennotech on 2017/1/12.
//  Copyright © 2017年 YangZhiyong. All rights reserved.
//

import UIKit
import RealmSwift

class UserModel: Object {

     dynamic var id : Int = 0
     dynamic var name: String?
     dynamic var phone: String?
     dynamic var weight : Int = 0
     dynamic var height : Int = 0
     dynamic var gender : Int = 0
     dynamic var age : Int = 0
     dynamic var reportCount : Int = 0
     dynamic var mark: String?
}

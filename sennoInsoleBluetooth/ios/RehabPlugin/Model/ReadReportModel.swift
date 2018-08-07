//
//  ReadReportModel.swift
//  SennoInsole
//
//  Created by Sennotech on 2016/11/17.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import UIKit
import RealmSwift

class ReadReportModel: Object {
    dynamic var reportId : Int = 0
    dynamic var readTime = Date()
}

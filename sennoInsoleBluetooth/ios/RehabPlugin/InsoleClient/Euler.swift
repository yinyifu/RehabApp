//
//  Euler.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/21.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation

struct Euler {
    var pitch: Double
    var roll: Double
    var yaw: Double
    
    init(q: Quaternion) {
        roll    = atan2(2.0 * (q.w * q.x + q.y * q.z), 1.0 - 2.0 * (q.x * q.x + q.y * q.y))
        pitch   = asin(2.0 * (q.w * q.y - q.z * q.x))
        yaw     = atan2(2.0 * (q.w * q.z + q.x * q.y), 1.0 - 2.0 * (q.y * q.y + q.z * q.z))
    }
}


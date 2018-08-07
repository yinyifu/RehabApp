//
//  MotionFrame.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/27.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation


struct MotionFrame: CustomStringConvertible {

    var id: Double
    var gyroscopeX: Float
    var gyroscopeY: Float
    var gyroscopeZ: Float
    var accelerometerX: Float
    var accelerometerY: Float
    var accelerometerZ: Float         // 9.8
    
    init(id: Double, gx: Float, gy: Float, gz: Float, ax: Float, ay: Float, az: Float) {
        
//        let timeUnit = 625e-6
//        let time = id * timeUnit / 2
        let gyroscopeScale: Float = 2*2000.0/65536.0
        let accelerometerScale: Float = 16 * 9.8 / 32768.0

//        self.id = time
        self.id = id
        gyroscopeX = gx * gyroscopeScale
        gyroscopeY = gy * gyroscopeScale
        gyroscopeZ = gz * gyroscopeScale
        accelerometerX = ax * accelerometerScale
        accelerometerY = ay * accelerometerScale
        accelerometerZ = az * accelerometerScale
        
    }
    

    var description: String {
        return "Gx:\(gyroscopeX), Gy:\(gyroscopeY), Gz:\(gyroscopeZ), Ax:\(accelerometerX), Ay:\(accelerometerY), Az:\(accelerometerZ)"
    }
    
    
}



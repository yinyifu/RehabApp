//
//  ReportFrameModel.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/28.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation

class ReportFrameModel: Object {
//    dynamic var index: Int32 = 0
////    dynamic var motion: MotionFrame
////    dynamic var quaternion: QuaternionFrame
//    
//    dynamic var gyroscopeX: Int16 = 0
//    dynamic var gyroscopeY: Int16 = 0
//    dynamic var gyroscopeZ: Int16 = 0
//    dynamic var accelerometerX: Int16 = 0
//    dynamic var accelerometerY: Int16 = 0
//    dynamic var accelerometerZ: Int16 = 0
//    
//    dynamic var quaternionW: Int32 = 0
//    dynamic var quaternionX: Int32 = 0
//    dynamic var quaternionY: Int32 = 0
//    dynamic var quaternionZ: Int32 = 0
    
    
    dynamic var index: Double = 0
    dynamic var gyroscopeX: Float = 0
    dynamic var gyroscopeY: Float = 0
    dynamic var gyroscopeZ: Float = 0
    dynamic var accelerometerX: Float = 0
    dynamic var accelerometerY: Float = 0
    dynamic var accelerometerZ: Float = 0
    

    convenience init(index: Double, motion: MotionFrame) {
        
        self.init()
        
        self.index = index/100
        gyroscopeX = motion.gyroscopeX
        gyroscopeY = motion.gyroscopeY
        gyroscopeZ = motion.gyroscopeZ
        accelerometerX = motion.accelerometerX
        accelerometerY = motion.accelerometerY
        accelerometerZ = motion.accelerometerZ
    }
    
//    convenience init(index: Int32, motion: MotionFrame) {
//        self.init()
//        self.index = index
//        gyroscopeX = motion.gyroscopeX
//        gyroscopeY = motion.gyroscopeY
//        gyroscopeZ = motion.gyroscopeZ
//        accelerometerX = motion.accelerometerX
//        accelerometerY = motion.accelerometerY
//        accelerometerZ = motion.accelerometerZ
//    }
    
       
    func data() -> Data {
        let buffer = ByteBuffer()
        
//        let timeUnit = 625e-6
//        let time = Double(index) * timeUnit
//        buffer.put(time)
//        
//        let gyroscopeScale: Float = 2*2000.0/65536.0
//        buffer.put(Float(gyroscopeX)*gyroscopeScale)
//        buffer.put(Float(gyroscopeY)*gyroscopeScale)
//        buffer.put(Float(gyroscopeZ)*gyroscopeScale)
//        
//        //16*9/1024*32
//        let accelerometerScale: Float = 16 * 9.8 / 32768.0
//        buffer.put(Float(accelerometerX)*accelerometerScale)
//        buffer.put(Float(accelerometerY)*accelerometerScale)
//        buffer.put(Float(accelerometerZ)*accelerometerScale)
        
        
        buffer.put(index)
        buffer.put(gyroscopeX)
        buffer.put(gyroscopeY)
        buffer.put(gyroscopeZ)
        buffer.put(accelerometerX)
        buffer.put(accelerometerY)
        buffer.put(accelerometerZ)
        
        return Data(bytes: buffer.buffer)
    }
    
}



//
//  Algorithm.swift
//  SennoInsole
//
//  Created by Sennotech on 2017/2/7.
//  Copyright © 2017年 YangZhiyong. All rights reserved.
//

import Foundation

class MotionFusion {

    var Kp:Double = 0.2
    var Ki:Double = 0				//偏向gyro 运动特性好
    var KpInit:Double = 200
    var InitPeriod:Double = 5
    var IntErrorArr:[Double] = [0,0,0]
    
    var lastMotionID: UInt32 = 0
    var quaternion: Quaternion = Quaternion(w: 1.0, x: 0.0, y: 0.0, z: 0.0)
    
    
//    func update(motion: MotionFrame, dt: Double) {
    func update(motion: MotionFrame, dt: Double, averageGyroscope: [Float]) {
        var KpRamped = KpInit
        
        let absGyroscopeX = abs(motion.gyroscopeX - averageGyroscope[0])
        let absGyroscopeY = abs(motion.gyroscopeY - averageGyroscope[1])
        let absGyroscopeZ = abs(motion.gyroscopeZ - averageGyroscope[2])
//        let amp = abs(motion.gyroscopeX)+abs(motion.gyroscopeY)+abs(motion.gyroscopeZ)
        let amp = absGyroscopeX + absGyroscopeY + absGyroscopeZ
        if amp > 5 {
            Kp = 0.02
        }else{
            Kp = 0.5
        }
        
        
        let v:[Double] = [
            2*(quaternion.x * quaternion.z - quaternion.w * quaternion.y),
            2*(quaternion.w * quaternion.x + quaternion.y * quaternion.z),
            quaternion.w * quaternion.w - quaternion.x * quaternion.x - quaternion.y * quaternion.y + quaternion.z * quaternion.z
        ]
        
        let error: [Double] = [
            v[1] * Double(motion.accelerometerZ) - v[2] * Double(motion.accelerometerY),
            v[2] * Double(motion.accelerometerX) - v[0] * Double(motion.accelerometerZ),
            v[0] * Double(motion.accelerometerY) - v[1] * Double(motion.accelerometerX)
        ]
        
        if KpRamped > Kp {
            IntErrorArr[0] = 0
            IntErrorArr[1] = 0
            IntErrorArr[2] = 0
            KpRamped = KpRamped - (KpInit - Kp) / (InitPeriod / Double(1/dt) )
        }else{
            KpRamped = Kp
            IntErrorArr[0] = IntErrorArr[0] + error[0]
            IntErrorArr[1] = IntErrorArr[1] + error[1]
            IntErrorArr[2] = IntErrorArr[2] + error[2]
        }
        
        
        var Ref: [Double] = [0,0,0]
//        Ref[0] = Double.pi * Double(motion.gyroscopeX) / Double(180) - (Kp*error[0] + Ki*IntErrorArr[0])
//        Ref[1] = Double.pi * Double(motion.gyroscopeY) / Double(180) - (Kp*error[1] + Ki*IntErrorArr[1])
//        Ref[2] = Double.pi * Double(motion.gyroscopeZ) / Double(180) - (Kp*error[2] + Ki*IntErrorArr[2])
        Ref[0] = Double.pi * Double(motion.gyroscopeX - averageGyroscope[0]) / Double(180) - (Kp*error[0] + Ki*IntErrorArr[0])
        Ref[1] = Double.pi * Double(motion.gyroscopeY - averageGyroscope[1]) / Double(180) - (Kp*error[1] + Ki*IntErrorArr[1])
        Ref[2] = Double.pi * Double(motion.gyroscopeZ - averageGyroscope[2]) / Double(180) - (Kp*error[2] + Ki*IntErrorArr[2])
        
        let Gyro_Array: [Double] = [0, Ref[0], Ref[1], Ref[2]]
        var pDot: [Double] = [0,0,0,0]
        pDot[0] = quaternion.w * Gyro_Array[0] - quaternion.x * Gyro_Array[1] - quaternion.y * Gyro_Array[2] - quaternion.z * Gyro_Array[3]
        pDot[1] = quaternion.w * Gyro_Array[1] + quaternion.x * Gyro_Array[0] + quaternion.y * Gyro_Array[3] - quaternion.z * Gyro_Array[2]
        pDot[2] = quaternion.w * Gyro_Array[2] - quaternion.x * Gyro_Array[3] + quaternion.y * Gyro_Array[0] + quaternion.z * Gyro_Array[1]
        pDot[3] = quaternion.w * Gyro_Array[3] + quaternion.x * Gyro_Array[2] - quaternion.y * Gyro_Array[1] + quaternion.z * Gyro_Array[0]
        
        //QuaternAddAddition
        let delta = 0.5
        quaternion.w = quaternion.w + delta * dt * pDot[0]
        quaternion.x = quaternion.x + delta * dt * pDot[1]
        quaternion.y = quaternion.y + delta * dt * pDot[2]
        quaternion.z = quaternion.z + delta * dt * pDot[3]
        
        quaternion = quaternion.normalize()!
        
    }
    
}

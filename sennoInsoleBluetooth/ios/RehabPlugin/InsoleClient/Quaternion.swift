//
//  Quaternion.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/21.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation


struct Quaternion {
    var w: Double
    var x: Double
    var y: Double
    var z: Double
    
    init(w: Int32, x: Int32, y: Int32, z: Int32) {
        self.w = Double(w)
        self.x = Double(x)
        self.y = Double(y)
        self.z = Double(z)
    }
    
    init(raw: QuaternionFrame) {
        self.w = Double(raw.w)
        self.x = Double(raw.x)
        self.y = Double(raw.y)
        self.z = Double(raw.z)
    }
    
    init(w: Double, x: Double, y: Double, z: Double) {
        self.w = w
        self.x = x
        self.y = y
        self.z = z
    }
    
    func normalize() -> Quaternion? {
        let scalar = sqrt(x*x + y*y + z*z + w*w) 
        if scalar == 0 {
            return nil
        }
        
        return Quaternion(w: w/scalar, x: x/scalar, y: y/scalar, z: z/scalar)
    }
    
    func euler() -> Euler {
        return Euler(q: self)
    }
}


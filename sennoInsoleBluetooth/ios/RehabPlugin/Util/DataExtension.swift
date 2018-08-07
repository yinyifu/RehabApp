//
//  DataExtension.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/18.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation

extension Data {
    var hexString: String {
        let ascTable: [Character] = [
                "0", "1", "2", "3", "4", "5", "6", "7",
                "8", "9", "A", "B", "C", "D", "E", "F"
        ]
        
        var hexString = ""
        var count:UInt = 0
        
        self.forEach { byte in
            let hi = Int(byte>>4)
            let lo = Int(byte&0x0F)
            count += 1
            
            hexString.append(ascTable[hi])
            hexString.append(ascTable[lo])
        }
        
        return hexString
    }
}


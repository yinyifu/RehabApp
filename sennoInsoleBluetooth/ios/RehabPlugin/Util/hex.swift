

import Foundation


func hexStringToBytes(_ string: String) -> [UInt8] {
    
    let hexTable:[Character:UInt8] =
    [
        "0":0x00, "1":0x01, "2":0x02, "3":0x03, "4":0x04,
        "5":0x05, "6":0x06, "7":0x07, "8":0x08, "9":0x09,
        "a":0x0A, "b":0x0B, "c":0x0C, "d":0x0D, "e":0x0E, "f":0x0F,
        "A":0x0A, "B":0x0B, "C":0x0C, "D":0x0D, "E":0x0E, "F":0x0F
    ]
    
    var bytes = [UInt8]()
    var byte: UInt8 = 0
    var highNibbleReady = false
    
    for ch in string.characters {
        
        if let nibble = hexTable[ch] {
            if highNibbleReady {
                highNibbleReady = false
                byte |= nibble
                bytes.append(byte)
            } else {
                highNibbleReady = true
                byte = nibble << 4
            }
        }
    }
    
    return bytes
    
}


func bytesToHexString(_ bytes: [UInt8]) -> String {
    let ascTable: [Character] =
    [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F"
    ]
    var hexString = ""
    var count:UInt = 0
    
    for byte in bytes {
        let hi = Int(byte>>4)
        let lo = Int(byte&0x0F)
        
//        if (count%4 == 0) && (count != 0) {
//            hexString.append(Character("-"))
//        }
        
        count += 1
        
        hexString.append(ascTable[hi])
        hexString.append(ascTable[lo])
    }
    
    return hexString
}




func bytesToHexString(_ bytes: [UInt8], start: Int, length: Int) -> String {
    var newBytes = [UInt8](repeating: 0, count: length)
    newBytes[0..<length] = bytes[start..<(start+length)]
    return bytesToHexString(newBytes)
}


//extension Array where Element: UInt8 {
//    var hexString: String {
//        get {
//            let ascTable: [Character] = [
//                    "0", "1", "2", "3", "4", "5", "6", "7",
//                    "8", "9", "A", "B", "C", "D", "E", "F" ]
//            
//            var hexString = ""
//            var count:UInt = 0
//            
//            for byte in self {
//                let hi = Int(byte>>4)
//                let lo = Int(byte&0x0F)
//                
//                //        if (count%4 == 0) && (count != 0) {
//                //            hexString.append(Character("-"))
//                //        }
//                
//                count += 1
//                
//                hexString.append(ascTable[hi])
//                hexString.append(ascTable[lo])
//            }
//            
//            return hexString
//        }
//    }
//}





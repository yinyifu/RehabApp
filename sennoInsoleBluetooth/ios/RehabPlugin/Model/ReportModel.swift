//
//  ReportModel.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/27.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import RealmSwift

class ReportModel: Object {
    
    dynamic var isPosture: Bool = false
    
    dynamic var dataQuality : String?
    dynamic var reportUrl : String?
    dynamic var baseUrl : String?
    dynamic var isRead: Bool = false
    
    enum State: Int {
        case waiting = 0, uploading, uploaded, ready, failed
    }
    
    enum ExaminationType: Int, CustomStringConvertible {
        case none, walk, run
        
        static let allValues = [none, walk, run]
        static let allValueDescriptions = ["未知类型", "步行", "慢跑"]
        
        var description: String {
            get {
                return ExaminationType.allValueDescriptions[self.rawValue]
            }
        }
    }
    
    dynamic var serverId: Int = -1
    dynamic var readTime: Date?

    dynamic var uuidString: String?
    dynamic var createTime = Date()
//    dynamic var type = -1
    dynamic var type = ""
    
    dynamic var userId = 0
    dynamic var state = 0
    dynamic var userName : String?
    dynamic var comment : String?
    
    dynamic var errorCode: Int = 0
    dynamic var errorMessage: String?
    
    var leftFrames = List<ReportFrameModel>()
    var rightFrames = List<ReportFrameModel>()
    
    dynamic var frontPostureImageData: Data?
    dynamic var frankPostureImageData: Data?
    convenience init(customerId: Int, postureType: String, images: [UIImage]) {
        self.init()
        self.createTime = Date(timeIntervalSince1970: round(Date().timeIntervalSince1970))
        self.uuidString = UUID().uuidString.replacingOccurrences(of: "-", with: "")
        self.userId = customerId
        self.type = postureType
        self.frontPostureImageData = UIImageJPEGRepresentation(images.first!, 0.6)
        self.frankPostureImageData = UIImageJPEGRepresentation(images.last!, 0.6)
//        self.frontPostureImageData = UIImageJPEGRepresentation(images.first!, 1.0)
//        self.frankPostureImageData = UIImageJPEGRepresentation(images.last!, 1.0)
        self.isPosture = true
    }
 
    
    convenience init(user: Int, type: String?, comment: String?, userName: String?) {
        self.init()
        self.createTime = Date(timeIntervalSince1970: round(Date().timeIntervalSince1970))
        self.uuidString = UUID().uuidString.replacingOccurrences(of: "-", with: "")
        self.userId = user
        self.type = type!
        self.userName = userName
        self.comment = comment
    }
    
    private func compose(motionFrames: [MotionFrame], didComposedFrame: (ReportFrameModel) -> Void) {
        var motionIndex = 0
        
        while true {
            
            if motionIndex == motionFrames.count {
                break
            }
            let motionFrame = motionFrames[motionIndex]
            
//            let reportFrame = ReportFrameModel(index: Int32(motionFrame.id), motion: motionFrame)
            let reportFrame = ReportFrameModel(index: motionFrame.id, motion: motionFrame)
            didComposedFrame(reportFrame)
            
            motionIndex += 1
            
        }
    }
    
    func fillFrames(leftMotionFrames: [MotionFrame], rightMotionFrames: [MotionFrame]) {
        
        compose(motionFrames: leftMotionFrames) {
            reportFrame in
            leftFrames.append(reportFrame)
        }
        
        compose(motionFrames: rightMotionFrames) {
            reportFrame in
            rightFrames.append(reportFrame)
        }
        
    }
    
    
    
    
    func leftData() -> Data {
        var data = Data()
        data.append(0xc0)
        leftFrames.forEach() { frame in
            data.append(frame.data())
        }
        return data
    }
    
    
    func rightData() -> Data {
        var data = Data()
         data.append(0xc0)
        rightFrames.forEach() { frame in
            data.append(frame.data())
        }
        return data
    }
    
}





//
//  AttitudeView.swift
//  InsoleX
//
//  Created by YangZhiyong on 15/12/4.
//  Copyright © 2015年 YangZhiyong. All rights reserved.
//

import Foundation
import SceneKit
import RxSwift


class AttitudeView: SCNView {
    
    private var discovDictionary : [String: InsoleClient] = [:];
    private var connDictionary : [String: InsoleClient] = [:];
    static var _left : InsoleClient?;
    static var _right : InsoleClient?;
    static var _leftDisposable: Disposable?;
    static var _rightDisposable: Disposable?;
    
    private var disp : Disposable!;
    
    private let updateFrequency = 0.1;
    var cameraNode: SCNNode!
    var boxNode: SCNNode!
    
    var leftNode: SCNNode!
    var rightNode: SCNNode!
    
    var insoleScene : SCNScene!;
    private var leftInitTransform: SCNMatrix4!
    private var rightInitTransform: SCNMatrix4!
    
    var cameraOrbit: SCNNode?
    
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setup()
    }
    
    func setup() {
        isMultipleTouchEnabled = true
        antialiasingMode = .multisampling4X
        autoenablesDefaultLighting = true
        
        insoleScene = SCNScene(named: "InsoleScene.scnassets/Insoles.scn")!
        
//        leftNode = insoleScene.rootNode.childNode(withName: "leftInsole", recursively: true)!
//        rightNode = insoleScene.rootNode.childNode(withName: "rightInsole", recursively: true)!
//        leftNode = insoleScene.rootNode.childNode(withName: "leftjyz", recursively: true)!
//        rightNode = insoleScene.rootNode.childNode(withName: "rightjyz", recursively: true)!
        leftNode = insoleScene.rootNode.childNode(withName: "leftjyzShort", recursively: true)!
        rightNode = insoleScene.rootNode.childNode(withName: "rightjyzShort", recursively: true)!
        cameraNode = insoleScene.rootNode.childNode(withName: "camera", recursively: true)!
        
        cameraOrbit = SCNNode()
        cameraOrbit?.addChildNode(cameraNode)
        insoleScene.rootNode.addChildNode(cameraOrbit!)
        
        leftInitTransform = leftNode.transform
        rightInitTransform = rightNode.transform

        
        
        self.scene = insoleScene
        self.showsStatistics = false
        self.allowsCameraControl = false
        
    }
    
    
    func updateLeft(opacity: Float) {
        leftNode.opacity = CGFloat(opacity)
    }
    
    func updateRight(opacity: Float) {
        rightNode.opacity = CGFloat(opacity)
    }
    
    func updateLeftQuaternion(quaternion: Quaternion) {

        let euler = quaternion.euler()        
        leftNode.eulerAngles.x = Float(euler.roll)
        leftNode.eulerAngles.z = Float(-euler.pitch)
//        leftNode.eulerAngles.y = Float(euler.yaw)
    }
    
    func updateRightQuaternion(quaternion: Quaternion) {

        let euler = quaternion.euler()
        rightNode.eulerAngles.x = Float(euler.roll)
        rightNode.eulerAngles.z = Float(-euler.pitch)
//        rightNode.eulerAngles.y = Float(euler.yaw)
    }
    
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let touch = touches.first?.tapCount
        switch touch! {
        case 1:
            cameraOrbit?.eulerAngles.y -= Float(Double.pi/2)
            break
        case 2:
//            let scnAction = SCNAction.rotateTo(x: 0, y: 0, z: 0, duration: 0.1)
//            cameraNode.runAction(scnAction)
            
            cameraOrbit?.eulerAngles.y = 0
        default:
            break
        }
        
    }

    
    
    
    func updateLeftMotion(roll: Double, pitch: Double){
        leftNode.eulerAngles.x = Float(roll)
        leftNode.eulerAngles.z = Float(pitch)
    }
    
    
    func updateRightMotion(roll: Double, pitch: Double){
        rightNode.eulerAngles.x = Float(roll)
        rightNode.eulerAngles.z = Float(pitch)
    }
    
    
    
    func discoverInsoles(){
        let discov = InsoleManager.shareInstance.clientManager.discoverClient();
        disp = discov.observeOn(MainScheduler.instance).subscribe(
            onNext: { element in
                switch(element){
                case .discovered(let client):
                    let count = self.discovDictionary.count;
                    
                    self.discovDictionary[bytesToHexString(client.serialNumber)] = client;
                    if(count != self.discovDictionary.count){
                        // publish the result to the app
                        self.connectPair(self.discovDictionary.keys.map{self.discovDictionary[$0]!});
                        //debug
                    }
                    break;
                case .update(let client):
                    print(client)
                    break;
                case .disappeared(let client):
                    print(client)
                    break;
                }
        }
        );
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    func connectPair(_ dat: [InsoleClient]){
        let leftOnes = dat.filter{$0.side == .left && $0.isConnected == false};
        let oneLeft = leftOnes.count >= 1;
        let rightOnes = dat.filter{$0.side == .right && $0.isConnected == false};
        let oneRight = rightOnes.count >= 1;
        
        if(oneLeft && oneRight){
            connectPair(leftOnes[0], rightOnes[0]);
        }
    }
    func connectPair(_ left: InsoleClient, _ right: InsoleClient){
        AttitudeView._left = left;
        AttitudeView._right = right;
        InsoleManager.shareInstance.clientManager.stopDiscovery(disp);
        InsoleManager.shareInstance.connect(left, right);
        
        let leftStateDisposable = left.stateSubject.observeOn(MainScheduler.instance).subscribe() { [weak self] event in
            switch event {
            case .next(let state):
                switch state {
                case .gattDiscovered:
                    AttitudeView._leftDisposable = left.startNotifyQuaternionAndMotion().throttle(self!.updateFrequency, scheduler: MainScheduler.instance)
                        .subscribe(){ [weak self] quaternionEvent in
                            switch quaternionEvent {
                            case .next(let quaternion, let motion, let isRecording, let isStaticOnCountDown):
                                print("quaternion \(quaternion) motion \(motion) isRecording \(isRecording) isStaticOnCountDown \(isStaticOnCountDown).");
                                self?.updateLeftQuaternion(quaternion: quaternion);
                                break;
                            default: break
                            }
                    }
                    left.startRecord()
                default:
                    break;
                }
            default:
                break;
                
            }
        }
        let rightStateDisposable = right.stateSubject.observeOn(MainScheduler.instance).subscribe() { [weak self] event in
            switch event {
            case .next(let state):
                switch state {
                case .gattDiscovered:
                    AttitudeView._rightDisposable = right.startNotifyQuaternionAndMotion().throttle(self!.updateFrequency, scheduler: MainScheduler.instance)
                        .subscribe(){ [weak self] quaternionEvent in
                            switch quaternionEvent {
                            case .next(let quaternion, let motion, let isRecording, let isStaticOnCountDown):
                                print("quaternion \(quaternion) motion \(motion) isRecording \(isRecording) isStaticOnCountDown \(isStaticOnCountDown).");
                                self?.updateRightQuaternion(quaternion: quaternion);
                                break;
                            default: break
                            }
                    }
                    right.startRecord()
                    
                default:
                    break;
                }
            default:
                break;
                
            }
        }
    };
    func disconnectInsoles(){
        if let left = AttitudeView._left{
            InsoleManager.shareInstance.clientManager.disconnect(left);
            
        }
        if let right = AttitudeView._right{
            InsoleManager.shareInstance.clientManager.disconnect(right);
        }
        InsoleManager.shareInstance.clientManager
        discovDictionary = [:];
    }
    
}





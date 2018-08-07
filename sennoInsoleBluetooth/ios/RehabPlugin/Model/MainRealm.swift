//
//  MainRealm.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/11/23.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import RealmSwift


class MainRealm {
    
    static let sharedInstance = MainRealm()
    var pairedInsoleResults: Results<PairedInsoleModel>!
    
    var realm: Realm!
    let username = UserDefaults.standard.object(forKey: UserTool.UESR_DEFAULT_KEY_USER_NAME) as? String
    
    init() {
        log.debug( "MainRealm init")
        if let _ = username {
            setDefaultRealmForUser(username: username!)
        }else{
            if let firstLoginName = UserDefaults.standard.object(forKey: UserTool.UESR_DEFAULT_NAME) as? String{
                setDefaultRealmForUser(username: firstLoginName)
            }else{
                UserTool.isNameOrPasswordError(isFromRealm: true)
            }
        }

    }
    
    
    
     func setDefaultRealmForUser(username: String) {
        var config = Realm.Configuration(deleteRealmIfMigrationNeeded: true)

        // 使用默认的目录，但是使用用户名来替换默认的文件名
        let host = URL(string: RestClientOfNew.baseURL)!.host!
        config.fileURL = config.fileURL!.deletingLastPathComponent()
            .appendingPathComponent("\(username)@\(host).realm")
    
        
        Realm.Configuration.defaultConfiguration = config
        // 将这个配置应用到默认的 Realm 数据库当中
        self.realm = try! Realm(configuration: config)
        
    }
    
    
    func delete(){
        
    }
    
}


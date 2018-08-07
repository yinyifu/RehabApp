//
//  FPSCounter.swift
//  SennoInsole
//
//  Created by YangZhiyong on 2016/10/27.
//  Copyright © 2016年 YangZhiyong. All rights reserved.
//

import Foundation
import RxSwift

class FPSCounter {
    
    private var count = 0
    private var time = Date()
    
    private var intervalDisposable: Disposable?
    private var onUpdate: ((Int) -> Void)?
    
    func refresh() {
        count += 1
    }
    
    func start(onUpdate: @escaping (Int) -> Void) {
        self.onUpdate = onUpdate
        count = 0
        intervalDisposable?.dispose()
        intervalDisposable = Observable<Int>.interval(1.0, scheduler: MainScheduler.instance)
            .subscribe() { _ in
//                log.debug("FPS: \(self.count)")
                self.onUpdate?(self.count)
                self.count = 0
        }
    }
    
    func stop() {
        intervalDisposable?.dispose()
    }
    
}




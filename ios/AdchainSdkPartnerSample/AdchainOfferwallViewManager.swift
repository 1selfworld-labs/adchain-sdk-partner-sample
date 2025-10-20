import Foundation
import React
import UIKit

/**
 * AdchainOfferwallView를 React Native에서 사용하기 위한 ViewManager
 */
@objc(AdchainOfferwallViewManager)
class AdchainOfferwallViewManager: RCTViewManager {
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> UIView! {
        let view = AdchainOfferwallView()
        print("AdchainOfferwallViewManager: Created new AdchainOfferwallView instance")
        print("AdchainOfferwallViewManager: ViewManager name: \(Self.moduleName())")
        return view
    }
    
    @objc override static func moduleName() -> String! {
        return "AdchainOfferwallView"
    }
    
    // MARK: - React Props
    
    @objc func setPlacementId(_ view: AdchainOfferwallView, placementId: String?) {
        print("🔥 AdchainOfferwallViewManager: setPlacementId called with: \(placementId ?? "nil")")
        view.placementId = placementId
    }
    
    @objc func setAppKey(_ view: AdchainOfferwallView, appKey: String?) {
        print("🔥 AdchainOfferwallViewManager: setAppKey called with: \(appKey ?? "nil")")
        view.appKey = appKey
    }
    
    @objc func setBaseUrl(_ view: AdchainOfferwallView, baseUrl: String?) {
        print("🔥 AdchainOfferwallViewManager: setBaseUrl called with: \(baseUrl ?? "nil")")
        view.baseUrl = baseUrl
    }
    
    @objc func setUserId(_ view: AdchainOfferwallView, userId: String?) {
        print("🔥 AdchainOfferwallViewManager: setUserId called with: \(userId ?? "nil")")
        view.userId = userId
    }
    
    @objc func setPlatform(_ view: AdchainOfferwallView, platform: String?) {
        print("🔥 AdchainOfferwallViewManager: setPlatform called with: \(platform ?? "nil")")
        view.platform = platform
    }
    
    @objc func setUrl(_ view: AdchainOfferwallView, url: String?) {
        print("🔥 AdchainOfferwallViewManager: setUrl called with: \(url ?? "nil")")
        print("🔥 AdchainOfferwallViewManager: URL type: \(type(of: url))")
        print("🔥 AdchainOfferwallViewManager: URL isEmpty: \(url?.isEmpty ?? true)")
        
        // URL prop을 직접 설정 (didSet에서 자동으로 로딩됨)
        view.url = url
        
        if let url = url, !url.isEmpty {
            print("🔥 AdchainOfferwallViewManager: URL will be loaded automatically via didSet")
        } else {
            print("🔥 AdchainOfferwallViewManager: URL is empty or nil")
        }
    }
    
    // MARK: - Event Handling (제거됨 - React Native 표준 방식 사용)
    
    // 이벤트 처리는 React Native의 표준 View 이벤트 방식으로 처리됩니다.
    // 네이티브 View에서 직접 이벤트를 발생시키지 않고, 
    // React Native의 props 시스템을 통해 이벤트 핸들러를 전달받습니다.
    
    // View 정리는 React Native가 자동으로 처리하므로 별도의 onDropViewInstance는 필요하지 않습니다
}

import UIKit
import WebKit
import React
import AdchainSDK

/**
 * Adchain Offerwall을 React Native View로 임베드하기 위한 커스텀 UIView
 * 기존 AdchainOfferwallViewController의 WebView 로직을 재사용
 */
@objc(AdchainOfferwallView)
class AdchainOfferwallView: UIView {
    
    private var webView: WKWebView!
    private var callback: AdchainOfferwallCallback?
    
    // React Native에서 전달받은 props
    var placementId: String? {
        didSet {
            loadOfferwallWithProps()
        }
    }
    
    var appKey: String? {
        didSet {
            loadOfferwallWithProps()
        }
    }
    
    var baseUrl: String? {
        didSet {
            loadOfferwallWithProps()
        }
    }
    
    var userId: String? {
        didSet {
            loadOfferwallWithProps()
        }
    }
    
    var platform: String? {
        didSet {
            loadOfferwallWithProps()
        }
    }
    
    // React Native에서 전달받은 URL prop
    var url: String? {
        didSet {
            print("🔥 AdchainOfferwallView: URL didSet called")
            print("🔥 AdchainOfferwallView: Old URL: \(oldValue ?? "nil")")
            print("🔥 AdchainOfferwallView: New URL: \(url ?? "nil")")
            print("🔥 AdchainOfferwallView: URL type: \(type(of: url))")
            print("🔥 AdchainOfferwallView: URL isEmpty: \(url?.isEmpty ?? true)")
            
            if let url = url, !url.isEmpty {
                print("🔥 AdchainOfferwallView: URL prop set, loading: \(url)")
                loadOfferwall(url)
            } else {
                print("🔥 AdchainOfferwallView: URL is nil or empty, not loading")
            }
        }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupWebView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupWebView()
    }
    
    private func setupWebView() {
        // WKWebView 설정 (기존 AdchainOfferwallViewController와 동일)
        let configuration = WKWebViewConfiguration()
        
        // JavaScript 설정
        configuration.preferences.javaScriptEnabled = true
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
        
        // 쿠키 설정
        configuration.websiteDataStore = WKWebsiteDataStore.default()
        
        // User Agent 설정
        configuration.applicationNameForUserAgent = "AdchainSDK/1.0"
        
        // WebView 생성 - 초기 크기를 명시적으로 설정
        webView = WKWebView(frame: CGRect(x: 0, y: 0, width: 375, height: 600), configuration: configuration)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        webView.uiDelegate = self
        
        // WebView 배경색 설정 (시각적 확인용)
        webView.backgroundColor = UIColor.systemGray6
        webView.isOpaque = true
        
        // WebView를 뷰에 추가
        addSubview(webView)
        
        print("AdchainOfferwallView: WebView setup completed")
        print("AdchainOfferwallView: WebView frame: \(webView.frame)")
        print("AdchainOfferwallView: Parent view frame: \(bounds)")
        print("AdchainOfferwallView: URL: \(self.url ?? "nil")")
        print("AdchainOfferwallView: PlacementId: \(self.placementId ?? "nil")")
        print("AdchainOfferwallView: AppKey: \(self.appKey ?? "nil")")
        
        // React Native props 전달 문제를 우회하기 위한 강제 URL 로딩
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            print("AdchainOfferwallView: Checking props after 2 seconds...")
            print("AdchainOfferwallView: URL: \(self.url ?? "nil")")
            print("AdchainOfferwallView: PlacementId: \(self.placementId ?? "nil")")
            print("AdchainOfferwallView: AppKey: \(self.appKey ?? "nil")")
            
            if let url = self.url, !url.isEmpty {
                print("AdchainOfferwallView: Found URL prop after delay: \(url)")
                self.loadOfferwall(url)
            } else {
                print("AdchainOfferwallView: No URL prop found, loading fallback URL")
                // React Native에서 전달받은 URL을 직접 사용
                let fallbackUrl = "https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=iOS&app_key=123456781&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.33"
                print("AdchainOfferwallView: Loading fallback URL: \(fallbackUrl)")
                self.loadOfferwall(fallbackUrl)
            }
        }
    }
    
    /**
     * Props를 사용하여 Offerwall URL을 생성하고 로드합니다
     */
    private func loadOfferwallWithProps() {
        // 모든 필요한 props가 설정되었는지 확인
        guard let placementId = placementId,
              let appKey = appKey,
              let baseUrl = baseUrl else {
            print("AdchainOfferwallView: Required props not set yet")
            return
        }
        
        let userId = self.userId ?? AdchainSdk.shared.getCurrentUser()?.userId ?? "guest"
        let platform = self.platform ?? "ios"
        
        let offerwallUrl = generateOfferwallUrl(
            baseUrl: baseUrl,
            userId: userId,
            appKey: appKey,
            platform: platform,
            placementId: placementId
        )
        
        loadOfferwall(offerwallUrl)
    }
    
    /**
     * Offerwall URL을 생성합니다
     */
    private func generateOfferwallUrl(baseUrl: String, userId: String, appKey: String, platform: String, placementId: String) -> String {
        let urlComponents = [
            "user_id=\(userId)",
            "app_key=\(appKey)",
            "platform=\(platform)",
            "placement_id=\(placementId)"
        ]
        
        let queryString = urlComponents.joined(separator: "&")
        return "\(baseUrl)?\(queryString)"
    }
    
    /**
     * Offerwall URL을 로드합니다
     */
    @objc func loadOfferwall(_ url: String) {
        print("AdchainOfferwallView: Loading offerwall URL: \(url)")
        
        guard let url = URL(string: url) else {
            print("AdchainOfferwallView: Invalid URL: \(url)")
            return
        }
        
        print("AdchainOfferwallView: Creating URLRequest for: \(url)")
        let request = URLRequest(url: url)
        print("AdchainOfferwallView: Starting WebView load...")
        
        // WebView 상태 확인
        print("AdchainOfferwallView: WebView frame: \(webView.frame)")
        print("AdchainOfferwallView: WebView isHidden: \(webView.isHidden)")
        print("AdchainOfferwallView: WebView alpha: \(webView.alpha)")
        print("AdchainOfferwallView: WebView isOpaque: \(webView.isOpaque)")
        
        webView.load(request)
        
        // 로딩 시작 확인
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            print("AdchainOfferwallView: WebView isLoading after 0.1s: \(self.webView.isLoading)")
        }
        
        // 2초 후에도 로딩 중이면 강제로 확인
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            print("AdchainOfferwallView: WebView isLoading after 2.0s: \(self.webView.isLoading)")
            print("AdchainOfferwallView: WebView URL after 2.0s: \(self.webView.url?.absoluteString ?? "nil")")
        }
    }
    
    /**
     * Callback을 설정합니다
     */
    @objc func setCallback(_ callback: AdchainOfferwallCallback?) {
        self.callback = callback
    }
    
    /**
     * WebView를 정리합니다
     */
    @objc func cleanup() {
        webView.stopLoading()
        webView.navigationDelegate = nil
        webView.uiDelegate = nil
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        print("AdchainOfferwallView: layoutSubviews called - bounds: \(bounds)")
        
        // WebView 크기를 부모 View에 맞게 설정
        webView.frame = bounds
        print("AdchainOfferwallView: WebView frame updated to: \(webView.frame)")
    }
}

// MARK: - WKNavigationDelegate
extension AdchainOfferwallView: WKNavigationDelegate {
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("AdchainOfferwallView: Page finished loading")
        callback?.onOpened()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("AdchainOfferwallView: Navigation failed with error: \(error.localizedDescription)")
        callback?.onError(error.localizedDescription)
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("AdchainOfferwallView: Provisional navigation failed with error: \(error.localizedDescription)")
        callback?.onError(error.localizedDescription)
    }
}

// MARK: - WKUIDelegate
extension AdchainOfferwallView: WKUIDelegate {
    
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        // 새 창 요청 시 현재 WebView에서 처리
        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
}

// MARK: - AdchainOfferwallCallback Protocol
@objc protocol AdchainOfferwallCallback {
    func onOpened()
    func onClosed()
    func onError(_ message: String)
    func onRewardEarned(_ amount: Int)
}

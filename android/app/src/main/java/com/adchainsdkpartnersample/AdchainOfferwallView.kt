package com.adchainsdkpartnersample

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebChromeClient
import android.webkit.CookieManager
import android.webkit.WebSettings
import android.widget.FrameLayout
import android.util.Log
import com.adchain.sdk.core.AdchainSdk
import com.adchain.sdk.offerwall.AdchainOfferwallCallback
import com.adchain.sdk.offerwall.AdchainOfferwallError

/**
 * Adchain Offerwall을 React Native View로 임베드하기 위한 커스텀 View
 * 기존 AdchainOfferwallActivity의 WebView 로직을 재사용
 */
class AdchainOfferwallView(context: Context) : FrameLayout(context) {
    
    private val webView: WebView
    private var callback: AdchainOfferwallCallback? = null
    
    // React Native에서 전달받은 props
    var placementId: String? = null
        set(value) {
            field = value
            loadOfferwallWithProps()
        }
    
    var appKey: String? = null
        set(value) {
            field = value
            loadOfferwallWithProps()
        }
    
    var baseUrl: String? = null
        set(value) {
            field = value
            loadOfferwallWithProps()
        }
    
    var userId: String? = null
        set(value) {
            field = value
            loadOfferwallWithProps()
        }
    
    var platform: String? = null
        set(value) {
            field = value
            loadOfferwallWithProps()
        }
    
    init {
        // WebView 생성 및 설정
        webView = WebView(context).apply {
            // WebView 설정 (기존 AdchainOfferwallActivity와 동일)
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                setAppCacheEnabled(true)
                cacheMode = WebSettings.LOAD_DEFAULT
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                allowFileAccess = true
                allowContentAccess = true
                allowFileAccessFromFileURLs = true
                allowUniversalAccessFromFileURLs = true
                userAgentString = "${userAgentString} AdchainSDK/1.0"
            }
            
            // Cookie 설정
            CookieManager.getInstance().apply {
                setAcceptCookie(true)
                setAcceptThirdPartyCookies(this@AdchainOfferwallView, true)
            }
            
            // WebViewClient 설정
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    Log.d("AdchainOfferwallView", "Page finished loading: $url")
                    callback?.onOpened()
                }
                
                override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                    super.onReceivedError(view, errorCode, description, failingUrl)
                    Log.e("AdchainOfferwallView", "WebView error: $description")
                    callback?.onError(description ?: "Unknown error")
                }
            }
            
            // WebChromeClient 설정
            webChromeClient = object : WebChromeClient() {
                override fun onProgressChanged(view: WebView?, newProgress: Int) {
                    super.onProgressChanged(view, newProgress)
                    Log.d("AdchainOfferwallView", "Loading progress: $newProgress%")
                }
            }
        }
        
        // WebView를 FrameLayout에 추가
        addView(webView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    }
    
    /**
     * Props를 사용하여 Offerwall URL을 생성하고 로드합니다
     */
    private fun loadOfferwallWithProps() {
        // 모든 필요한 props가 설정되었는지 확인
        if (placementId.isNullOrEmpty() || appKey.isNullOrEmpty() || baseUrl.isNullOrEmpty()) {
            Log.d("AdchainOfferwallView", "Required props not set yet")
            return
        }
        
        val userId = this.userId ?: AdchainSdk.getCurrentUser()?.userId ?: "guest"
        val platform = this.platform ?: "android"
        
        val offerwallUrl = generateOfferwallUrl(
            baseUrl = baseUrl!!,
            userId = userId,
            appKey = appKey!!,
            platform = platform,
            placementId = placementId!!
        )
        
        loadOfferwall(offerwallUrl)
    }
    
    /**
     * Offerwall URL을 생성합니다
     */
    private fun generateOfferwallUrl(baseUrl: String, userId: String, appKey: String, platform: String, placementId: String): String {
        return "$baseUrl?user_id=$userId&app_key=$appKey&platform=$platform&placement_id=$placementId"
    }
    
    /**
     * Offerwall URL을 로드합니다
     */
    fun loadOfferwall(url: String) {
        Log.d("AdchainOfferwallView", "Loading offerwall URL: $url")
        webView.loadUrl(url)
    }
    
    /**
     * Callback을 설정합니다
     */
    fun setCallback(callback: AdchainOfferwallCallback?) {
        this.callback = callback
    }
    
    /**
     * WebView를 정리합니다
     */
    fun cleanup() {
        webView.destroy()
    }
    
    /**
     * WebView를 일시정지합니다
     */
    fun pause() {
        webView.onPause()
    }
    
    /**
     * WebView를 재개합니다
     */
    fun resume() {
        webView.onResume()
    }
}

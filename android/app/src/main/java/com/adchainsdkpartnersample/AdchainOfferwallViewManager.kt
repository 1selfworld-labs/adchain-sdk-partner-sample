package com.adchainsdkpartnersample

import com.facebook.react.bridge.*
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import android.util.Log

/**
 * AdchainOfferwallView를 React Native에서 사용하기 위한 ViewManager
 */
class AdchainOfferwallViewManager : SimpleViewManager<AdchainOfferwallView>() {
    
    companion object {
        const val NAME = "AdchainOfferwallView"
    }
    
    override fun getName(): String = NAME
    
    override fun createViewInstance(reactContext: ThemedReactContext): AdchainOfferwallView {
        Log.d("AdchainOfferwallViewManager", "Creating AdchainOfferwallView instance")
        return AdchainOfferwallView(reactContext)
    }
    
    @ReactProp(name = "placementId")
    fun setPlacementId(view: AdchainOfferwallView, placementId: String?) {
        Log.d("AdchainOfferwallViewManager", "Setting placementId: $placementId")
        view.placementId = placementId
    }
    
    @ReactProp(name = "appKey")
    fun setAppKey(view: AdchainOfferwallView, appKey: String?) {
        Log.d("AdchainOfferwallViewManager", "Setting appKey: $appKey")
        view.appKey = appKey
    }
    
    @ReactProp(name = "baseUrl")
    fun setBaseUrl(view: AdchainOfferwallView, baseUrl: String?) {
        Log.d("AdchainOfferwallViewManager", "Setting baseUrl: $baseUrl")
        view.baseUrl = baseUrl
    }
    
    @ReactProp(name = "userId")
    fun setUserId(view: AdchainOfferwallView, userId: String?) {
        Log.d("AdchainOfferwallViewManager", "Setting userId: $userId")
        view.userId = userId
    }
    
    @ReactProp(name = "platform")
    fun setPlatform(view: AdchainOfferwallView, platform: String?) {
        Log.d("AdchainOfferwallViewManager", "Setting platform: $platform")
        view.platform = platform
    }
    
    @ReactProp(name = "url")
    fun setUrl(view: AdchainOfferwallView, url: String?) {
        Log.d("AdchainOfferwallViewManager", "Setting URL: $url")
        
        if (!url.isNullOrEmpty()) {
            view.loadOfferwall(url)
        }
    }
    
    override fun onDropViewInstance(view: AdchainOfferwallView) {
        Log.d("AdchainOfferwallViewManager", "Dropping AdchainOfferwallView instance")
        view.cleanup()
        super.onDropViewInstance(view)
    }
}

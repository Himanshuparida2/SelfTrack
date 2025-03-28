import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const adUnitId = 'ca-app-pub-5326098300895323/6175122570';

function BannerAds() {
  return (
    <SafeAreaView style={{position:'absolute',bottom:'3.5%'}}>
      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        networkExtras: {
          collapsible: 'bottom',
        },
      }}
    />
    </SafeAreaView>
  )
}

export default BannerAds

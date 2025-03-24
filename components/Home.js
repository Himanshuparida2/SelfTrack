import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native'
import TopBar from './TopBar.js'
import Body from './Body.js'

function Home() {
  return (
    <SafeAreaView style={{flex:1}}>
      <TopBar/>
      <Body/>
    </SafeAreaView>
  )
}

export default Home

import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, SafeAreaView } from 'react-native'
import TopBar from './TopBar.js'
import Body from './Body.js'
import AddSubject from './AddSubject.js'
import { AddingContext} from '../context/addingContext'
import SideBar from './SideBar.js'

const {width,height}=Dimensions.get('window')
function Home() {
  const { AddPressed,opensidebar }=useContext(AddingContext)
  return (
    <SafeAreaView style={{flex:1,marginTop:'1%',width:width,height:height}}>
      <TopBar/>
      <Body/>
      {opensidebar?<SideBar/>:null}
      {AddPressed?<AddSubject/>:null}
    </SafeAreaView>
  )
}

export default Home

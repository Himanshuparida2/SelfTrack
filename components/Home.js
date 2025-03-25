import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native'
import TopBar from './TopBar.js'
import Body from './Body.js'
import AddSubject from './AddSubject.js'
import { AddingContext} from '../context/addingContext'


function Home() {
  const { AddPressed }=useContext(AddingContext)
  return (
    <SafeAreaView style={{flex:1}}>
      <TopBar/>
      {AddPressed?<AddSubject/>:null}
      <Body/>
    </SafeAreaView>
  )
}

export default Home

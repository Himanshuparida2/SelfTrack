import React, { useContext, useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import LoadView from './components/LoadView'
import { AddingContext, AddingContextProvider } from './context/addingContext'
import Orientation from 'react-native-orientation-locker'

function App() {
  useEffect(()=>{
    Orientation.lockToPortrait()
    return()=>{
      Orientation.unlockAllOrientations()
    }
  },[])
  console.log("App is Rendering")
  return (
    <SafeAreaView style={style.container}>
      <AddingContextProvider>
        <LoadView/>
      </AddingContextProvider>
    </SafeAreaView>
  )
}

export default App

const style = StyleSheet.create({
  container:{
    flex:1
  }
})
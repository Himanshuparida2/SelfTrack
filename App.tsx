import React, { useContext } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import LoadView from './components/LoadView'
import { AddingContext, AddingContextProvider } from './context/addingContext'
import AddSubject from './components/AddSubject'

function App() {
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
import React from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import TheCalender from './components/TheCalender'

function App() {
  console.log("App is Rendering")
  return (
    <SafeAreaView style={style.container}>
      <TheCalender/>
    </SafeAreaView>
  )
}

export default App

const style = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"white",
    justifyContent:"center",
    alignItems:"center"
  },
  text:{
    color:"black",
    fontSize:50,
    fontWeight:"bold"
  }
})
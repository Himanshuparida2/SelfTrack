import React from 'react'
import { Text, View } from 'react-native'

function App() {
  console.log("App is Rendering")
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <Text style={{color:"black",fontSize:50,fontWeight:"bold"}}>SelfTrack</Text>
    </View>
  )
}

export default App

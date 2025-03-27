import React from 'react'
import { StyleSheet, View } from 'react-native'

function SideBar() {
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>

      </View>
    </View>
  )
}
export default SideBar

const styles=StyleSheet.create({
    container:{
        width:'50%',
        height:'100%',
    },
    sidebar:{
        borderWidth:1,
        width:"80%",
        height:'100%',
        position:'absolute',
        zIndex:2,
        backgroundColor:'white'
      }
})

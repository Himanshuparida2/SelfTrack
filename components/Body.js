import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AddingContext } from '../context/addingContext'

function Body() {
    const {AddPressed,background}=useContext(AddingContext)
    useEffect(()=>{
        console.log('background Changed',background)
    },[background,AddPressed])
    
  return (
    <View style={[styles.container,{backgroundColor:background.background_color,opacity:background.opacity}]}>
           
    </View>
  )
}

export default Body

const styles=new StyleSheet.create({
    container:{
        width:'100%',
        height:'90%'
    },
})

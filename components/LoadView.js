import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import Home from './Home.js';
import Logo from '../Images/SELFTRACK_LOGO.png'
import Logo_Text from '../Images/SELFTRACK.png'

function LoadView() {
  const [isLoading, setLoading] = useState(true);
  const moveLeft=new Animated.Value(0)
  const moveBackground=new Animated.Value(0)
  const moveRight=new Animated.Value(0)
    useEffect(() => {
      const timer=setTimeout(() => {
        console.log("The app Is Loading") 
        setLoading(false);
      }
      , 1500);

      Animated.timing(moveLeft,{
        toValue:-140,
        duration:1000,
        useNativeDriver:true,
      }).start();
      Animated.timing(moveBackground,{
        toValue:-300,
        duration:1000,
        useNativeDriver:true
      }).start()
      Animated.timing(moveRight,{
        toValue:35,
        duration:1000,
        useNativeDriver:true
      }).start()

      return ()=>clearTimeout(timer)
    },[]);
  return (
    (isLoading)?(<View style={style.container}>
      <View style={style.Start_loading}>
        <Animated.Image source={Logo} style={[style.logo,{transform:[{translateX:moveLeft}]}]}></Animated.Image>
        <Animated.View style={[style.back_screen,{transform:[{translateX:moveBackground}]}]}></Animated.View>
        <Animated.Image source={Logo_Text} style={[style.text,{transform:[{translateX:moveRight}]}]}></Animated.Image>
      </View>
    </View>):(
      <Home/>
    )
  )
}

export default LoadView
const style=StyleSheet.create({
  container:{
    flex:1
  },
  Start_loading: {
    width:'100%',
    height:'100%',
    backgroundColor: 'black',
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
  },
  back_screen:{
    position:'absolute',
    zIndex:2,
    backgroundColor:'black',
    height:80,
    width:'80%'
  },
  text:{
    position:'absolute',
    justifyContent:'center',
    alignSelf:'center',
    width:270,
    height:60,
    zIndex:1,
  },
  logo:{
    position:'absolute',
    left:'40%',
    width:80,
    height:80,
    resizeMode:'contain',
    zIndex:4,
  },
})

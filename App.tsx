import React, { useEffect, useRef } from 'react'
import { BackHandler, Dimensions, SafeAreaView, StyleSheet, ToastAndroid } from 'react-native'
import LoadView from './components/LoadView'
import { AddingContextProvider } from './context/addingContext'
import Orientation from 'react-native-orientation-locker'
import { NavigationContainer} from '@react-navigation/native'

const {width, height}=Dimensions.get('window')

function App() {
  const lastBackPress = useRef(0);
  
  useEffect(() => {
    const onBackPress = () => {
      const now = Date.now();
      if (lastBackPress.current && now - lastBackPress.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      lastBackPress.current = now;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, []);
  useEffect(()=>{
    Orientation.lockToPortrait()
    return()=>{
      Orientation.unlockAllOrientations()
    }
  },[])
  console.log("App is Rendering")
  return (
    <SafeAreaView style={style.container}>
      <NavigationContainer>
        <AddingContextProvider>
          <LoadView/>
        </AddingContextProvider>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App

const style = StyleSheet.create({
  container:{
    flex:1,
    width:width,
    height:height
  }
})
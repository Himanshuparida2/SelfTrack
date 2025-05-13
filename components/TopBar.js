import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import selftrack from '../Images/SELFTRACK_FULL_LOGO.png';
import hamburger from '../Images/hamburger.png'
import add_icon from '../Images/add-icon.png'
import { AddingContext } from '../context/addingContext';


function TopBar() {

  const {AddPressed,setSubject,setBackground,setAddPressed,setOpenSideBar}=useContext(AddingContext)
  useEffect(() => {
    if (AddPressed) {
      setBackground({background_color: 'black', opacity: 0.2});
    } else {
      setBackground({background_color: 'white', opacity: 1});
    }
  }, [AddPressed]);
  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Image source={selftrack} style={styles.logo} />
        <View style={styles.sidebar}></View>
        <TouchableOpacity style={styles.hamburger_container} onPress={()=>setOpenSideBar(true)}>
          <Image source={hamburger} style={styles.hamburger}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addIcon} onPress={()=>{setAddPressed(true),setSubject('')}}>
          <Image source={add_icon} style={styles.addIcon}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TopBar;

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'12%',
  },
  topbar: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderTopWidth:0,
    borderColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 5,
  },
  logo: {
    width: 185,
    height: 80,
    resizeMode: 'contain',
    position: 'absolute',
    zIndex: 0,
    top: '20%',
    left: '12%',
  },
  maintext: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '20%',
    textAlign: 'center',
  },
  hamburger_container:{
    position:'absolute',
    marginTop:'10%',
    left:'2%',
    zIndex: 2,
    padding:10
  },
  hamburger:{
    width:24,
    height:22,
  },
  addIcon: {
    position: 'absolute',
    zIndex: 0,
    width: 25,
    height: 25,
    top: '36%',
    right: '7%',
  }
});

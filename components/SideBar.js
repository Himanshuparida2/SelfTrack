import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AddingContext } from '../context/addingContext';

function SideBar() {
  const moveleft = useRef(new Animated.Value(-300)).current;
  const { opensidebar, setOpenSideBar } = useContext(AddingContext);

  useEffect(() => {
    Animated.timing(moveleft, {
      toValue: opensidebar ? 0 : -300,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opensidebar]);

  const HandleEmail = () => {
    const email = 'himanshuparida27@gmail.com';
    const subject = 'Report Issue';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(url).catch(err => console.error("Error Occurred: ", err));
  };

  return (
    opensidebar && (
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpenSideBar(false)}>
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: moveleft }] }]}>
          <TouchableOpacity style={styles.helpbutton} onPress={HandleEmail}>
            <Text style={styles.buttonText}>Get Help?</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    )
  );
}

export default SideBar;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sidebar: {
    borderWidth: 1,
    width: '45%',
    height: '100%',
    position: 'absolute',
    left: 0,
    backgroundColor: 'white',
    zIndex: 10,
    padding: 20,
    justifyContent:'center'
  },
  helpbutton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 55,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

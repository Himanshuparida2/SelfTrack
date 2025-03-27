import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AddingContext } from '../context/addingContext';

function TheCalendar() {
  const [showDetails,setShowDetails]=useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [presentDates,setPresentDates]=useState([])
  const [absentDates,setAbsentDates]=useState([])
  const {subject,setSubject}=useContext(AddingContext);
  
  useEffect(()=>{
    async function getData(){
      const getpresentdata = await AsyncStorage.getItem(`${subject}presentDates`)
      const presentdata=getpresentdata?JSON.parse(getpresentdata):[]
      setPresentDates(presentdata)
      const getabsentdata=await AsyncStorage.getItem(`${subject}absentDates`)
      const absentdata=getabsentdata?JSON.parse(getabsentdata):[]
      setAbsentDates(absentdata)
    }
    getData()
  },[subject,presentDates,absentDates])

  const handleClick=(day)=>{
    let date=new Date();
    date.setDate(date.getDate()+1)
    let newdate=date.toISOString().slice(0,10);
    console.log(selectedDate)
    if(day.dateString > newdate){
      Alert.alert("Invalid Date", "You can't select a future date")
      return;
    }
    else{
      setSelectedDate(`${day.dateString}`);
    }
  }
  async function Updated(p,a,t){
    try{
    const getdata=await AsyncStorage.getItem('UserSubject')
    let data=getdata?JSON.parse(getdata):[]
    let subinfo
    if(getdata){
       subinfo=data.find(sub=>sub.name===subject)
       let present,absent,total;
       console.log(subinfo)
       if(subinfo){
        present=subinfo.present+Number(p)
        absent=subinfo.absent+Number(a)
        total=subinfo.totalclass+Number(t)
        subinfo.present=present
        subinfo.absent=absent
        subinfo.totalclass=total
        const percent=(subinfo.present/subinfo.totalclass)*100
        subinfo.percent=percent
        await AsyncStorage.setItem('UserSubject',JSON.stringify(data));
      }
  }
}catch(err){
  console.error(err)
}
}
  const onclick=()=>{
      setShowDetails(true)
  }
  const addPresent=async(day)=>{
    if(!presentDates.includes(day)){
      if(absentDates.includes(day)){
        const updated=absentDates.filter(update=>update!==day)
        setAbsentDates(updated)
        await AsyncStorage.setItem(`${subject}absentDates`,JSON.stringify(updated))
        Updated(0,-1,-1)
      }
      const updated_present=[...presentDates,day];
      setPresentDates(updated_present)
      await AsyncStorage.setItem(`${subject}presentDates`,JSON.stringify(updated_present));
      Updated(1,0,1)
    }
    setShowDetails(false)
  }
  const addAbsent=async(day)=>{
    if(!absentDates.includes(day)){
      if(presentDates.includes(day)){
        const updated=presentDates.filter(update=>update!==day)
        setPresentDates(updated)
        await AsyncStorage.setItem(`${subject}presentDates`,JSON.stringify(updated));
        Updated(-1,0,-1)
      }
      const updated_absent=[...absentDates,day]
      setAbsentDates(updated_absent);
      await AsyncStorage.setItem(`${subject}absentDates`,JSON.stringify(updated_absent));
      Updated(0,1,1)
    }
    setShowDetails(false)
  }
  const clear=async(day)=>{
    if(absentDates.includes(day)){
      const updated=absentDates.filter(update=>update!==day)
      setAbsentDates(updated)
      await AsyncStorage.setItem(`${subject}absentDates`,JSON.stringify(updated))
      Updated(0,-1,-1)
    }
    if(presentDates.includes(day)){
      const updated=presentDates.filter(update=>update!==day)
      setPresentDates(updated)
      await AsyncStorage.setItem(`${subject}presentDates`,JSON.stringify(updated));
      Updated(-1,0,-1)
    }
    setShowDetails(false)
  }

  return (
      <TouchableWithoutFeedback onPress={()=>setShowDetails(false)}>
    <View style={styles.container}>
      <Calendar
        style={{position:'relative', width: 400 }}
        markedDates={{
          ...presentDates.reduce((acc,date)=>{
            acc[date]={ selected: true, selectedColor:  'green' };
            return acc
          },{}),
          ...absentDates.reduce((acc,date)=>{
            acc[date]={ selected: true, selectedColor: 'red' }
            return acc
          },{}),
          [selectedDate]: { selected: true, selectedColor: 'blue' },
        }}
        onDayPress={(day) => {
          onclick()
          handleClick(day);
        }}
        monthFormat='MMMM yyyy'
        />
        {showDetails && (
          <View style={styles.moredetails}>
            <TouchableOpacity onPress={()=>addPresent(selectedDate)}>
            <Text style={styles.details}>Present</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>addAbsent(selectedDate)}>
            <Text style={styles.details}>Absent</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>clear(selectedDate)}>
            <Text style={styles.details}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
        </TouchableWithoutFeedback>
  );
}
export default TheCalendar;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position:'absolute',
    width:'100%',
    height:'100%',
    zIndex:9,
  },
  moredetails:{
    position:'absolute',
    width:'30%',
    height:'8%',
    backgroundColor:'white',
    justifyContent:'center',
  },
  details:{
    fontSize:20,
    zIndex:11,
    borderWidth:1,
    height:'100%',
    textAlign:'center',
    paddingTop:8.5,
    borderWidth:1,
    backgroundColor:'white'
  },
});
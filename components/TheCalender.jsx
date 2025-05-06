import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AddingContext } from '../context/addingContext';
import SQLite from 'react-native-sqlite-storage';
import {useFocusEffect} from '@react-navigation/native';
import { BackHandler } from 'react-native';

function TheCalendar() {
  const [showDetails,setShowDetails]=useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [presentDates,setPresentDates]=useState([])
  const [absentDates,setAbsentDates]=useState([])
  const {subject,setSubject}=useContext(AddingContext);
  const db=SQLite.openDatabase({name:'selftrack.db',location:'default'})
  const handleBackButton = () => {
    setShowDetails(false);
    return true;
  };
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton
      );
      return () => backHandler.remove();
    }, [showDetails])
  );
  useEffect(() => {
    async function getData() {
      db.transaction(tx => {
        // Create tables
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${subject}presentDates 
           (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE)`,
          [],
          (_,results) => console.log('Present table created',results.rows.length),
          error => console.log('Error creating present table', error)
        );
        
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${subject}absentDates 
           (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE)`,
          [],
          () => console.log('Absent table created'),
          error => console.log('Error creating absent table', error)
        );
  
        // Fetch present dates
        tx.executeSql(
          `SELECT date FROM ${subject}presentDates`,
          [],
          (_, results) => {
            const dates = [];
            for (let i = 0; i < results.rows.length; i++) {
              dates.push(results.rows.item(i).date);
            }
            setPresentDates(dates);
          },
          error => console.log('Error fetching present dates', error)
        );
  
        // Fetch absent dates
        tx.executeSql(
          `SELECT date FROM ${subject}absentDates`,
          [],
          (_, results) => {
            const dates = [];
            for (let i = 0; i < results.rows.length; i++) {
              dates.push(results.rows.item(i).date);
            }
            setAbsentDates(dates);
          },
          error => console.log('Error fetching absent dates', error)
        );
      });
    };
    getData();
  }, [subject]);
  useEffect(() => {}, [absentDates, presentDates]);
  

  const handleClick=(day)=>{
    let date=new Date();
    date.setDate(date.getDate()+1)
    let newdate=date.toISOString().slice(0,10);
    if(day.dateString > newdate){
      setShowDetails(false)
      Alert.alert("Invalid Date", "You can't select a future date")
      return;
    }
    else{
      setSelectedDate(`${day.dateString}`);
    }
  }
  async function Updated(p,a,t){ //Updated(present,absent,total)
    try{
      db.transaction(tx=>{
        tx.executeSql(
          `UPDATE UserSubject SET present=present+?, absent=absent+?, totalclass=totalclass+? WHERE name=?`,
          [p,a,t,subject],
          (_,results)=>{
            console.log('Data updated:',results)
          },
          error=>{
            console.error('Error updating data:',error)
          }
        )
      })
  }catch(err){
  console.error(err)
  }
}
  const onclick=()=>{
      setShowDetails(true)
  }
  const addPresent = async (day) => {
    if (!presentDates.includes(day)) {
      if (absentDates.includes(day)) {
        const updated = absentDates.filter(update => update !== day);
        setAbsentDates(updated);
        db.transaction(tx => {
          tx.executeSql(
            `DELETE FROM ${subject}absentDates WHERE date=?`,
            [day],
            (_, results) => console.log('Absent Data deleted:', results.rows),
            error => console.error('Error deleting data:', error)
          );
        });
        Updated(0, -1, -1);
      }
  
      const updated_present = [...presentDates, day];
      setPresentDates(updated_present);
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${subject}presentDates (date) VALUES (?)`,
          [day],
          (_, results) => console.log('Present Data inserted'),
          error => console.error('Error inserting data:', error)
        );
      });
      Updated(1, 0, 1);
    }
    setShowDetails(false);
  };
  
  const addAbsent = async (day) => {
    if (!absentDates.includes(day)) {
      if (presentDates.includes(day)) {
        const updated = presentDates.filter(update => update !== day);
        setPresentDates(updated);
        db.transaction(tx => {
          tx.executeSql(
            `DELETE FROM ${subject}presentDates WHERE date=?`,
            [day],
            (_, results) => console.log('Present Data deleted:', results),
            error => console.error('Error deleting data:', error)
          );
        });
        Updated(-1, 0, -1);
      }
  
      const updated_absent = [...absentDates, day];
      setAbsentDates(updated_absent);
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${subject}absentDates (date) VALUES (?)`,
          [day],
          (_, results) => console.log('Absent Data inserted:', results),
          error => console.error('Error inserting data:', error)
        );
      });
      Updated(0, 1, 1);
    }
    setShowDetails(false);
  };
  
  const clear = async (day) => {
    if (absentDates.includes(day)) {
      const updated = absentDates.filter(update => update !== day);
      setAbsentDates(updated);
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${subject}absentDates WHERE date=?`,
          [day],
          (_, results) => console.log('Absent Data deleted:', results),
          error => console.error('Error deleting data:', error)
        );
      });
      Updated(0, -1, -1);
    }
  
    if (presentDates.includes(day)) {
      const updated = presentDates.filter(update => update !== day);
      setPresentDates(updated);
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${subject}presentDates WHERE date=?`,
          [day],
          (_, results) => console.log('Present Data deleted:', results),
          error => console.error('Error deleting data:', error)
        );
      });
      Updated(-1, 0, -1);
    }
  
    setShowDetails(false);
  };
  

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
          <View style={[styles.moredetails]}>
            <TouchableOpacity onPress={()=>addPresent(selectedDate)}>
            <Text style={[styles.details,{backgroundColor:'green',color:'white',fontSize:20,fontWeight:'bold'}]}>Present</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>addAbsent(selectedDate)}>
            <Text style={[styles.details,{backgroundColor:'red',color:'white',fontSize:20,fontWeight:'bold'}]}>Absent</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>clear(selectedDate)}>
            <Text style={[styles.details,{backgroundColor:'yellow',color:'black',fontSize:20,fontWeight:'bold'}]}>Clear</Text>
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
    right:'25%',
    top:"52%",
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
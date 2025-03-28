import React, { useContext, useEffect, useState } from 'react';
import {Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { AddingContext } from '../context/addingContext';
import cross from '../Images/close_icon.png'
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddSubject() {
  const [subjecttext, setSubjectText] = useState('');
  const [subjectclass, setSubjectClass] = useState('');
  const [subjectpresent, setSubjectPresent] = useState('');
  const [subjectabsent, setSubjectAbsent] = useState('');
  const [subjectcriteria, setSubjectCriteria] = useState('75');
  const {AddPressed, setAddPressed, subject,setSubject,edit,setEdit} = useContext(AddingContext);

  useEffect(()=>{
    const setupData=async()=>{
      if(subject){
        try{
          const getdata=await AsyncStorage.getItem(`UserSubject`)
          if(getdata){
            const data=JSON.parse(getdata).find(i=>i.name===subject)
            if(data){
              console.log('Data is : ',data)
              setSubjectText(data.name)
              setSubjectAbsent(`${data.absent}`)
              setSubjectClass(`${data.totalclass}`)
              setSubjectPresent(`${data.present}`)
              setSubjectCriteria(`${data.criteria}`)
            }
          }
        }catch(err){
          console.error(err)
        }
      }
    }
    setupData()
  },[subject])
  const HandleSubject = text => {
    setSubjectText(text);
  };
  const HandleTotalClasses = total => {
    setSubjectClass(total);
  };
  const HandleTotalPresent = present => {
    setSubjectPresent(present);
  };
  const HandleTotalAbsent = absent => {
    setSubjectAbsent(absent);
  };
  const HandleCriteria = criteria => {
    setSubjectCriteria(criteria);
  };
  const HandleClose=()=>{
    setSubject('')
    setEdit(false)
    setAddPressed(false)
  }
  let name=subjecttext
  let present=parseInt(subjectpresent,10)
  let absent=parseInt(subjectabsent,10)
  let totalclass=parseInt(subjectclass,10)
  let criteria=parseInt(subjectcriteria,10)
  let percentage=totalclass>0?(present/totalclass)*100:0

  const addSubject = async()=>{
        if(isNaN(present)||isNaN(absent)||isNaN(totalclass)||isNaN(criteria)){
        Alert.alert('Please Enter Valid Numbers for Classes and Criteria')
        return
        }
        if(totalclass<present || totalclass<absent){
          Alert.alert("Total Classes Can't Be Less Than Present or Absent classes")
          return
        }

        try{
          if(edit){
            const getdata=await AsyncStorage.getItem('UserSubject')
              if(getdata){
                const data=JSON.parse(getdata)
                const index=data.findIndex(i=>i.name===subject)
                if(index!==-1){
                  data[index]={
                    ...data[index],
                    name:subjecttext,
                    totalclass:subjectclass,
                    present:subjectpresent,
                    absent:subjectabsent,
                    criteria:subjectcriteria,
                    percent:percentage,

                  }
                  await AsyncStorage.setItem('UserSubject',JSON.stringify(data))
                  HandleClose()
                  setSubject('')
                  Alert.alert('Data Edited Successfully!!')
                }
              }
            }
            else{
          const subject={
            name:name,
            present:present,
            absent:absent,
            totalclass:totalclass,
            criteria:criteria,
            percent:percentage,
          }
          const getData=await AsyncStorage.getItem('UserSubject')
          const Data=getData?JSON.parse(getData):[]
          Data.push(subject)
          await AsyncStorage.setItem('UserSubject',JSON.stringify(Data));
          
          setSubjectText('')
          setSubjectAbsent('')
          setSubjectClass('')
          setSubjectCriteria('')
          setSubjectPresent('')
          console.log(Data)
          setSubject('')
          HandleClose()
        }
        }catch(e){
          console.error(e)
          Alert.alert("Some Error Occured!!")
        }
    }

  return (
    <SafeAreaView style={styles.container}>
      {AddPressed && (
        <View style={styles.addItem}>
          <Text style={styles.Header}>{edit?'Edit':'Add'} {subject?subject:'Subject'}</Text>
          <TouchableOpacity  onPress={()=>{HandleClose(),setAddPressed(false)}}>
            <Image source={cross} style={styles.cross}/>
          </TouchableOpacity>
          <Text style={styles.subjectlabel}>Subject Name</Text>
          <TextInput
            style={styles.Subject}
            value={subjecttext}
            onChangeText={HandleSubject}
            placeholder="Enter Subject Name..."
          />
          <Text style={styles.totallable}>Total Classes</Text>
          <TextInput
            style={styles.total}
            value={subjectclass}
            onChangeText={HandleTotalClasses}
            placeholder="Enter Total Classes..."
          />
          <Text style={styles.presentlable}>Total Classes Present</Text>
          <TextInput
            style={styles.total_present}
            value={subjectpresent}
            onChangeText={HandleTotalPresent}
            placeholder="Enter Classes Present..."
          />
          <Text style={styles.absentlable}>Total Classes Absent</Text>
          <TextInput
            style={styles.total_absent}
            value={subjectabsent}
            onChangeText={HandleTotalAbsent}
            placeholder="Enter Classes Absent..."
          />
          <Text style={styles.criteria_lable}>Attendance Criteria</Text>
          <TextInput
            style={styles.criteria}
            value={subjectcriteria}
            onChangeText={HandleCriteria}
            placeholder="Enter Attendance Criteria..."
          />
          <TouchableOpacity style={styles.addbutton} onPress={addSubject}>
            <Text style={styles.addText}>{edit?'Update':'Add'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default AddSubject;
const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: '75%',
    zIndex: 2,
    borderWidth:1,
    left: '2%',
    top: '15%',
    position:'absolute'
  },
  addItem: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor:'black',
    shadowOffset:{width:0,height:10},
    shadowRadius:10,
    shadowOpacity:0.3,
    elevation:5
  },
  Header: {
    marginTop: '2%',
    fontSize: 25,
    fontWeight: 700,
  },
  Subject: {
    marginTop: '2%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  subjectlabel: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: '-58%',
    marginTop: 10,
  },
  totallable: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: '-59%',
    marginTop: '2%',
  },
  total: {
    margintop: '2%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  total_present: {
    marginTop:'2%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  presentlable: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: '-39%',
    marginTop: '2%',
  },
  absentlable: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: -150,
    marginTop: '2%',
  },
  total_absent: {
    marginTop: '2%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  criteria_lable: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: -150,
    marginTop: '2%',
  },
  criteria: {
    marginTop: '2%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  addbutton: {
    marginTop: '3%',
    borderWidth: 1,
    width: '30%',
    height: '8%',
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 15,
    padding: 4,
  },
  addText: {
    fontSize: 20,
    fontWeight: 500,
    fontStyle: 'bold',
  },
  cross:{
    height:20,
    width:20,
    position:'absolute',
    right:'-42%',
    marginTop:'-1%'
  },
});

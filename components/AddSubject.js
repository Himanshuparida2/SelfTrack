import React, { useContext, useEffect, useState } from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { AddingContext } from '../context/addingContext';
import cross from '../Images/close_icon.png'

function AddSubject() {
  const [subjecttext, setSubjectText] = useState('');
  const [subjectclass, setSubjectClass] = useState('');
  const [subjectpresent, setSubjectPresent] = useState('');
  const [subjectabsent, setSubjectAbsent] = useState('');
  const [subjectcriteria, setSubjectCriteria] = useState('');
  const {AddPressed, setAddPressed} = useContext(AddingContext);
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
    setAddPressed(false)
  }

  return (
    <View style={styles.container}>
      {AddPressed && (
        <View style={styles.addItem}>
          <Text style={styles.Header}>Add Subject</Text>
          <TouchableOpacity  onPress={HandleClose}>
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
          <TouchableOpacity style={styles.addbutton}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default AddSubject;
const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '55%',
    zIndex: 2,
    borderWidth:1,
    left: '5%',
    top: '20%',
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
    marginTop: 10,
    fontSize: 25,
    fontWeight: 700,
  },
  Subject: {
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  subjectlabel: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: -220,
    marginTop: 10,
  },
  totallable: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: -225,
    marginTop: 5,
  },
  total: {
    margintop: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  total_present: {
    marginTop:5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  presentlable: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: -150,
    marginTop: 5,
  },
  absentlable: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: -150,
    marginTop: 5,
  },
  total_absent: {
    marginTop: 5,
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
    marginTop: 5,
  },
  criteria: {
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '80%',
    padding: 10,
  },
  addbutton: {
    marginTop: 10,
    borderWidth: 1,
    width: '30%',
    height: '8%',
    alignItems: 'center',
    borderRadius: 15,
    padding: 4,
  },
  addText: {
    fontSize: 20,
    fontWeight: 500,
    fontStyle: 'bold',
  },
  cross:{
    height:15,
    width:15,
    position:'absolute',
    right:-140,
    top:-15

  },
});

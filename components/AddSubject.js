import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AddingContext } from '../context/addingContext';
import cross from '../Images/close_icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddSubject() {
  const [subjecttext, setSubjectText] = useState('');
  const [subjectclass, setSubjectClass] = useState('');
  const [subjectpresent, setSubjectPresent] = useState('');
  const [subjectabsent, setSubjectAbsent] = useState('');
  const [subjectcriteria, setSubjectCriteria] = useState('75');
  const { AddPressed, setAddPressed, subject, setSubject, edit, setEdit } = useContext(AddingContext);

  useEffect(() => {
    const setupData = async () => {
      if (subject) {
        try {
          const getdata = await AsyncStorage.getItem('UserSubject');
          if (getdata) {
            const data = JSON.parse(getdata).find(i => i.name === subject);
            if (data) {
              setSubjectText(data.name);
              setSubjectAbsent(`${data.absent}`);
              setSubjectClass(`${data.totalclass}`);
              setSubjectPresent(`${data.present}`);
              setSubjectCriteria(`${data.criteria}`);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    setupData();
  }, [subject]);

  const HandleClose = () => {
    setSubject('');
    setEdit(false);
    setAddPressed(false);
  };

  let present = parseInt(subjectpresent, 10);
  let absent = parseInt(subjectabsent, 10);
  let totalclass = parseInt(subjectclass, 10);
  let criteria = parseInt(subjectcriteria, 10);
  let percentage = totalclass > 0 ? (present / totalclass) * 100 : 0;

  const addSubject = async () => {
    if (isNaN(present) || isNaN(absent) || isNaN(totalclass) || isNaN(criteria)) {
      Alert.alert('Please Enter Valid Numbers for Classes and Criteria');
      return;
    }
    if (totalclass < present || totalclass < absent) {
      Alert.alert("Total Classes Can't Be Less Than Present or Absent classes");
      return;
    }

    try {
      if (edit) {
        const getdata = await AsyncStorage.getItem('UserSubject');
        if (getdata) {
          const data = JSON.parse(getdata);
          const index = data.findIndex(i => i.name === subject);
          if (index !== -1) {
            data[index] = {
              ...data[index],
              name: subjecttext,
              totalclass: subjectclass,
              present: subjectpresent,
              absent: subjectabsent,
              criteria: subjectcriteria,
              percent: percentage,
            };
            await AsyncStorage.setItem('UserSubject', JSON.stringify(data));
            HandleClose();
            Alert.alert('Data Edited Successfully!!');
          }
        }
      } else {
        const newSubject = {
          name: subjecttext,
          present: present,
          absent: absent,
          totalclass: totalclass,
          criteria: criteria,
          percent: percentage,
        };
        const getData = await AsyncStorage.getItem('UserSubject');
        const Data = getData ? JSON.parse(getData) : [];
        Data.push(newSubject);
        await AsyncStorage.setItem('UserSubject', JSON.stringify(Data));

        setSubjectText('');
        setSubjectAbsent('');
        setSubjectClass('');
        setSubjectCriteria('');
        setSubjectPresent('');
        HandleClose();
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Some Error Occurred!!');
    }
  };

  return (
    AddPressed && (
      <SafeAreaView style={styles.container}>
        <View style={styles.addItem}>
          <TouchableOpacity style={styles.crossContainer} onPress={HandleClose}>
            <Image source={cross} style={styles.cross} />
          </TouchableOpacity>
          <Text style={styles.Header}>{edit ? 'Edit' : 'Add'} {subject || 'Subject'}</Text>

          <Text style={styles.label}>Subject Name</Text>
          <TextInput style={styles.input} value={subjecttext} onChangeText={setSubjectText} placeholder="Enter Subject Name..." />

          <Text style={styles.label}>Total Classes</Text>
          <TextInput style={styles.input} value={subjectclass} onChangeText={setSubjectClass} placeholder="Enter Total Classes..." keyboardType="numeric" />

          <Text style={styles.label}>Total Classes Present</Text>
          <TextInput style={styles.input} value={subjectpresent} onChangeText={setSubjectPresent} placeholder="Enter Classes Present..." keyboardType="numeric" />

          <Text style={styles.label}>Total Classes Absent</Text>
          <TextInput style={styles.input} value={subjectabsent} onChangeText={setSubjectAbsent} placeholder="Enter Classes Absent..." keyboardType="numeric" />

          <Text style={styles.label}>Attendance Criteria</Text>
          <TextInput style={styles.input} value={subjectcriteria} onChangeText={setSubjectCriteria} placeholder="Enter Attendance Criteria..." keyboardType="numeric" />

          <TouchableOpacity style={styles.addbutton} onPress={addSubject}>
            <Text style={styles.addText}>{edit ? 'Update' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  );
}

export default AddSubject;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: '78%',
    zIndex: 2,
    borderWidth: 1,
    left: '2%',
    top: '15%',
    position: 'absolute',
  },
  addItem: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 5,
    padding: 20,
  },
  crossContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 10,
  },
  cross: {
    height: 24,
    width: 24,
  },
  Header: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '90%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addbutton: {
    marginTop: 10,
    borderWidth: 1,
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#007bff',
  },
  addText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
});
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AddingContext } from '../context/addingContext';
import cross from '../Images/close_icon.png';
import SQLite from 'react-native-sqlite-storage';
import {useFocusEffect} from '@react-navigation/native';
import { BackHandler } from 'react-native';

function AddSubject() {
  const [subjecttext, setSubjectText] = useState('');
  const [subjectclass, setSubjectClass] = useState('');
  const [subjectpresent, setSubjectPresent] = useState('');
  const [subjectabsent, setSubjectAbsent] = useState('');
  const [subjectcriteria, setSubjectCriteria] = useState('75');
  const { AddPressed, setAddPressed, subject, setSubject, edit, setEdit } = useContext(AddingContext);

  const db = SQLite.openDatabase({ name: 'selftrack.db', location: 'default' });
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS UserSubject (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, totalclass INTEGER, present INTEGER, absent INTEGER, criteria INTEGER, percent REAL)',
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.error('Error creating table:', error);
      }
    );
  });
  const handleBackButton = () => {
    setAddPressed(false);
    setEdit(false);
    setSubject('');
    return true;
  };
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton
      );
      return () => backHandler.remove();
    }, [AddPressed])
  );
  useEffect(() => {
    const setupData = async () => {
      if (subject) {
        try {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM UserSubject WHERE name=?',
              [subject],
              (_, results) => {
                if (results.rows.length > 0) {
                  const data = results.rows.item(0);
                  setSubjectText(data.name);
                  setSubjectClass(data.totalclass);
                  setSubjectPresent(data.present);
                  setSubjectAbsent(data.absent);
                  setSubjectCriteria(data.criteria);
                } else {
                  console.log('No data found');
                }
              },
              error => {
                console.error('Error fetching data:', error);
              }
            );
          });
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
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE UserSubject SET name=?, absent=?, totalclass=?, present=?, criteria=?, percent=? WHERE name=?',
            [subjecttext, subjectabsent, subjectclass, subjectpresent, subjectcriteria, percentage, subject],
            () => {
              console.log('Data updated successfully');
            },
            error => {
              console.error('Error updating data:', error);
            }
          );
        });
        Alert.alert('Data Edited Successfully!!');
      } else {
        db.transaction(tx=>{
          tx.executeSql(
          'INSERT INTO UserSubject (name, absent, totalclass, present, criteria, percent) VALUES (?, ?, ?, ?, ?, ?)',
          [subjecttext, subjectabsent, subjectclass, subjectpresent, subjectcriteria, percentage],
          () => {
            console.log('Data inserted successfully');
          },
          error => {
            console.error('Error inserting data:', error);
          }
        );
      });
        Alert.alert('Data Added Successfully!!');
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
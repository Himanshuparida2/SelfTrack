import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';  // Corrected the component name

function TheCalendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const handleClick=(day: { dateString: React.SetStateAction<string>; })=>{
    let date=new Date().toISOString();
    date=date.slice(0,10);
    if(day.dateString > date){
      Alert.alert("Invalid Date", "You can't select a future date")
      return;
    }
    else{
      setSelectedDate(`${day.dateString}`);
    }
  }
  return (
    <View style={styles.container}>
      <Calendar
        style={{ width: 400 }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' },
        }}
        onDayPress={(day) => {
          handleClick(day);
        }}
        monthFormat='MMMM yyyy'
      />
    </View>
  );
}
export default TheCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
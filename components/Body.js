import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AddingContext } from '../context/addingContext'

function Body() {
    const [subjecttext,setSubjectText]=useState('')
    const {AddPressed,setAddPressed}=useContext(AddingContext)
    const [subjectclass,setSubjectClass]=useState('')
    const [subjectpresent,setSubjectPresent]=useState('')
    const [subjectabsent,setSubjectAbsent]=useState('')
    const [subjectcriteria,setSubjectCriteria]=useState('')
    const [background,setBackground]=useState({background_color:'white',opacity:1})
    useEffect(()=>{
        if(AddPressed){
            setBackground({background_color:'black',opacity:0.3})
        }else{
            setBackground({background_color:'white',opacity:1})
        }
    },[])
    const HandleSubject=(text)=>{
        setSubjectText(text)
    }
    const HandleTotalClasses=(total)=>{
        setSubjectClass(total)
    }
    const HandleTotalPresent=(present)=>{
        setSubjectPresent(present)
    }
    const HandleTotalAbsent=(absent)=>{
        setSubjectAbsent(absent)
    }
    const HandleCriteria=(criteria)=>{
        setSubjectCriteria(criteria)
    }
  return (
    <View style={[styles.container,{backgroundColor:background.background_color,opacity:background.opacity}]}>
           {AddPressed&&( 
            <View style={styles.addItem}>
                <Text style={styles.Header}>Add Subject</Text>
              <Text style={styles.subjectlabel}>Subject Name</Text>
              <TextInput style={styles.Subject} value={subjecttext} onChangeText={HandleSubject} placeholder='Enter Subject Name...'/>
              <Text style={styles.totallable}>Total Classes</Text>
              <TextInput style={styles.total} value={subjectclass} onChangeText={HandleTotalClasses} placeholder='Enter Total Classes...'/>
              <Text style={styles.presentlable}>Total Classes Present</Text>
              <TextInput style={styles.total_present} value={subjectpresent} onChangeText={HandleTotalPresent} placeholder='Enter Classes Present...'/>
              <Text style={styles.absentlable}>Total Classes Absent</Text>
              <TextInput style={styles.total_absent} value={subjectabsent} onChangeText={HandleTotalAbsent} placeholder='Enter Classes Absent...'/>
              <Text style={styles.criteria_lable}>Attendance Criteria</Text>
              <TextInput style={styles.criteria} value={subjectcriteria} onChangeText={HandleCriteria} placeholder='Enter Attendance Criteria...'/>
              <TouchableOpacity style={styles.addbutton}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
        )}
    </View>
  )
}

export default Body

const styles=new StyleSheet.create({
    container:{
        width:'100%',
        height:'90%',
        zIndex:1,
    },
    addItem:{
        position:'absolute',
        zIndex:4,
        width:'90%',
        height:'58%',
        backgroundColor:'yellow',
        left:'5%',
        top:'10%',
        alignItems:'center',
      },
      Header:{
        marginTop:10,
        fontSize:25,
        fontWeight:700,
      },
      Subject:{
        position:'absolute',
        top:77,
        borderColor:'black',
        borderWidth:1,
        borderRadius:15,
        width:'80%',
        padding:10
      },
      subjectlabel:{
        fontSize:20,
        fontWeight:500,
        marginLeft:-220,
        marginTop:5.5,
      },
      totallable:{
        fontSize:20,
        fontWeight:500,
        marginLeft:-225,
        marginTop:45
      },
      total:{
        position:'absolute',
        top:150,
        borderColor:'black',
        borderWidth:1,
        borderRadius:15,
        width:'80%',
        padding:10
      },
      total_present:{
        position:'absolute',
        top:220,
        borderColor:'black',
        borderWidth:1,
        borderRadius:15,
        width:'80%',
        padding:10
      },
      presentlable:{
        fontSize:20,
        fontWeight:500,
        marginLeft:-150,
        marginTop:45
      },
      absentlable:{
        fontSize:20,
        fontWeight:500,
        marginLeft:-150,
        marginTop:45
      },
      total_absent:{
        position:'absolute',
        top:290,
        borderColor:'black',
        borderWidth:1,
        borderRadius:15,
        width:'80%',
        padding:10
      },
      criteria_lable:{
        fontSize:20,
        fontWeight:500,
        marginLeft:-150,
        marginTop:45
      },
      criteria:{
        position:'absolute',
        top:365,
        borderColor:'black',
        borderWidth:1,
        borderRadius:15,
        width:'80%',
        padding:10
      },
      addbutton:{
        marginTop:60,
        borderWidth:1,
        width:'30%',
        height:'8%',
        alignItems:'center',
        borderRadius:15,
        padding:4,
      },
      addText:{
        fontSize:20,
        fontWeight:500,
        fontStyle:'bold',
      },
})

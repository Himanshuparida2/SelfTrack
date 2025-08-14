import React, { useContext, useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { AddingContext } from '../context/addingContext'
import { CircularProgress } from 'react-native-circular-progress'
import SQLite from 'react-native-sqlite-storage'
import TheCalendar from './TheCalender'
import cross from '../Images/close_icon.png';
import {useFocusEffect} from '@react-navigation/native';
import { BackHandler } from 'react-native';
import BannerAds from './BannerAds.js'

function Body() {
    const {AddPressed,background,setEdit,setSubject,setAddPressed,opensidebar,setOpenSideBar}=useContext(AddingContext)
    const [sub,setSub]=useState([])
    const [update,setUpdate]=useState(false)
    const [detailSubject,setDetailSubject]=useState(null)
    const [showDetails,setShowDetails]=useState(false)
    const [openCalender,setOpenCalender]=useState()
    let percent;

    const db=SQLite.openDatabase({name:'selftrack.db',location:'default'})
    db.transaction(tx=>{
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS UserSubject (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, totalclass INTEGER, present INTEGER, absent INTEGER, criteria INTEGER, percent REAL)',
            [],
            ()=>{
                console.log('Table created successfully')
            },
            error=>{
                console.error('Error creating table:',error)
            }
        )
    })
    const handleBackButton = () => {
        setOpenCalender(false);
        setSubject('');
        hideDetails()
        return true;
      };
      useFocusEffect(
        React.useCallback(() => {
          const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButton
          );
          return () => backHandler.remove();
        }, [openCalender])
      );
    useEffect(()=>{
        const response=async()=>{
            try{
                db.transaction(tx=>{
                    tx.executeSql(
                        'SELECT * FROM UserSubject',
                        [],
                        (_,results)=>{
                            const data=[]
                            for(let i=0;i<results.rows.length;i++){
                                data.push(results.rows.item(i))
                            }
                            console.log('Data fetched:',data)
                            setSub(data)
                        },
                        error=>{
                            console.error('Error fetching data:',error)
                        }
                    )
                }
                )
            }catch(err){
                console.error(err)
            }
        }
        response()
    },[background,AddPressed,update,openCalender])
    const removeSub=async(SUB)=>{
        try{
            db.transaction(tx=>{
                tx.executeSql(
                    'DELETE FROM UserSubject WHERE name=?',
                    [SUB],
                    (_,results)=>{
                        console.log('Data Deleted:',results)
                        setSub(prevSub=>prevSub.filter(i=>i.name!=SUB))
                    }
                )
            })
            setUpdate(true)
        }catch(err){
            console.error(err)
        }
    }
    const reqclass=(present,total,criteria)=>{
        if(total==0){
            return 0
        }
        let i=present;
        while(true){
            if(((i/total)*100)>=criteria){
                return i-present
            }
            i++;
            total++;
        }
    }
    const bunk=(present,total,criteria)=>{
        if(total==0){
            return 0
        }
        let i=0;
        while(true){
            total++
            i++
            if((present/total)*100<criteria){
                break
            }
        }
        return i-1
    }
    const handleLongPress=(subject)=>{
            setDetailSubject(subject)
            setShowDetails(true)
    }
    const hideDetails=()=>{
        setDetailSubject(null)
        setShowDetails(false)
    }
    const OpenCalender=(name)=>{
       setOpenCalender(true)
       setSubject(name)
    }
    const HandleEdit=(name)=>{
        setAddPressed(true)
        setEdit(true)
        setSubject(name)
    }
    const handlepercent=(present,total)=>{
        percent=(present/total)*100;
        if(percent>0){
            return percent
        }
        return 0
    }
    
  return (
        <SafeAreaView style={[styles.container,{backgroundColor:background.background_color,opacity:background.opacity,backgroundColor:opensidebar?'grey':'white'}]}>
        <TouchableWithoutFeedback onPress={()=>{hideDetails(),setDetailSubject(null);setOpenSideBar(false);setAddPressed(false)}}>
        <ScrollView style={styles.ScrollView} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
            {sub.length > 0 ? (sub.map((subject, index) =>(
            <TouchableOpacity onPress={()=>{OpenCalender(subject.name);hideDetails()}} onLongPress={()=>{handleLongPress(subject.name)}} key={index} style={[styles.subjects]}>
                <View>
                    {(detailSubject)==subject.name?(
                        <View style={styles.option}>
                            <TouchableOpacity style={styles.options} onPress={()=>{HandleEdit(subject.name);setDetailSubject(false)}}><Text style={styles.optionText}>Edit</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.options} onPress={()=>{removeSub(subject.name);setDetailSubject(false)}}><Text style={styles.optionText}>Delete</Text></TouchableOpacity>
                        </View>
                    ):null}
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.present}>Present : {subject.present}</Text>
                <Text style={styles.absent}>Absent : {subject.absent}</Text>
                <Text style={styles.total}>Total : {subject.totalclass}</Text>
                <Text style={styles.criteria}>Criteria : {subject.criteria}%</Text>
                <Text style={styles.optional}>{handlepercent(subject.present,subject.totalclass) >= 75 ? `Can Skip :${bunk(subject.present,subject.totalclass,subject.criteria)}` : `Need More : ${reqclass(subject.present, subject.totalclass, subject.criteria)}`}</Text>
                <Text style={[styles.percentage,{fontSize: Math.floor(handlepercent(subject.present,subject.totalclass)) === 100 ? 11 : (Math.floor(handlepercent(subject.present,subject.totalclass)) < 10 ? 15 : 13),right: Math.floor(handlepercent(subject.present,subject.totalclass)) < 10 ? '7%' : (Math.floor(handlepercent(subject.present,subject.totalclass)) === 100 ? '6.3%' : '6.5%'),top:Math.floor(handlepercent(subject.present,subject.totalclass))<10?'109%':'115%'}]}>{Math.floor(handlepercent(subject.present,subject.totalclass))}%</Text>
                <CircularProgress width={10} size={50} fill={handlepercent(subject.present,subject.totalclass)} rotation={0} tintColor={handlepercent(subject.present,subject.totalclass)>=75?'#10f85a':'#f34b0c'} backgroundColor='black' arcSweepAngle={360} lineCap='round' showsText={true} style={styles.bar}/>
                </View>
           </TouchableOpacity>
        ))):null}
        </ScrollView>
        </TouchableWithoutFeedback>
        <BannerAds/>
        {openCalender?
            <View style={{width:'100%',height:'80%',position:'absolute'}}>
                <TouchableWithoutFeedback onPress={()=>{setOpenCalender(false)}}>
                    <Image source={cross} style={styles.cross}/>
                </TouchableWithoutFeedback>
                <TheCalendar/>
            </View>:null}
        </SafeAreaView>
  )
}

export default Body

const styles=new StyleSheet.create({
    container:{
        flex:1
    },
    ScrollView:{
        flex:1
    },
    scrollContainer:{
        paddingBottom:100,
        paddingTop:5
    },
    subjects:{
        width:'100%',
        minHeight:110,
        marginTop:10,
        borderWidth:1.5,
        paddingLeft:10,
        shadowColor:'black',
        shadowOffset:{width:0,height:10},
        shadowRadius:15,
        shadowOpacity:0.3,
        elevation:1.5,
        position:'relative',
        padding:2,
    },
    subjectName:{
        fontSize:20,
        fontWeight:500,
    },
    present:{
        fontSize:16,
        position:'absolute',
        marginTop:27
    },
    absent:{
        fontSize:16,
        position:'absolute',
        marginTop:48
    },
    total:{
        fontSize:16,
        position:'absolute',
        marginTop:27,
        left:108,
    },
    criteria:{
        fontSize:16,
        position:'absolute',
        marginTop:48,
        left:108
    },
    bar:{
        position:'absolute',
        right:15,
        marginTop:15,
    },
    optional:{
        position:'absolute',
        top:72,
        fontSize:15
    },
    percentage:{
        position:'absolute',
        marginRight:'0.5%',
        marginTop:'155%',
        fontSize:12,
        fontWeight:600
    },
    option:{
        position:'absolute',
        width:'30%',
        height:100,
        zIndex:10,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        right:'5%',
        top:"-27%",
    },
    options:{
        width:'100%',
        height:50,
        marginTop:0,
        marginBottom:0,
        borderWidth:1,
        backgroundColor:'white',
        justifyContent:'center',
        padding:10,
        zIndex:9
        },
    optionText:{
        backgroundColor:'white',
        height:'100%',
        fontSize:20,
        textAlign:'center',
        zIndex:5
    },
    cross:{
        zIndex:10,
        width:20,
        height:20,
        position:'absolute',
        right:'7%',
        marginTop:'19%'
    },
})

import React, { useContext, useEffect, useState } from 'react'
import { Animated, Dimensions, Image, Linking, SafeAreaView, ScrollView, ScrollViewComponent, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { AddingContext } from '../context/addingContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CircularProgress } from 'react-native-circular-progress'
import TheCalendar from './TheCalender'
import cross from '../Images/close_icon.png';
import BannerAds from './BannerAds.js'

const {width,height}=Dimensions.get('window')
function Body() {
    const {AddPressed,background,setEdit,setSubject,setAddPressed,opensidebar,setOpenSideBar}=useContext(AddingContext)
    const [sub,setSub]=useState([])
    const [update,setUpdate]=useState(false)
    const [detailSubject,setDetailSubject]=useState(null)
    const [showDetails,setShowDetails]=useState(false)
    const [openCalender,setOpenCalender]=useState()
    const moveleft=new Animated.Value(-100)

        Animated.timing(moveleft,{
            toValue:0,
            duration:500,
            useNativeDriver:true,
        }).start()
    
    useEffect(()=>{
        const response=async()=>{
            try{
                const getData=await AsyncStorage.getItem('UserSubject')
                const Data=getData?JSON.parse(getData):[]
                setSub(Data)
            }catch(err){
                console.error(err)
            }
        }
        response()
        console.log(sub)
    },[background,AddPressed,update,openCalender])
    const removeSub=async(SUB)=>{
        try{
            const getData=await AsyncStorage.getItem('UserSubject')
            const Data=getData?JSON.parse(getData):[]
            const UpdatedData=Data.filter(i=>i.name!==SUB)
            await AsyncStorage.setItem('UserSubject',JSON.stringify(UpdatedData));
            await AsyncStorage.removeItem(`${SUB}presentDates`)
            await AsyncStorage.removeItem(`${SUB}absentDates`)
            setUpdate(true)
        }catch(err){
            console.error(err)
        }
    }
    const reqclass=(present,total,criteria)=>{
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
        if(detailSubject===subject){
            setDetailSubject(null)
            setShowDetails(false)
        }
        else{
            setDetailSubject(subject)
            setShowDetails(true)
        }
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
    const HandleEmail=()=>{
        const email='himanshuparida27@gmail.com'
        const subject='Report Issue'
        const url=`mailto:${email}?subject=${encodeURIComponent(subject)}`
        Linking.openURL(url).catch(err=>console.error("Error Occured: ",err))
    }
    
  return (
    <TouchableWithoutFeedback onPress={()=>{setDetailSubject(null);setOpenSideBar(false);setAddPressed(false)}}>
        <SafeAreaView style={[styles.container,{backgroundColor:background.background_color,opacity:background.opacity,backgroundColor:opensidebar?'grey':'white'}]}>
            {opensidebar?<Animated.View style={[styles.sidebar,{transform:[{ translateX: moveleft }]}]}>
                    <TouchableOpacity style={styles.helpbutton} onPress={()=>HandleEmail()}><Text>Get Help?</Text></TouchableOpacity>
                </Animated.View>:null}
            {sub.length > 0 ? (sub.map((subject, index) =>(
            <View key={index} style={[styles.subjects]}>
                <TouchableOpacity onPress={()=>{OpenCalender(subject.name)}} onLongPress={()=>{handleLongPress(subject.name)}}>
                    {(detailSubject)==subject.name?(
                        <View style={styles.option}>
                            <TouchableOpacity style={styles.options} onPress={()=>HandleEdit(subject.name)}><Text style={styles.optionText}>Edit</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.options} onPress={()=>removeSub(subject.name)}><Text style={styles.optionText}>Delete</Text></TouchableOpacity>
                        </View>
                    ):null}
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.present}>Present : {subject.present}</Text>
                <Text style={styles.absent}>Absent : {subject.absent}</Text>
                <Text style={styles.total}>Total : {subject.totalclass}</Text>
                <Text style={styles.criteria}>Criteria : {subject.criteria}%</Text>
                <Text style={styles.optional}>{subject.percent >= 75 ? `Can Skip :${bunk(subject.present,subject.totalclass,subject.criteria)}` : `Need More : ${reqclass(subject.present, subject.totalclass, subject.criteria)}`}</Text>
                <Text style={[styles.percentage,{fontSize: Math.floor(subject.percent) === 100 ? 11 : (Math.floor(subject.percent) < 10 ? 15 : 13),right: Math.floor(subject.percent) < 10 ? '7%' : (Math.floor(subject.percent) === 100 ? '6.3%' : '6.5%'),top:Math.floor(subject.percent)<10?'109%':'115%'}]}>{Math.floor(subject.percent)}%</Text>
                <CircularProgress width={10} size={50} fill={subject.percent} rotation={0} tintColor={subject.percent>=75?'#10f85a':'#f34b0c'} backgroundColor='black' arcSweepAngle={360} lineCap='round' showsText={true} style={styles.bar}/>
                </TouchableOpacity>
           </View>
        ))):null}
        <BannerAds/>
        {openCalender?
            <View style={{width:'100%',height:'80%',position:'absolute'}}>
                <TouchableWithoutFeedback onPress={()=>{setOpenCalender(false)}}>
                    <Image source={cross} style={styles.cross}/>
                </TouchableWithoutFeedback>
                <TheCalendar/>
            </View>:null}
        </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default Body

const styles=new StyleSheet.create({
    container:{
        width:width,
        height:height
    },
    subjects:{
        width:'100%',
        height:'12%',
        marginTop:10,
        borderWidth:1,
        paddingLeft:10,
        shadowColor:'black',
        shadowOffset:{width:0,height:10},
        shadowRadius:15,
        shadowOpacity:0.3,
        elevation:1.5,
        position:'relative'
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
        top:27,
        right:90,
        fontSize:15
    },
    percentage:{
        position:'absolute',
        marginRight:'0.5%',
        marginTop:'2%',
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
        marginTop:'20%'
    },
    sidebar:{
        borderWidth:1,
        width:"45%",
        height:'100%',
        position:'absolute',
        zIndex:2,
        backgroundColor:'white',
        opacity:1,
    },
    helpbutton:{
        borderWidth:1,
        width:'50%',
        height:'5%',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        marginTop:'10%',
        borderRadius:15,
        shadowColor:'black',
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity:0.3,
        shadowRadius:15,
        position:'relative',
        zIndex:5
    }
})

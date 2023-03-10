import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { useEffect, useState } from 'react';
import { Text, StatusBar, StyleSheet, View, Image, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import TodoList from '../components/TodoList';
import { todosData } from '../data/todo';
import { hideComplitedReducer, setTodosReducer } from '../redux/todosSlice';
import * as Notificacion from 'expo-notifications'
import { Constants } from 'expo-constants';
import * as Device from 'expo-device'
import dayjs from 'dayjs';

Notificacion.setNotificationHandler({
  handleNotification : async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
})

export default function Home() {

    //const [localData, setlocalData] = useState(todosData.sort((a,b) => {return a.isCompleted - b.isCompleted}))

    const [isHidden, setisHidden] = useState(false)
    const [expoPushToken, setexpoPushToken] = useState('')
    const navigation = useNavigation()
    const todos = useSelector(state => state.todos.todos)
    console.log(todos)
    const dispatch = useDispatch()

    useEffect(() => {
      registerForPushNotificationAsync().then(token => setexpoPushToken(token))
      const getTodos = async () => {
        try {
          const todos = await AsyncStorage.getItem("@Todos")
          if(todos !== null){
            const todosData = JSON.parse(todos)
            const todosDataFiltered = todosData.filter(todo => {
              return dayjs(new Date(todo.hour)).isSameOrAfter(dayjs(), 'day')
            })
            if(todosDataFiltered !== null){
              await AsyncStorage.setItem("@Todos", JSON.stringify(todosDataFiltered))
              dispatch(setTodosReducer(todosDataFiltered))
            }
            dispatch(setTodosReducer(JSON.parse(todos)))
          }
        } catch (error) {
          console.log(error)
        }
      }
      getTodos()
    }, [])
    

    const handleHidePress = async () => {
      if(isHidden){
        setisHidden(false)
        const todos = await AsyncStorage.getItem("@Todos")
        if(todos !== null){
          dispatch(setTodosReducer(JSON.parse(todos)))
        }
        // setlocalData(todosData.sort((a,b) => {return a.isCompleted - b.isCompleted}))
         return;
      }

      setisHidden(true)
      dispatch(hideComplitedReducer())
      // setisHidden(!isHidden)
      // setlocalData(localData.filter(item => !item.isCompleted))
    }

    const registerForPushNotificationAsync = async () => {
      let token;
      if(Device.IsDevice){
        const {status: existingStatus} = await Notificacion.getPermissionsAsync()
        let finalStatus = existingStatus;

        if(existingStatus !== 'granted'){
          const {status} = await Notificacion.getPermissionsAsync()
          finalStatus = status;
        }

        if(existingStatus !== 'granted'){
          alert('No se oudo obtener notificación')
          return;
        }

        token = (await Notificacion.getExpoPushTokenAsync()).data
        //console.log(token)
      }else{
        return
      }

      if(Platform.OS === 'android'){
        Notificacion.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notificacion.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C'
        })
      }

      return token;

    }

  return (
    <View style={styles.container}>
      <StatusBar styles="auto"/>
      <Image 
        source={{uri: 'https://media.licdn.com/dms/image/C4E03AQHB06PoEKo99w/profile-displayphoto-shrink_800_800/0/1633669382274?e=2147483647&v=beta&t=ooAd-XaW2iMprh6yzzYH7YPrDn47l5gOroq7lhRtj-s'}}
        style={styles.pic}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={styles.title}>Hoy</Text>
          <TouchableOpacity onPress={handleHidePress}>
            <Text style={{color: '#3478f6'}}>{isHidden ? "Mostrar completados" : 'Ocultar completados'}</Text>
          </TouchableOpacity>
        </View>
        
        <TodoList todosData={todos.filter(item => {
          console.log(item)
          console.log(dayjs(new Date(item.hour)).isSame(new Date(), 'day'))
          return dayjs(new Date(item.hour)).isSame(new Date(), 'day')
        })}/>
        <Text style={styles.title}>Mañana</Text>
        <TodoList todosData={todos.filter(item => dayjs(new Date(item.hour)).isAfter(new Date(), 'day'))}/>

        <TouchableOpacity onPress={() => navigation.navigate('Add')} style={styles.button}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
    </View>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 15
  },
  pic:{
    width: 42,
    height: 42,
    borderRadius: 21,
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
    marginTop: 10
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 50,
    right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: .5,
    shadowRadius: 5,
    elevation: 5
  },
  plus: {
    fontSize: 40,
    color: '#fff',
    position: 'absolute',
    top: -8,
    left: 10
  }
});

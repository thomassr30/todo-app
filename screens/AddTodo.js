import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Switch, Button, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import { Entypo } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from 'react-redux';
import { addTodoReducer } from '../redux/todosSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid'
import { useNavigation } from '@react-navigation/native';
import * as Notification from 'expo-notifications'


require('dayjs/locale/es')

export default AddTodo = () => {
    const [name, setname] = useState('')
    const [date, setdate] = useState(new Date())
    const [isToday, setisToday] = useState(false)
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [withAlert, setwithAlert] = useState(false)
    const listTodos = useSelector(state => state.todos.todos)
    const dispatch = useDispatch();
    const navigation = useNavigation()

    const addTodo = async () => {
        const newTodo = {
            id: Math.floor(Math.random() * 1000000),
            text: name,
            hour: isToday ? date.toISOString() : date.setDate(date.getDate() + 1),
            isToday: isToday,
            isCompleted: false,
        }
        try {
            await AsyncStorage.setItem("@Todos", JSON.stringify([...listTodos, newTodo]));
            dispatch(addTodoReducer(newTodo));
            if(withAlert){
                await scheduleTodoNotification(newTodo)
            }
            navigation.goBack()
        } catch (error) {
            console.log('aqui',error)
        }
    }

  const onChange = (event, selectedDate) => {
    //console.log(dayjs(selectedDate).format('HH:mm'))
    const currentDate = selectedDate;
    setShow(false);
    setdate(currentDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };

    const scheduleTodoNotification = async (todo) => {
        const trigger = new Date(todo.hour)
        try {
            await Notification.scheduleNotificationAsync({
                content: {
                    title: 'Es hora!',
                    body: todo.text
                },
                trigger
            })
            //console.log('notification')
        } catch (error) {
            alert('error')
        }
    }
    
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Nueva tarea</Text>
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Tarea</Text>
            <TextInput 
                style={styles.textInput}
                placeholder="Tarea"
                placeholderTextColor="#00000030"
                onChangeText={(text) => {setname(text)}}
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Hora</Text>
            <Text style={styles.inputTitle}>{dayjs(date).format('HH:mm A')}</Text>
            <TouchableOpacity onPress={showTimepicker}>
                <Entypo name="time-slot" size={24} color="black" />
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                />
            )}
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Hoy</Text>
            <Switch 
                value={isToday}
                onValueChange={(value) => setisToday(value)}
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Alerta</Text>
            <Switch 
                value={withAlert}
                onValueChange={(value) => setwithAlert(value)}
            />
        </View>
        <TouchableOpacity  style={styles.button} onPress={addTodo}>
                <Text style={{color: '#fff'}}>Guardar</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 30
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 35,
        marginTop: 10
    },
    inputTitle: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24
    },
    textInput: {
        borderBottomColor: '#00000030',
        borderBottomWidth: 1,
        width: '80%'
    },
    inputContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 30
    },
    button: {
        marginTop: 30,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        height: 42,
        borderRadius: 11
    }
})

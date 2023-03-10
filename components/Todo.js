import dayjs from 'dayjs';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Checkbox from './Checkbox';
import {MaterialIcons} from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux';
import { deleteTodoReducer } from '../redux/todosSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default Todo = ({id,
                        text,
                        isCompleted,
                        isToday,
                        hour}) => {
    
    const [thisTodoIsToday, setthisTodoIsToday] = hour ? useState(dayjs(new Date(hour)).isSame(new Date(), 'day')) : useState(false)
    const dispatch = useDispatch()
    const todos = useSelector(state => state.todos.todos)

    const handleDeleteTodo = async () => {
        dispatch(deleteTodoReducer(id))
        try {
            await AsyncStorage.setItem("@Todos", JSON.stringify(todos.filter(todo => todo.id !== id)))
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox 
            id={id} 
            text={text} 
            isCompleted={isCompleted} 
            isToday={thisTodoIsToday} 
            hour={hour}
        />
        <View>
            <Text style={
                isCompleted 
                ? [styles.text, {textDecorationLine: 'line-through', color: '#73737330'}]
                : styles.text
                }>{text}</Text>
            <Text style={
                isCompleted 
                ? [styles.time, {textDecorationLine: 'line-through', color: '#73737330'}]
                : styles.time
            }>{dayjs(hour).format('HH:mm A')}</Text>
        </View>
        </View>
        <TouchableOpacity onPress={handleDeleteTodo}>
            <MaterialIcons name='delete-outline' size={24} color='#000' />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
        color: '#737373'
    },
    time: {
        fontSize: 13,
        color: '#a3a3a3',
        fontWeight: '500',
    }
})

import React from 'react'
import { FlatList, Text } from 'react-native'
import Todo from './Todo'

export default TodoList = ({todosData}) => {
  return (
    <FlatList 
        data={todosData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <Todo {...item} />}
    />
  )
}

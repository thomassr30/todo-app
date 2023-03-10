import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AddTodo from './screens/AddTodo';
import Home from './screens/Home';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store ={store}>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Home'
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name='Add'
          component={AddTodo}
          options={{
            presentation: 'modal',
            headerTitleAlign: 'center',
            title: null
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
    
    
  );
}
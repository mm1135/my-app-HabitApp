import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { RootStackParamList } from '../types';
import { IconButton } from 'react-native-paper';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'タスク一覧',
            headerRight: () => (
              <IconButton
                icon="chart-bar"
                onPress={() => navigation.navigate('Statistics')}
              />
            ),
          })}
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen}
          options={{ title: 'タスクを追加' }}
        />
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetailScreen}
          options={{ title: 'タスクの詳細' }}
        />
        <Stack.Screen 
          name="Statistics" 
          component={StatisticsScreen}
          options={{ title: '統計' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 
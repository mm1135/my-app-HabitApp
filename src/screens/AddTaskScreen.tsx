import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskForm } from '../components/TaskForm';
import { useTaskStore } from '../stores/taskStore';
import { RootStackParamList, Task } from '../types';
import { Theme } from '../theme';

type AddTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

export const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<AddTaskScreenNavigationProp>();
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
    };
    addTask(newTask);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TaskForm onSubmit={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
}); 
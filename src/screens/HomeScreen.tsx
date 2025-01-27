import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TaskCard from '../components/TaskCard';
import { useTaskStore } from '../stores/taskStore';
import { Theme } from '../theme';
import { RootStackParamList, Task } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const tasks = useTaskStore((state: { tasks: Task[] }) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onComplete={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
        keyExtractor={item => item.id}
      />
      <FAB
        style={[styles.fab, { backgroundColor: Theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
        color={Theme.colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default HomeScreen; 
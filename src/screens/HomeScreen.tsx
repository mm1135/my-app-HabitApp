import React from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TaskCard from '../components/TaskCard';
import { useTaskStore } from '../stores/taskStore';
import { Theme } from '../theme';
import { RootStackParamList, Task } from '../types';
import { timeSlots } from '../constants/time';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const tasks = useTaskStore((state: { tasks: Task[] }) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const loadTasks = useTaskStore((state) => state.loadTasks);

  React.useEffect(() => {
    loadTasks();
  }, []);

  const groupedTasks = React.useMemo(() => {
    const sorted = [...tasks].sort((a, b) => a.when.localeCompare(b.when));
    return sorted.reduce((groups, task) => {
      const timeSlot = timeSlots.find(slot => slot.value === task.when)?.label || task.when;
      if (!groups[timeSlot]) {
        groups[timeSlot] = [];
      }
      groups[timeSlot].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const renderSectionHeader = (timeSlot: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{timeSlot}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
        {Object.entries(groupedTasks).map(([timeSlot, tasks]) => (
          <View key={timeSlot}>
            {renderSectionHeader(timeSlot)}
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                onComplete={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <FAB
        style={[styles.fab, { backgroundColor: Theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
        color={Theme.colors.white}
        label="タスクを追加"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  listContent: {
    paddingBottom: 100, // FABの下にスペースを確保
  },
  fab: {
    position: 'absolute',
    right: Theme.spacing.lg,
    bottom: Theme.spacing.xxl, // 位置を上げる
    borderRadius: Theme.radius.lg,
    ...Theme.elevation.medium,
  },
  sectionHeader: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
});

export default HomeScreen; 
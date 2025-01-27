import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Switch, Divider } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../stores/taskStore';
import { RootStackParamList } from '../types';
import { Theme } from '../theme';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation<TaskDetailScreenNavigationProp>();
  const { taskId } = route.params;

  const task = useTaskStore((state) => 
    state.tasks.find((t) => t.id === taskId)
  );
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>タスクが見つかりません</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteTask(taskId);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>タスクの内容</Text>
        <Text style={styles.taskText}>
          私は {task.when} {task.where} {task.what}
        </Text>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={styles.label}>優先度</Text>
        <Text style={[styles.priority, styles[task.priority]]}>
          {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
        </Text>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={styles.label}>リマインダー</Text>
        <Switch
          value={task.reminder.enabled}
          disabled
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => toggleTask(task.id)}
          style={styles.button}
        >
          {task.isCompleted ? '未完了に戻す' : '完了にする'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          textColor={Theme.colors.error}
        >
          削除
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  section: {
    padding: Theme.spacing.md,
  },
  label: {
    fontSize: 14,
    color: Theme.colors.text,
    opacity: 0.6,
    marginBottom: Theme.spacing.xs,
  },
  taskText: {
    fontSize: 18,
    color: Theme.colors.text,
  },
  priority: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  high: {
    color: Theme.colors.error,
  },
  medium: {
    color: Theme.colors.warning,
  },
  low: {
    color: Theme.colors.info,
  },
  buttonContainer: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  button: {
    marginVertical: Theme.spacing.xs,
  },
}); 
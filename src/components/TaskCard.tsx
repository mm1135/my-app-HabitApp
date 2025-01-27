import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Task } from '../types';
import { Theme } from '../theme';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onComplete, onDelete }) => {
  const borderColor = {
    high: Theme.colors.error,
    medium: Theme.colors.warning,
    low: Theme.colors.info,
  }[task.priority];

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.completeButton]}
          onPress={onComplete}
        >
          <Text style={styles.actionText}>完了</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.actionText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.card, { borderColor }]}>
          <Checkbox
            status={task.isCompleted ? 'checked' : 'unchecked'}
            onPress={onComplete}
          />
          <View style={styles.content}>
            <Text style={[
              styles.text,
              task.isCompleted && styles.completedText
            ]}>
              私は {task.when} {task.where} {task.what}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Theme.colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  text: {
    fontSize: 16,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  completeButton: {
    backgroundColor: Theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: Theme.colors.error,
  },
  actionText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});

export default TaskCard; 
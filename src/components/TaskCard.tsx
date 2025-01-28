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
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.card, { borderLeftColor: borderColor }]}>
          <Checkbox
            status={task.isCompleted ? 'checked' : 'unchecked'}
            onPress={onComplete}
            color={Theme.colors.primary}
          />
          <View style={styles.content}>
            <Text style={[styles.text, task.isCompleted && styles.completedText]}>
              私は {task.when} {task.where} {task.what}
            </Text>
            <Text style={styles.priorityText}>
              {task.priority === 'high' ? '🔴 高' : task.priority === 'medium' ? '🟡 中' : '🔵 低'}
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
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderLeftWidth: 4,
    ...Theme.elevation.small,
  },
  content: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  text: {
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  priorityText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '86%',
    marginVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    marginLeft: Theme.spacing.sm,
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
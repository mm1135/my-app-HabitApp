import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';
import { useTaskStore } from '../stores/taskStore';
import { Theme } from '../theme';

export const StatisticsScreen: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const completionRate = total > 0 ? completed / total : 0;

    const byPriority = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    const byCompletion = {
      high: tasks.filter(t => t.priority === 'high' && t.isCompleted).length,
      medium: tasks.filter(t => t.priority === 'medium' && t.isCompleted).length,
      low: tasks.filter(t => t.priority === 'low' && t.isCompleted).length,
    };

    return {
      total,
      completed,
      completionRate,
      byPriority,
      byCompletion,
    };
  }, [tasks]);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>全体の達成率</Text>
          <ProgressBar
            progress={stats.completionRate}
            color={Theme.colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.subtitle}>
            {stats.completed} / {stats.total} タスク完了
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>優先度別の達成状況</Text>
          
          <View style={styles.prioritySection}>
            <Text style={styles.priorityLabel}>高優先度</Text>
            <ProgressBar
              progress={stats.byPriority.high > 0 ? stats.byCompletion.high / stats.byPriority.high : 0}
              color={Theme.colors.error}
              style={styles.progressBar}
            />
            <Text style={styles.subtitle}>
              {stats.byCompletion.high} / {stats.byPriority.high} タスク
            </Text>
          </View>

          <View style={styles.prioritySection}>
            <Text style={styles.priorityLabel}>中優先度</Text>
            <ProgressBar
              progress={stats.byPriority.medium > 0 ? stats.byCompletion.medium / stats.byPriority.medium : 0}
              color={Theme.colors.warning}
              style={styles.progressBar}
            />
            <Text style={styles.subtitle}>
              {stats.byCompletion.medium} / {stats.byPriority.medium} タスク
            </Text>
          </View>

          <View style={styles.prioritySection}>
            <Text style={styles.priorityLabel}>低優先度</Text>
            <ProgressBar
              progress={stats.byPriority.low > 0 ? stats.byCompletion.low / stats.byPriority.low : 0}
              color={Theme.colors.info}
              style={styles.progressBar}
            />
            <Text style={styles.subtitle}>
              {stats.byCompletion.low} / {stats.byPriority.low} タスク
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  card: {
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.text,
    opacity: 0.6,
    marginTop: Theme.spacing.xs,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  prioritySection: {
    marginTop: Theme.spacing.md,
  },
  priorityLabel: {
    fontSize: 16,
    marginBottom: Theme.spacing.xs,
  },
}); 
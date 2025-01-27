import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Switch, Text, SegmentedButtons } from 'react-native-paper';
import { Task } from '../types';
import { Theme } from '../theme';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  const [what, setWhat] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const handleSubmit = () => {
    if (!when || !where || !what) return;
    
    onSubmit({
      when,
      where,
      what,
      priority,
      reminder: {
        enabled: reminderEnabled,
        persistent: false,
        minutesBefore: 10,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="いつ"
        value={when}
        onChangeText={setWhen}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="どこで"
        value={where}
        onChangeText={setWhere}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="何を"
        value={what}
        onChangeText={setWhat}
        style={styles.input}
        mode="outlined"
      />
      
      <SegmentedButtons
        value={priority}
        onValueChange={setPriority as (value: string) => void}
        buttons={[
          { value: 'low', label: '低' },
          { value: 'medium', label: '中' },
          { value: 'high', label: '高' },
        ]}
        style={styles.priority}
      />
      
      <View style={styles.reminderContainer}>
        <Text>リマインダー</Text>
        <Switch
          value={reminderEnabled}
          onValueChange={setReminderEnabled}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        disabled={!when || !where || !what}
      >
        タスクを追加
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
  },
  input: {
    marginBottom: Theme.spacing.sm,
  },
  priority: {
    marginVertical: Theme.spacing.md,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  button: {
    marginTop: Theme.spacing.md,
  },
}); 
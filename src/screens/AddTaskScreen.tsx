import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInput, Button, Switch, Text, IconButton } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { TimePickerModal } from 'react-native-paper-dates';
import { useTaskStore } from '../stores/taskStore';
import { RootStackParamList, Task } from '../types';
import { Theme } from '../theme';
import { timeSlots } from '../constants/time';

type AddTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

const { width } = Dimensions.get('window');
const TODAY = new Date().toISOString().split('T')[0];

const priorityConfig = {
  high: {
    color: Theme.colors.error,
    icon: 'flag',
    label: '高優先度',
  },
  medium: {
    color: Theme.colors.warning,
    icon: 'flag-outline',
    label: '中優先度',
  },
  low: {
    color: Theme.colors.info,
    icon: 'flag-variant-outline',
    label: '低優先度',
  },
};

export const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<AddTaskScreenNavigationProp>();
  const addTask = useTaskStore((state) => state.addTask);

  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [timeSlot, setTimeSlot] = useState('');
  const [where, setWhere] = useState('');
  const [what, setWhat] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const handleTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    // 1時間後を終了時間とする
    const endHours = (hours + 1) % 24;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    setSelectedTimeRange({ start: startTime, end: endTime });
    setTimeSlot(startTime);
    setShowTimePicker(false);
  };

  const handleSubmit = () => {
    if (!selectedDate || !timeSlot || !where || !what) return;

    const newTask: Task = {
      id: Date.now().toString(),
      date: selectedDate,
      when: timeSlot,
      where,
      what,
      priority,
      isCompleted: false,
      reminder: {
        enabled: reminderEnabled,
        persistent: false,
        minutesBefore: 10,
      },
    };

    addTask(newTask);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>日付を選択</Text>
        <Calendar
          current={selectedDate}
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: Theme.colors.primary }
          }}
          theme={{
            todayTextColor: Theme.colors.primary,
            selectedDayBackgroundColor: Theme.colors.primary,
            calendarBackground: Theme.colors.surface,
            textSectionTitleColor: Theme.colors.text,
            monthTextColor: Theme.colors.text,
            dayTextColor: Theme.colors.text,
            textDisabledColor: Theme.colors.textSecondary,
          }}
          style={styles.calendar}
        />

        <Text style={styles.sectionTitle}>時間を選択</Text>
        <View style={styles.timeSelector}>
          <Button
            mode="outlined"
            onPress={() => setShowTimePicker(true)}
            style={styles.timeButton}
          >
            {selectedTimeRange 
              ? `${selectedTimeRange.start} - ${selectedTimeRange.end}`
              : '時間を選択'}
          </Button>
        </View>

        <TimePickerModal
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          onConfirm={handleTimeConfirm}
          hours={12}
          minutes={0}
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
          multiline
        />

        <Text style={styles.sectionTitle}>優先度</Text>
        <View style={styles.priorityContainer}>
          {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map((level) => (
            <Button
              key={level}
              mode={priority === level ? 'contained' : 'outlined'}
              onPress={() => setPriority(level)}
              style={[
                styles.priorityButton,
                priority === level && { backgroundColor: priorityConfig[level].color }
              ]}
              icon={priorityConfig[level].icon}
              labelStyle={[
                styles.priorityButtonLabel,
                priority === level && styles.priorityButtonLabelSelected
              ]}
            >
              {priorityConfig[level].label}
            </Button>
          ))}
        </View>

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
          style={styles.submitButton}
          disabled={!selectedDate || !timeSlot || !where || !what}
        >
          タスクを追加
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
  content: {
    padding: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  calendar: {
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    marginBottom: Theme.spacing.md,
    ...Theme.elevation.small,
  },
  timeSelector: {
    marginBottom: Theme.spacing.lg,
  },
  timeButton: {
    backgroundColor: Theme.colors.surface,
    ...Theme.elevation.small,
  },
  input: {
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
  },
  priorityContainer: {
    flexDirection: 'column',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  priorityButton: {
    borderRadius: Theme.radius.md,
    ...Theme.elevation.small,
  },
  priorityButtonLabel: {
    fontSize: 16,
  },
  priorityButtonLabelSelected: {
    color: Theme.colors.white,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    ...Theme.elevation.small,
  },
  submitButton: {
    marginTop: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
    ...Theme.elevation.small,
  },
}); 
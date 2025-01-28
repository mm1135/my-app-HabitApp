export interface Task {
  id: string;
  date: string; // YYYY-MM-DD形式
  when: string;
  where: string;
  what: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  reminder: {
    enabled: boolean;
    persistent: boolean;
    minutesBefore: number;
  };
}

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetail: { taskId: string };
  Statistics: undefined;
}; 
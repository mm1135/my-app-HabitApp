import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (taskId: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  loadTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>()((set) => ({
  tasks: [],
  addTask: async (task) => {
    set((state) => {
      const newTasks = [...state.tasks, task];
      AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  toggleTask: async (taskId) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );
      AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  updateTask: async (taskId, updatedTask) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      );
      AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  deleteTask: async (taskId) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== taskId);
      AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  loadTasks: async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) {
      set({ tasks: JSON.parse(storedTasks) });
    }
  },
})); 
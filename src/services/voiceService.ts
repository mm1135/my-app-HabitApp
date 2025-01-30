import * as Speech from 'expo-speech';
import Voice, { 
  SpeechResultsEvent,
  SpeechErrorEvent
} from '@react-native-voice/voice';
import { useTaskStore } from '../stores/taskStore';
import { Alert, Platform, Linking } from 'react-native';

export class VoiceService {
  private static instance: VoiceService;
  private isListening: boolean = false;
  private taskStore = useTaskStore.getState();

  private constructor() {
    this.initializeVoice();
  }

  static getInstance() {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  private initializeVoice() {
    Voice.onSpeechResults = this.handleSpeechResults;
    Voice.onSpeechError = this.handleSpeechError;
  }

  private async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const granted = await Voice.isAvailable();
        if (!granted) {
          Alert.alert(
            '権限が必要です',
            'マイクと音声認識の権限が必要です。設定から権限を許可してください。',
            [
              { text: 'キャンセル', style: 'cancel' },
              { text: '設定を開く', onPress: () => Linking.openSettings() }
            ]
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  async startListening(): Promise<void> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) return;

      this.isListening = true;
      await Voice.start('ja-JP');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      this.isListening = false;
      Alert.alert('エラー', '音声認識の開始に失敗しました');
    }
  }

  async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }

  async speak(text: string): Promise<void> {
    try {
      await Speech.speak(text, {
        language: 'ja-JP',
        rate: 0.8,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('Speech error:', error);
    }
  }

  private handleSpeechError = (e: SpeechErrorEvent) => {
    console.error('Speech recognition error:', e);
    Alert.alert('音声認識エラー', 'エラーが発生しました。もう一度お試しください。');
    this.isListening = false;
  };

  private handleSpeechResults = async (e: SpeechResultsEvent) => {
    try {
      const text = e.value?.[0];
      if (text) {
        console.log('Recognized text:', text);
        await this.processVoiceInput(text);
      }
    } catch (error) {
      console.error('Speech results processing error:', error);
      Alert.alert('エラー', '音声の処理中にエラーが発生しました');
    }
  };

  private async processVoiceInput(text: string) {
    const taskInfo = this.extractTaskInfo(text);
    if (taskInfo) {
      await this.createTask(taskInfo);
      await this.speak('タスクを追加しました');
    } else {
      await this.speak('タスクの内容を理解できませんでした');
    }
  }

  private extractTaskInfo(text: string) {
    // 簡単な日本語解析ロジック
    const whenMatch = text.match(/(今日|明日|明後日|(\d+)月(\d+)日)/) ?? ['今日'];
    const whereMatch = text.match(/(で|at|in)([^で]*?)(で|に|を|の|$)/) ?? ['', '', '未定'];
    const whatMatch = text.match(/(を|に)([^を]*?)(する|します|やる|やります|$)/) ?? ['', '', ''];

    if (whatMatch[2] || text) {  // textも許可して、単純な入力も受け付ける
      return {
        when: whenMatch[0],
        where: whereMatch[2].trim() || '未定',
        what: whatMatch[2].trim() || text,
        priority: 'medium' as const
      };
    }
    return null;
  }

  private async createTask(taskInfo: {
    when: string;
    where: string;
    what: string;
    priority: 'high' | 'medium' | 'low';
  }) {
    this.taskStore.addTask({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      when: taskInfo.when,
      where: taskInfo.where,
      what: taskInfo.what,
      priority: taskInfo.priority,
      isCompleted: false,
      reminder: {
        enabled: false,
        persistent: false,
        minutesBefore: 10,
      }
    });
  }
} 
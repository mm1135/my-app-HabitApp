export const timeSlots = [
  { label: '朝', value: '07:00', startTime: '06:00', endTime: '09:00' },
  { label: '午前', value: '10:00', startTime: '09:00', endTime: '12:00' },
  { label: '昼', value: '12:00', startTime: '12:00', endTime: '14:00' },
  { label: '午後', value: '15:00', startTime: '14:00', endTime: '17:00' },
  { label: '夕方', value: '17:00', startTime: '17:00', endTime: '19:00' },
  { label: '夜', value: '20:00', startTime: '19:00', endTime: '23:00' },
] as const;

export type TimeSlot = typeof timeSlots[number]; 
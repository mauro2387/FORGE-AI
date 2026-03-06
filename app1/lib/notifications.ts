/**
 * notifications.ts — Configuración de notificaciones locales
 * Recordatorios de check-in, foto semanal, entrenamiento
 * Dependencias: expo-notifications, config
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { CONFIG } from '@/constants/config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleCheckinNotification(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('checkin-diario').catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: 'checkin-diario',
    content: {
      title: 'FORGE — Check-in',
      body: 'Es hora de cerrar el día. ¿Cómo estuvo?',
      sound: 'default',
      data: { type: 'checkin' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: CONFIG.CHECKIN_HOUR,
      minute: CONFIG.CHECKIN_MINUTE,
    },
  });
}

export async function scheduleFotoSemanalNotification(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('foto-semanal').catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: 'foto-semanal',
    content: {
      title: 'FORGE — Foto semanal',
      body: 'Domingo de progreso. Sacate las fotos de esta semana.',
      sound: 'default',
      data: { type: 'foto-semanal' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // domingo
      hour: 9,
      minute: 0,
    },
  });
}

export async function scheduleWorkoutReminder(hora: number, minuto: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('workout-reminder').catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: 'workout-reminder',
    content: {
      title: 'FORGE — Entrenamiento',
      body: 'Hora de entrenar. No hay excusas.',
      sound: 'default',
      data: { type: 'workout' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hora,
      minute: minuto,
    },
  });
}

export async function sendInstantNotification(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: null,
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function setupAllNotifications(): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await scheduleCheckinNotification();
  await scheduleFotoSemanalNotification();
}

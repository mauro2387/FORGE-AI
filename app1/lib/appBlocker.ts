/**
 * appBlocker.ts — Lógica de bloqueo de apps (Android Accessibility Services)
 * Intercepta apps bloqueadas y muestra pantalla FORGE
 * Dependencias: user.types
 */

import { Platform, NativeModules } from 'react-native';
import type { AppBloqueo } from '@/types/user.types';

const isAndroid = Platform.OS === 'android';

export async function checkAccessibilityPermission(): Promise<boolean> {
  if (!isAndroid) return false;

  try {
    // Requiere módulo nativo personalizado
    // Se implementa con un AccessibilityService de Android
    return false;
  } catch {
    return false;
  }
}

export async function requestAccessibilityPermission(): Promise<void> {
  if (!isAndroid) return;

  try {
    // Abre la pantalla de configuración de accesibilidad de Android
    // NativeModules.AppBlocker.openAccessibilitySettings();
  } catch {
    // Sin módulo nativo disponible
  }
}

export function isAppBlockedNow(config: AppBloqueo): boolean {
  if (!config.activo) return false;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (!config.dias.includes(currentDay)) return false;

  return currentTime >= config.horario_inicio && currentTime <= config.horario_fin;
}

export function getTimeUntilUnblock(config: AppBloqueo): number {
  if (!isAppBlockedNow(config)) return 0;

  const now = new Date();
  const [hours, minutes] = config.horario_fin.split(':').map(Number);
  const unblockTime = new Date(now);
  unblockTime.setHours(hours, minutes, 0, 0);

  if (unblockTime <= now) {
    unblockTime.setDate(unblockTime.getDate() + 1);
  }

  return Math.max(0, unblockTime.getTime() - now.getTime());
}

export function formatBlockTimeRemaining(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export const APPS_POPULARES: Array<{ package_name: string; nombre: string; icono: string }> = [
  { package_name: 'com.instagram.android', nombre: 'Instagram', icono: '📷' },
  { package_name: 'com.zhiliaoapp.musically', nombre: 'TikTok', icono: '🎵' },
  { package_name: 'com.twitter.android', nombre: 'X (Twitter)', icono: '🐦' },
  { package_name: 'com.facebook.katana', nombre: 'Facebook', icono: '👤' },
  { package_name: 'com.snapchat.android', nombre: 'Snapchat', icono: '👻' },
  { package_name: 'com.google.android.youtube', nombre: 'YouTube', icono: '▶️' },
  { package_name: 'com.reddit.frontpage', nombre: 'Reddit', icono: '🤖' },
  { package_name: 'com.discord', nombre: 'Discord', icono: '💬' },
];

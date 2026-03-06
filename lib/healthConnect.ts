/**
 * healthConnect.ts — Integración con Health Connect API (Android)
 * Lee datos del Huawei Band 7: pasos, FC, sueño, calorías
 * Dependencias: user.types
 */

import { Platform } from 'react-native';
import type { BandData } from '@/types/user.types';

// Health Connect solo disponible en Android 14+ o con la app instalada
const isAndroid = Platform.OS === 'android';

interface HealthConnectPermission {
  recordType: string;
  accessType: 'read';
}

const REQUIRED_PERMISSIONS: HealthConnectPermission[] = [
  { recordType: 'Steps', accessType: 'read' },
  { recordType: 'HeartRate', accessType: 'read' },
  { recordType: 'SleepSession', accessType: 'read' },
  { recordType: 'ActiveCaloriesBurned', accessType: 'read' },
];

export async function checkHealthConnectAvailable(): Promise<boolean> {
  if (!isAndroid) return false;

  try {
    // En producción, usar react-native-health-connect
    // Por ahora retornamos false hasta que se instale el módulo nativo
    return false;
  } catch {
    return false;
  }
}

export async function requestHealthConnectPermissions(): Promise<boolean> {
  if (!isAndroid) return false;

  try {
    // Implementación real requiere react-native-health-connect
    // que necesita configuración nativa adicional
    return false;
  } catch {
    return false;
  }
}

export async function readBandData(fecha: string): Promise<BandData | null> {
  if (!isAndroid) return null;

  try {
    // Stub: en producción esto lee de Health Connect
    // Se completa cuando se configure el módulo nativo
    return null;
  } catch {
    return null;
  }
}

export async function readSteps(fecha: string): Promise<number> {
  const data = await readBandData(fecha);
  return data?.pasos ?? 0;
}

export async function readHeartRate(fecha: string): Promise<{ promedio: number; max: number }> {
  const data = await readBandData(fecha);
  return {
    promedio: data?.fc_promedio ?? 0,
    max: data?.fc_max ?? 0,
  };
}

export async function readSleep(fecha: string): Promise<{ total: number; profundo: number }> {
  const data = await readBandData(fecha);
  return {
    total: data?.sueno_horas ?? 0,
    profundo: data?.sueno_profundo_horas ?? 0,
  };
}

export { REQUIRED_PERMISSIONS };

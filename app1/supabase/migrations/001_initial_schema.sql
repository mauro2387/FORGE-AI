-- =====================================================
-- FORGE — Schema completo de base de datos
-- 001_initial_schema.sql
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- USUARIOS (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nombre TEXT,
  edad INTEGER,
  peso_actual DECIMAL(5,2),
  altura INTEGER,
  peso_objetivo DECIMAL(5,2),
  fase_actual TEXT DEFAULT 'FASE_1',
  semana_programa INTEGER DEFAULT 1,
  calorias_objetivo INTEGER,
  proteina_g INTEGER,
  carbos_g INTEGER,
  grasas_g INTEGER,
  analisis_fisico JSONB,
  primer_foto_path TEXT,
  tiene_gym BOOLEAN DEFAULT FALSE,
  onboarding_completo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLANES SEMANALES
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  semana_numero INTEGER NOT NULL,
  fecha_inicio DATE NOT NULL,
  plan JSONB NOT NULL,
  plan_comidas JSONB,
  analisis_semana_anterior JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOGS DE ENTRENAMIENTO
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  fecha DATE NOT NULL,
  plan_ejercicios JSONB NOT NULL,
  ejercicios_completados JSONB,
  duracion_min INTEGER,
  completado BOOLEAN DEFAULT FALSE,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERIES INDIVIDUALES
CREATE TABLE IF NOT EXISTS series_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  workout_log_id UUID REFERENCES workout_logs NOT NULL,
  fecha DATE NOT NULL,
  ejercicio_nombre TEXT NOT NULL,
  serie_numero INTEGER NOT NULL,
  reps_objetivo INTEGER,
  reps_hechas INTEGER,
  peso_objetivo DECIMAL(6,2),
  peso_usado DECIMAL(6,2),
  tiempo_seg INTEGER,
  completada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOGS DE HÁBITOS
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  fecha DATE NOT NULL,
  habito TEXT NOT NULL,
  completado BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, fecha, habito)
);

-- RACHAS DE ADICCIONES
CREATE TABLE IF NOT EXISTS addiction_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  tipo TEXT NOT NULL,
  fecha_inicio_racha DATE NOT NULL,
  racha_actual_dias INTEGER DEFAULT 0,
  mejor_racha_dias INTEGER DEFAULT 0,
  total_resets INTEGER DEFAULT 0,
  ultimo_reset DATE,
  UNIQUE(user_id, tipo)
);

-- CHECK-INS DIARIOS
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  fecha DATE NOT NULL,
  estado_dia TEXT,
  nota_numerica INTEGER,
  respuesta_usuario TEXT,
  feedback_ia TEXT,
  tarea_manana TEXT,
  UNIQUE(user_id, fecha)
);

-- LOGS DE NUTRICIÓN
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  fecha DATE NOT NULL,
  calorias_consumidas INTEGER DEFAULT 0,
  proteina_g DECIMAL(6,2) DEFAULT 0,
  carbos_g DECIMAL(6,2) DEFAULT 0,
  grasas_g DECIMAL(6,2) DEFAULT 0,
  comidas JSONB DEFAULT '[]',
  UNIQUE(user_id, fecha)
);

-- FOTOS DE PROGRESO
CREATE TABLE IF NOT EXISTS body_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  fecha DATE NOT NULL,
  tipo TEXT NOT NULL, -- BASELINE | SEMANAL
  storage_path TEXT NOT NULL,
  analisis_ia TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DATOS DEL BAND
CREATE TABLE IF NOT EXISTS band_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  fecha DATE NOT NULL,
  pasos INTEGER,
  calorias_activas INTEGER,
  fc_promedio INTEGER,
  fc_max INTEGER,
  sueno_horas DECIMAL(4,2),
  sueno_profundo_horas DECIMAL(4,2),
  UNIQUE(user_id, fecha)
);

-- CONFIGURACIÓN DE BLOQUEOS
CREATE TABLE IF NOT EXISTS app_block_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  app_package TEXT NOT NULL,
  app_nombre TEXT NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fin TIME NOT NULL,
  dias INTEGER[] NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

-- RECORDS DE FUERZA (Gym — Fase 4)
CREATE TABLE IF NOT EXISTS strength_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  ejercicio TEXT NOT NULL,
  fecha DATE NOT NULL,
  peso_kg DECIMAL(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  one_rm_estimado DECIMAL(6,2) NOT NULL
);

-- =====================================================
-- ROW LEVEL SECURITY — cada usuario solo ve sus datos
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE addiction_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_block_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE strength_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "users_own_profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "users_own_plans" ON weekly_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_workouts" ON workout_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_series" ON series_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_habits" ON habit_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_streaks" ON addiction_streaks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_checkins" ON daily_checkins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_nutrition" ON nutrition_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_photos" ON body_photos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_band" ON band_data
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_blocks" ON app_block_configs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_strength" ON strength_records
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- STORAGE — Bucket privado para fotos de progreso
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('body-photos', 'body-photos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "users_own_photos_storage" ON storage.objects
  FOR ALL USING (
    bucket_id = 'body-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- ÍNDICES para queries frecuentes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_workout_logs_user_fecha ON workout_logs(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_series_logs_workout ON series_logs(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_fecha ON habit_logs(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_fecha ON nutrition_logs(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_fecha ON daily_checkins(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_semana ON weekly_plans(user_id, semana_numero);
CREATE INDEX IF NOT EXISTS idx_band_data_user_fecha ON band_data(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_strength_records_user_ej ON strength_records(user_id, ejercicio);

// supabase/functions/forge-plan-semanal/index.ts
// Edge Function: Genera plan semanal con Claude basado en progreso del usuario

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.24.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'No autorizado', data: null, tokens_used: 0 }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { semana_numero } = await req.json();

    // Obtener perfil
    const { data: perfil } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Obtener plan anterior
    const { data: planAnterior } = await supabase
      .from('weekly_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('semana_numero', semana_numero - 1)
      .single();

    // Obtener workout logs de la semana anterior
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    const { data: workouts } = await supabase
      .from('workout_logs')
      .select('*, series_logs(*)')
      .eq('user_id', user.id)
      .gte('fecha', hace7Dias.toISOString().split('T')[0])
      .order('fecha', { ascending: true });

    // Check-ins de la semana
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('fecha', hace7Dias.toISOString().split('T')[0])
      .order('fecha', { ascending: true });

    // Rachas de adicciones
    const { data: rachas } = await supabase
      .from('addiction_streaks')
      .select('*')
      .eq('user_id', user.id);

    // Logs de hábitos de la semana
    const { data: habitLogs } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('fecha', hace7Dias.toISOString().split('T')[0]);

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const fase = determinarFase(semana_numero);

    const prompt = buildPlanPrompt({
      perfil,
      planAnterior,
      workouts,
      checkins,
      rachas,
      habitLogs,
      semana_numero,
      fase,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(responseText);

    // Guardar plan
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1);

    await supabase.from('weekly_plans').upsert({
      user_id: user.id,
      semana_numero,
      fecha_inicio: lunes.toISOString().split('T')[0],
      plan: parsed.plan,
      plan_comidas: parsed.plan_comidas,
      analisis_semana_anterior: parsed.analisis,
    });

    // Actualizar fase si cambió
    if (perfil.fase_actual !== fase) {
      await supabase
        .from('user_profiles')
        .update({ fase_actual: fase, semana_programa: semana_numero })
        .eq('id', user.id);
    } else {
      await supabase
        .from('user_profiles')
        .update({ semana_programa: semana_numero })
        .eq('id', user.id);
    }

    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    return new Response(
      JSON.stringify({ success: true, data: parsed, error: null, tokens_used: tokensUsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    return new Response(
      JSON.stringify({ success: false, error: message, data: null, tokens_used: 0 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

function determinarFase(semana: number): string {
  if (semana <= 4) return 'FASE_1';
  if (semana <= 8) return 'FASE_2';
  if (semana <= 12) return 'FASE_3';
  return 'FASE_4';
}

function buildPlanPrompt(ctx: Record<string, unknown>): string {
  const { perfil, planAnterior, workouts, checkins, rachas, habitLogs, semana_numero, fase } = ctx as {
    perfil: Record<string, unknown>;
    planAnterior: Record<string, unknown> | null;
    workouts: Record<string, unknown>[] | null;
    checkins: Record<string, unknown>[] | null;
    rachas: Record<string, unknown>[] | null;
    habitLogs: Record<string, unknown>[] | null;
    semana_numero: number;
    fase: string;
  };

  const faseDescripcion: Record<string, string> = {
    FASE_1: 'Reactivación (semanas 1-4): calistenia moderada, cardio base, establecer hábitos',
    FASE_2: 'Construcción (semanas 5-8): aumento de volumen/intensidad, HIIT, combate básico',
    FASE_3: 'Combate (semanas 9-12): intensidad alta, sparring ligero, preparación táctica',
    FASE_4: 'Mantenimiento Élite (semana 13+): programación avanzada, especialización',
  };

  return `Sos FORGE. Generá el plan para la SEMANA ${semana_numero} del programa.

FASE ACTUAL: ${fase} — ${faseDescripcion[fase]}

PERFIL:
- Nombre: ${perfil.nombre}, ${perfil.edad} años
- Peso: ${perfil.peso_actual}kg → objetivo ${perfil.peso_objetivo}kg
- Calorías objetivo: ${perfil.calorias_objetivo}
- Análisis: ${JSON.stringify(perfil.analisis_fisico)}

PLAN SEMANA ANTERIOR: ${planAnterior ? JSON.stringify(planAnterior.plan) : 'Primera semana'}

WORKOUTS COMPLETADOS ESTA SEMANA: ${JSON.stringify(workouts || [])}

CHECK-INS DIARIOS: ${JSON.stringify(checkins || [])}

RACHAS ADICCIONES: ${JSON.stringify(rachas || [])}

HÁBITOS CUMPLIDOS: ${habitLogs ? habitLogs.length : 0} logs esta semana

REGLAS:
- Nunca 2 días del mismo grupo muscular seguidos. Min 48h recuperación.
- Max 2 días intensos seguidos, después día moderado o descanso.
- Sábado = ruck/caminata con peso. Domingo = descanso activo.
- Progresión: aumentar volumen/intensidad 5-10% vs semana anterior si se completó >80%.
- Si el usuario completó poco (<50%), reducir volumen y reforzar motivación.
- Adaptar comidas a calorías objetivo del perfil.

Respondé SOLO con JSON válido:
{
  "analisis": { "cumplimiento_entrenamiento": 0, "cumplimiento_habitos": 0, "progreso_nota": "", "ajustes": [], "mensaje_motivacional": "" },
  "plan": { "lunes": { "tipo": "", "ubicacion": "", "ejercicios": [], "calentamiento": "", "enfriamiento": "", "duracion_estimada_min": 0 }, "martes": {}, "miercoles": {}, "jueves": {}, "viernes": {}, "sabado": {}, "domingo": {}, "mensaje_semana": "", "enfoque_semana": "", "notas_ia": "" },
  "plan_comidas": { "lunes": [], "martes": [], "miercoles": [], "jueves": [], "viernes": [], "sabado": [], "domingo": [] },
  "macros_ajustados": { "calorias_objetivo": 0, "proteina_g": 0, "carbos_g": 0, "grasas_g": 0 }
}`;
}

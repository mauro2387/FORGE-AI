// supabase/functions/forge-checkin/index.ts
// Edge Function: Procesa check-in diario del usuario con Claude

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

    const { checkin } = await req.json();
    const hoy = new Date().toISOString().split('T')[0];

    // Obtener contexto
    const [perfilRes, workoutRes, nutritionRes, habitRes, rachaRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('workout_logs').select('*').eq('user_id', user.id).eq('fecha', hoy).maybeSingle(),
      supabase.from('nutrition_logs').select('*').eq('user_id', user.id).eq('fecha', hoy).maybeSingle(),
      supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('fecha', hoy),
      supabase.from('addiction_streaks').select('*').eq('user_id', user.id),
    ]);

    const perfil = perfilRes.data;
    const workout = workoutRes.data;
    const nutrition = nutritionRes.data;
    const habitos = habitRes.data;
    const rachas = rachaRes.data;

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const prompt = buildCheckinPrompt({
      checkin,
      perfil,
      workout,
      nutrition,
      habitos,
      rachas,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(responseText);

    // Guardar check-in
    await supabase.from('daily_checkins').upsert({
      user_id: user.id,
      fecha: hoy,
      estado_animo: checkin.estado_animo,
      energia: checkin.energia,
      horas_sueno: checkin.horas_sueno,
      calidad_sueno: checkin.calidad_sueno,
      dolor_lesion: checkin.dolor_lesion,
      notas: checkin.notas,
      respuesta_ia: parsed,
    });

    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    return new Response(
      JSON.stringify({ success: true, data: parsed, error: null, tokens_used: tokensUsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error interno';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage, data: null, tokens_used: 0 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

function buildCheckinPrompt(ctx: Record<string, unknown>): string {
  const { checkin, perfil, workout, nutrition, habitos, rachas } = ctx as {
    checkin: Record<string, unknown>;
    perfil: Record<string, unknown>;
    workout: Record<string, unknown> | null;
    nutrition: Record<string, unknown> | null;
    habitos: Record<string, unknown>[] | null;
    rachas: Record<string, unknown>[] | null;
  };

  return `Sos FORGE. El usuario hace su check-in nocturno. Respondé como un instructor exigente pero justo.

CHECK-IN:
- Estado de ánimo: ${checkin.estado_animo}/10
- Energía: ${checkin.energia}/10
- Horas de sueño: ${checkin.horas_sueno}
- Calidad sueño: ${checkin.calidad_sueno}/10
- Dolor/lesión: ${checkin.dolor_lesion || 'Ninguno'}
- Notas: ${checkin.notas || 'Sin notas'}

CONTEXTO DEL DÍA:
- Workout completado: ${workout ? 'Sí (' + (workout as Record<string, unknown>).tipo + ', ' + (workout as Record<string, unknown>).duracion_min + ' min)' : 'No entrenó hoy'}
- Nutrición: ${nutrition ? 'Cal: ' + (nutrition as Record<string, unknown>).calorias_total + '/' + (perfil.calorias_objetivo) : 'Sin registro'}
- Hábitos completados: ${habitos ? habitos.length : 0}/8
- Rachas activas: ${rachas ? rachas.map((r: Record<string, unknown>) => r.tipo + ': ' + r.racha_actual_dias + ' días').join(', ') : 'Ninguna'}

- Semana programa: ${perfil.semana_programa}
- Fase: ${perfil.fase_actual}

Respondé SOLO con JSON válido:
{
  "mensaje": "Mensaje directo y personalizado del instructor (2-3 oraciones, tono militar motivacional)",
  "evaluacion_dia": { "nota": 0, "puntos_fuertes": [], "puntos_debiles": [] },
  "consejo_manana": "Un consejo concreto para mañana",
  "ajuste_necesario": null | "Descripción si hay que ajustar algo en el plan"
}`;
}

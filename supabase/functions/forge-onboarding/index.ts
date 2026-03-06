// supabase/functions/forge-onboarding/index.ts
// Edge Function: Analiza datos de onboarding con Claude y genera plan semana 1
// Se deploya con: supabase functions deploy forge-onboarding

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

    const { datos } = await req.json();

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const prompt = buildOnboardingPrompt(datos);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(responseText);

    // Guardar perfil
    await supabase.from('user_profiles').upsert({
      id: user.id,
      nombre: datos.nombre,
      edad: datos.edad,
      peso_actual: datos.peso_actual,
      altura: datos.altura,
      peso_objetivo: datos.peso_objetivo,
      fase_actual: 'FASE_1',
      semana_programa: 1,
      calorias_objetivo: parsed.macros.calorias_objetivo,
      proteina_g: parsed.macros.proteina_g,
      carbos_g: parsed.macros.carbos_g,
      grasas_g: parsed.macros.grasas_g,
      analisis_fisico: parsed.analisis_fisico,
    });

    // Guardar plan semana 1
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1);

    await supabase.from('weekly_plans').insert({
      user_id: user.id,
      semana_numero: 1,
      fecha_inicio: lunes.toISOString().split('T')[0],
      plan: parsed.plan_semana_1,
      plan_comidas: parsed.plan_comidas_semana_1,
    });

    // Iniciar rachas de adicciones
    if (datos.adicciones && datos.adicciones.length > 0) {
      const rachas = datos.adicciones.map((tipo: string) => ({
        user_id: user.id,
        tipo,
        fecha_inicio_racha: hoy.toISOString().split('T')[0],
        racha_actual_dias: 0,
        mejor_racha_dias: 0,
        total_resets: 0,
      }));
      await supabase.from('addiction_streaks').insert(rachas);
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

function buildOnboardingPrompt(datos: Record<string, unknown>): string {
  return `Sos FORGE, un sistema de entrenamiento militar-táctico personalizado.

DATOS DEL USUARIO:
- Nombre: ${datos.nombre}
- Edad: ${datos.edad} años
- Peso actual: ${datos.peso_actual}kg
- Altura: ${datos.altura}cm
- Peso objetivo: ${datos.peso_objetivo}kg

HISTORIAL: ${datos.historial_entrenamiento}
MESES INACTIVO: ${datos.meses_inactivo}

PRUEBAS FÍSICAS:
- Flexiones máximas: ${(datos.pruebas_fisicas as Record<string, number>).flexiones_max}
- Dominadas máximas: ${(datos.pruebas_fisicas as Record<string, number>).dominadas_max}
- 1km en: ${(datos.pruebas_fisicas as Record<string, number>).tiempo_1km_seg} seg
- Plancha: ${(datos.pruebas_fisicas as Record<string, number>).plancha_seg} seg
- Sentadillas: ${(datos.pruebas_fisicas as Record<string, number>).sentadillas_max}

ADICCIONES: ${(datos.adicciones as string[]).join(', ')}

Generá el análisis completo y plan de SEMANA 1 (FASE 1 — Reactivación).
Formato: calistenia + MCMAP/Systema drills sin sparring. Sábado=ruck. Domingo=descanso.
Nunca 2 días del mismo grupo muscular seguidos. Min 48h recuperación. Max 2 días intensos seguidos.

Respondé SOLO con JSON válido con esta estructura:
{
  "analisis_fisico": { "nivel_fitness": "", "fortalezas": [], "debilidades": [], "recomendaciones": [], "estimacion_grasa_corporal": 0, "plan_resumen": "" },
  "macros": { "calorias_objetivo": 0, "proteina_g": 0, "carbos_g": 0, "grasas_g": 0 },
  "plan_semana_1": { "lunes": { "tipo": "", "ubicacion": "", "ejercicios": [], "calentamiento": "", "enfriamiento": "", "duracion_estimada_min": 0 }, "martes": {}, "miercoles": {}, "jueves": {}, "viernes": {}, "sabado": {}, "domingo": {}, "mensaje_semana": "", "enfoque_semana": "", "notas_ia": "" },
  "plan_comidas_semana_1": { "lunes": [], "martes": [], "miercoles": [], "jueves": [], "viernes": [], "sabado": [], "domingo": [] },
  "habitos_recomendados": [],
  "mensaje_bienvenida": ""
}`;
}

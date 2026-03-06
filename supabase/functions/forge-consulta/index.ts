// supabase/functions/forge-consulta/index.ts
// Edge Function: Responde consultas libres del usuario vía Claude

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

    const { pregunta, contexto_adicional } = await req.json();

    // Obtener perfil
    const { data: perfil } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Obtener plan actual
    const { data: plan } = await supabase
      .from('weekly_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('semana_numero', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Últimos check-ins
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })
      .limit(3);

    // Rachas
    const { data: rachas } = await supabase
      .from('addiction_streaks')
      .select('*')
      .eq('user_id', user.id);

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const prompt = buildConsultaPrompt({
      pregunta,
      contexto_adicional,
      perfil,
      plan,
      checkins,
      rachas,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(responseText);

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

function buildConsultaPrompt(ctx: Record<string, unknown>): string {
  const { pregunta, contexto_adicional, perfil, plan, checkins, rachas } = ctx as {
    pregunta: string;
    contexto_adicional: string | null;
    perfil: Record<string, unknown>;
    plan: Record<string, unknown> | null;
    checkins: Record<string, unknown>[] | null;
    rachas: Record<string, unknown>[] | null;
  };

  return `Sos FORGE, instructor de transformación física y mental. El usuario te hace una consulta libre.
Tu tono es directo, militar, pero empático. Nunca das respuestas vagas. Siempre concreto y accionable.

PERFIL:
- ${perfil.nombre}, ${perfil.edad} años, ${perfil.peso_actual}kg
- Fase: ${perfil.fase_actual}, Semana: ${perfil.semana_programa}
- Calorías: ${perfil.calorias_objetivo}

PLAN ACTUAL: ${plan ? (plan.plan as Record<string, unknown>).enfoque_semana : 'Sin plan cargado'}

ÚLTIMOS CHECK-INS: ${checkins ? checkins.map((c: Record<string, unknown>) => c.fecha + ': ánimo ' + c.estado_animo + '/10, energía ' + c.energia + '/10').join(' | ') : 'Sin datos'}

RACHAS: ${rachas ? rachas.map((r: Record<string, unknown>) => r.tipo + ': ' + r.racha_actual_dias + 'd').join(', ') : 'Sin rachas'}

PREGUNTA: ${pregunta}
${contexto_adicional ? 'CONTEXTO ADICIONAL: ' + contexto_adicional : ''}

REGLAS:
- Si pregunta sobre ejercicios, incluí la técnica correcta.
- Si pregunta sobre nutrición, basate en sus macros.
- Si pregunta sobre lesiones, sé conservador y recomendá consulta médica si es grave.
- Si pregunta sobre disciplina/motivación, usá tono de instructor.
- Nunca recomiendes esteroides, suplementos ilegales, o prácticas peligrosas.

Respondé SOLO con JSON válido:
{
  "respuesta": "Tu respuesta completa (puede ser larga si es necesario)",
  "tipo": "entrenamiento|nutricion|motivacion|salud|general",
  "acciones_sugeridas": ["Acción concreta 1", "Acción concreta 2"],
  "modificar_plan": false
}`;
}

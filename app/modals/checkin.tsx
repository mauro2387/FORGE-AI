import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useForgeAI } from '@/hooks/useForgeAI';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

const ANIMO_OPTIONS = [
  { value: 1, emoji: '💀', label: 'Destruido' },
  { value: 3, emoji: '😐', label: 'Regular' },
  { value: 5, emoji: '😊', label: 'Bien' },
  { value: 7, emoji: '💪', label: 'Fuerte' },
  { value: 10, emoji: '🔥', label: 'Imparable' },
];

export default function CheckinModal() {
  const { checkin: enviarCheckin, loading: aiLoading, progress: aiProgress } = useForgeAI();

  const [estadoAnimo, setEstadoAnimo] = useState(5);
  const [energia, setEnergia] = useState(5);
  const [horasSueno, setHorasSueno] = useState('');
  const [calidadSueno, setCalidadSueno] = useState(5);
  const [dolorLesion, setDolorLesion] = useState('');
  const [notas, setNotas] = useState('');
  const [respuestaIA, setRespuestaIA] = useState<Record<string, unknown> | null>(null);

  async function handleSubmit() {
    const checkinData = {
      estado_animo: estadoAnimo,
      energia,
      horas_sueno: parseFloat(horasSueno) || 7,
      calidad_sueno: calidadSueno,
      dolor_lesion: dolorLesion || null,
      notas: notas || null,
    };

    const result = await enviarCheckin(checkinData as any);
    if (result) {
      setRespuestaIA(result as Record<string, unknown>);
    }
  }

  if (respuestaIA) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.bg }}
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      >
        <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent }}>
          REPORTE NOCTURNO
        </Text>

        <View style={{ marginTop: 24 }}>
          <Card>
            <Text style={{ fontFamily: FONTS.body, fontSize: 15, color: COLORS.text, lineHeight: 22 }}>
              {String(respuestaIA.mensaje ?? 'Check-in procesado.')}
            </Text>
          </Card>
        </View>

        {respuestaIA.evaluacion_dia ? (
          <View style={{ marginTop: 16 }}>
            <Card>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
                EVALUACIÓN
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 48,
                  color: COLORS.accent,
                  textAlign: 'center',
                  marginTop: 8,
                }}
              >
                {String((respuestaIA.evaluacion_dia as Record<string, unknown>)?.nota ?? '')}/10
              </Text>
            </Card>
          </View>
        ) : null}

        {respuestaIA.consejo_manana ? (
          <View style={{ marginTop: 16 }}>
            <Card>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
                PARA MAÑANA
              </Text>
              <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.text, marginTop: 4 }}>
                {String(respuestaIA.consejo_manana ?? '')}
              </Text>
            </Card>
          </View>
        ) : null}

        <View style={{ marginTop: 32 }}>
          <Button
            title="ENTENDIDO"
            variant="primary"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>
          ← CERRAR
        </Text>
      </Pressable>

      <Text
        style={{
          fontFamily: FONTS.title,
          fontSize: 32,
          color: COLORS.accent,
          marginTop: 16,
        }}
      >
        CHECK-IN NOCTURNO
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
        REPORTE DE FIN DE DÍA
      </Text>

      {/* Estado de ánimo */}
      <View style={{ marginTop: 32 }}>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
          ESTADO DE ÁNIMO
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          {ANIMO_OPTIONS.map((op) => (
            <Pressable
              key={op.value}
              onPress={() => setEstadoAnimo(op.value)}
              style={{
                alignItems: 'center',
                padding: 8,
                borderRadius: 10,
                backgroundColor: estadoAnimo === op.value ? '#0c0e12' : 'transparent',
                borderWidth: estadoAnimo === op.value ? 1 : 0,
                borderColor: COLORS.accent,
              }}
            >
              <Text style={{ fontSize: 24 }}>{op.emoji}</Text>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 8,
                  color: estadoAnimo === op.value ? COLORS.accent : COLORS.textB,
                  marginTop: 2,
                }}
              >
                {op.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Energía */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
          NIVEL DE ENERGÍA: {energia}/10
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <Pressable
              key={n}
              onPress={() => setEnergia(n)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: n <= energia ? COLORS.accent : '#0c0e12',
                borderWidth: n <= energia ? 0 : 1,
                borderColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  color: n <= energia ? '#060708' : COLORS.textB,
                }}
              >
                {n}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Sueño */}
      <View style={{ marginTop: 24, flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Input
            label="HORAS DE SUEÑO"
            value={horasSueno}
            onChangeText={setHorasSueno}
            placeholder="7.5"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, marginBottom: 6 }}>
            CALIDAD: {calidadSueno}/10
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <Pressable
                key={n}
                onPress={() => setCalidadSueno(n)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: n <= calidadSueno ? COLORS.olive : '#0c0e12',
                }}
              >
                <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.text }}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Dolor/lesión */}
      <View style={{ marginTop: 24 }}>
        <Input
          label="DOLOR O LESIÓN (opcional)"
          value={dolorLesion}
          onChangeText={setDolorLesion}
          placeholder="Describe si tenés algún dolor o molestia"
          multiline
        />
      </View>

      {/* Notas */}
      <View style={{ marginTop: 16 }}>
        <Input
          label="NOTAS (opcional)"
          value={notas}
          onChangeText={setNotas}
          placeholder="¿Algo que quieras registrar del día?"
          multiline
        />
      </View>

      {aiLoading && (
        <View style={{ marginTop: 24 }}>
          <ProgressBar progress={aiProgress} />
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: COLORS.textB,
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            FORGE está analizando tu día...
          </Text>
        </View>
      )}

      <View style={{ marginTop: 32, marginBottom: 32 }}>
        <Button
          title="ENVIAR REPORTE"
          variant="primary"
          loading={aiLoading}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
}

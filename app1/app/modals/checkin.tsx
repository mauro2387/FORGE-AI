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
        className="flex-1 bg-bg"
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      >
        <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent }}>
          REPORTE NOCTURNO
        </Text>

        <Card className="mt-6">
          <Text style={{ fontFamily: FONTS.body, fontSize: 15, color: COLORS.text, lineHeight: 22 }}>
            {String(respuestaIA.mensaje ?? 'Check-in procesado.')}
          </Text>
        </Card>

        {respuestaIA.evaluacion_dia ? (
          <Card className="mt-4">
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
        ) : null}

        {respuestaIA.consejo_manana ? (
          <Card className="mt-4">
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
              PARA MAÑANA
            </Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.text, marginTop: 4 }}>
              {String(respuestaIA.consejo_manana ?? '')}
            </Text>
          </Card>
        ) : null}

        <Button
          title="ENTENDIDO"
          variant="primary"
          onPress={() => router.back()}
          className="mt-8"
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
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
      <View className="mt-8">
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
          ESTADO DE ÁNIMO
        </Text>
        <View className="flex-row justify-between mt-3">
          {ANIMO_OPTIONS.map((op) => (
            <Pressable
              key={op.value}
              onPress={() => setEstadoAnimo(op.value)}
              className={`items-center p-2 rounded-lg ${
                estadoAnimo === op.value ? 'bg-bg2 border border-accent' : ''
              }`}
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
      <View className="mt-6">
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
          NIVEL DE ENERGÍA: {energia}/10
        </Text>
        <View className="flex-row justify-between mt-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <Pressable
              key={n}
              onPress={() => setEnergia(n)}
              className={`w-8 h-8 rounded items-center justify-center ${
                n <= energia ? 'bg-accent' : 'bg-bg2 border border-border'
              }`}
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
      <View className="mt-6 flex-row gap-3">
        <View className="flex-1">
          <Input
            label="HORAS DE SUEÑO"
            value={horasSueno}
            onChangeText={setHorasSueno}
            placeholder="7.5"
            keyboardType="decimal-pad"
          />
        </View>
        <View className="flex-1">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, marginBottom: 6 }}>
            CALIDAD: {calidadSueno}/10
          </Text>
          <View className="flex-row flex-wrap gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <Pressable
                key={n}
                onPress={() => setCalidadSueno(n)}
                className={`w-6 h-6 rounded items-center justify-center ${
                  n <= calidadSueno ? 'bg-olive' : 'bg-bg2'
                }`}
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
      <Input
        label="DOLOR O LESIÓN (opcional)"
        value={dolorLesion}
        onChangeText={setDolorLesion}
        placeholder="Describe si tenés algún dolor o molestia"
        multiline
        className="mt-6"
      />

      {/* Notas */}
      <Input
        label="NOTAS (opcional)"
        value={notas}
        onChangeText={setNotas}
        placeholder="¿Algo que quieras registrar del día?"
        multiline
        className="mt-4"
      />

      {aiLoading && (
        <View className="mt-6">
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

      <Button
        title="ENVIAR REPORTE"
        variant="primary"
        loading={aiLoading}
        onPress={handleSubmit}
        className="mt-8 mb-8"
      />
    </ScrollView>
  );
}

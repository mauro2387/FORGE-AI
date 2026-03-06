import { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useForgeAI } from '@/hooks/useForgeAI';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

type Mensaje = {
  role: 'user' | 'forge';
  content: string;
  acciones?: string[];
};

export default function ConsultaIAModal() {
  const { consulta, loading: aiLoading } = useForgeAI();
  const [pregunta, setPregunta] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  async function handleEnviar() {
    const q = pregunta.trim();
    if (!q || aiLoading) return;

    setMensajes((prev) => [...prev, { role: 'user', content: q }]);
    setPregunta('');

    const result = await consulta({ perfil_usuario: {}, pregunta: q, contexto: null });

    if (result) {
      setMensajes((prev) => [
        ...prev,
        {
          role: 'forge',
          content: result.respuesta || 'Sin respuesta.',
        },
      ]);
    } else {
      setMensajes((prev) => [
        ...prev,
        { role: 'forge', content: 'Error al procesar la consulta. Intentá de nuevo.' },
      ]);
    }

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>
            ← CERRAR
          </Text>
        </Pressable>
        <Text style={{ fontFamily: FONTS.title, fontSize: 20, color: COLORS.accent }}>
          CONSULTA FORGE
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {mensajes.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Text style={{ fontSize: 48 }}>⚒️</Text>
            <Text
              style={{
                fontFamily: FONTS.title,
                fontSize: 20,
                color: COLORS.accent,
                textAlign: 'center',
                marginTop: 12,
              }}
            >
              CONSULTÁ A FORGE
            </Text>
            <Text
              style={{
                fontFamily: FONTS.body,
                fontSize: 13,
                color: COLORS.textB,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              Preguntame sobre entrenamiento, nutrición, técnica, motivación, recuperación.
              FORGE tiene acceso a tu perfil, plan y progreso.
            </Text>

            <View style={{ gap: 8, marginTop: 24, width: '100%' }}>
              {[
                '¿Cómo mejoro mis dominadas?',
                '¿Qué como antes de entrenar?',
                'Me duele la rodilla al hacer sentadillas',
                '¿Cómo manejo la ansiedad?',
              ].map((sugerencia) => (
                <Pressable
                  key={sugerencia}
                  onPress={() => setPregunta(sugerencia)}
                  style={{ padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border }}
                >
                  <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textB }}>
                    {sugerencia}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {mensajes.map((msg, idx) => (
          <View
            key={idx}
            style={{ marginBottom: 16, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <View
              style={{
                maxWidth: '85%',
                padding: 12,
                borderRadius: 14,
                backgroundColor: msg.role === 'user' ? COLORS.accent : '#0c0e12',
                borderWidth: msg.role === 'user' ? 0 : 1,
                borderColor: COLORS.border,
                borderBottomRightRadius: msg.role === 'user' ? 0 : 14,
                borderBottomLeftRadius: msg.role === 'user' ? 14 : 0,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  color: msg.role === 'user' ? '#060708' : COLORS.text,
                  lineHeight: 20,
                }}
              >
                {msg.content}
              </Text>
            </View>

            {msg.acciones && msg.acciones.length > 0 && (
              <View style={{ marginTop: 8, gap: 4, maxWidth: '85%' }}>
                {msg.acciones.map((accion, aIdx) => (
                  <View key={aIdx} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
                    <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
                      →
                    </Text>
                    <Text style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.olive, flex: 1 }}>
                      {accion}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {aiLoading && (
          <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
            <View style={{ backgroundColor: '#0c0e12', borderWidth: 1, borderColor: COLORS.border, padding: 12, borderRadius: 14, borderBottomLeftRadius: 0, maxWidth: '85%' }}>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  color: COLORS.textB,
                  marginTop: 4,
                }}
              >
                FORGE está pensando...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}>
          <Input
            value={pregunta}
            onChangeText={setPregunta}
            placeholder="Escribí tu consulta..."
            multiline
            onSubmitEditing={handleEnviar}
          />
        </View>
        <Button
          title="→"
          variant="primary"
          disabled={!pregunta.trim() || aiLoading}
          onPress={handleEnviar}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

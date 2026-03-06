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
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3 border-b border-border">
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
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {mensajes.length === 0 && (
          <View className="items-center mt-12">
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

            <View className="gap-2 mt-6 w-full">
              {[
                '¿Cómo mejoro mis dominadas?',
                '¿Qué como antes de entrenar?',
                'Me duele la rodilla al hacer sentadillas',
                '¿Cómo manejo la ansiedad?',
              ].map((sugerencia) => (
                <Pressable
                  key={sugerencia}
                  onPress={() => setPregunta(sugerencia)}
                  className="p-3 rounded-lg border border-border"
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
            className={`mb-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[85%] p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-accent rounded-br-none'
                  : 'bg-bg2 border border-border rounded-bl-none'
              }`}
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
              <View className="mt-2 gap-1 max-w-[85%]">
                {msg.acciones.map((accion, aIdx) => (
                  <View key={aIdx} className="flex-row items-start gap-1">
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
          <View className="items-start mb-4">
            <View className="bg-bg2 border border-border p-3 rounded-xl rounded-bl-none max-w-[85%]">
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
      <View className="p-4 border-t border-border flex-row gap-2 items-end">
        <View className="flex-1">
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

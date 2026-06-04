import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('operator@aquaride.io');
  const [password, setPassword] = useState('demo1234');
  const [show, setShow] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.navy }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={{ paddingHorizontal: 26, paddingTop: 40, paddingBottom: 30 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: colors.aqua,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <MaterialCommunityIcons name="map-marker-radius" size={36} color={colors.white} />
              </View>
              <Text style={{ color: colors.white, fontSize: 28, fontWeight: '900' }}>Welcome back</Text>
              <Text style={{ color: colors.aquaPale, fontSize: 14, marginTop: 6 }}>
                Sign in to your AquaRide IoT fleet console
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.bg,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                padding: 26,
              }}
            >
              <Field
                label="Email"
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                placeholder="you@company.com"
                keyboardType="email-address"
              />
              <Field
                label="Password"
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secure={!show}
                rightIcon={show ? 'eye-off-outline' : 'eye-outline'}
                onRightPress={() => setShow((s) => !s)}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.greenBg,
                  padding: 12,
                  borderRadius: 12,
                  marginTop: 6,
                  marginBottom: 22,
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color={colors.green} />
                <Text style={{ color: colors.green, fontWeight: '700', fontSize: 13, marginLeft: 8 }}>
                  Demo account enabled
                </Text>
              </View>

              <Pressable
                onPress={() => router.replace('/(tabs)')}
                style={{
                  backgroundColor: colors.blue,
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>Login</Text>
              </Pressable>

              <Text style={{ color: colors.textMuted, fontSize: 12.5, textAlign: 'center', marginTop: 18 }}>
                For rental operators and fleet managers
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({
  label,
  icon,
  rightIcon,
  onRightPress,
  secure,
  ...props
}: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13, marginBottom: 8 }}>{label}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
        }}
      >
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <TextInput
          style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontSize: 15, color: colors.text }}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secure}
          autoCapitalize="none"
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightPress}>
            <Ionicons name={rightIcon} size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

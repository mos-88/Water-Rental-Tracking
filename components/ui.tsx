import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, shadow } from '../constants/theme';

export function StatCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View style={[{ flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 14, margin: 5 }, shadow]}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: tint + '22',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Ionicons name={icon} size={19} color={tint} />
      </View>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{value}</Text>
      <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export function Btn({
  label,
  icon,
  onPress,
  variant = 'primary',
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'soft';
}) {
  const styles = {
    primary: { bg: colors.blue, fg: colors.white, border: colors.blue },
    soft: { bg: colors.ice, fg: colors.blue, border: colors.ice },
    outline: { bg: 'transparent', fg: colors.blue, border: colors.blue },
    danger: { bg: colors.redBg, fg: colors.red, border: colors.redBg },
  }[variant];
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: styles.bg,
        borderColor: styles.border,
        borderWidth: 1.5,
        paddingVertical: 13,
        borderRadius: 14,
      }}
    >
      {icon && <Ionicons name={icon} size={17} color={styles.fg} style={{ marginRight: 7 }} />}
      <Text style={{ color: styles.fg, fontWeight: '700', fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ color: colors.textMuted, fontSize: 13.5 }}>{label}</Text>
      <Text style={{ color: valueColor || colors.text, fontSize: 13.5, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={{ marginBottom: 10, marginTop: 6 }}>
      <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text }}>{title}</Text>
      {sub ? <Text style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 2 }}>{sub}</Text> : null}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[{ backgroundColor: colors.card, borderRadius: 18, padding: 16 }, shadow, style]}>{children}</View>;
}

import React from 'react';
import { Text, View } from 'react-native';
import { statusStyle, severityStyle } from '../constants/theme';

export function StatusBadge({ label, type = 'status' }: { label: string; type?: 'status' | 'severity' }) {
  const s = type === 'severity' ? severityStyle(label) : statusStyle(label);
  return (
    <View
      style={{
        backgroundColor: s.bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
      }}
    >
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 4,
          backgroundColor: s.color,
          marginRight: 6,
        }}
      />
      <Text style={{ color: s.color, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

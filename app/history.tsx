import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MiniMap } from '../components/MiniMap';
import { StatusBadge } from '../components/StatusBadge';
import { Card, Row } from '../components/ui';
import { colors, shadow } from '../constants/theme';
import { useStore, type Trip } from '../data/store';

export default function History() {
  const router = useRouter();
  const { trips } = useStore();
  const [open, setOpen] = useState<Trip | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 12, paddingTop: 6 }}>
            <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={26} color={colors.white} />
            </Pressable>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800', marginLeft: 6 }}>Trip History</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Summary chart bars */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '800', color: colors.text, marginBottom: 14 }}>Distance · Last 4 Trips (mi)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 14 }}>
            {trips.map((t) => (
              <View key={t.id} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.blue, marginBottom: 4 }}>{t.distance}</Text>
                <View style={{ width: '70%', height: (t.distance / 4) * 64 + 8, backgroundColor: colors.aqua, borderRadius: 6 }} />
                <Text style={{ fontSize: 9, color: colors.textMuted, marginTop: 6 }}>{t.bikeName.split(' ')[2]}</Text>
              </View>
            ))}
          </View>
        </Card>

        {trips.map((t) => (
          <Pressable key={t.id} onPress={() => setOpen(open?.id === t.id ? null : t)} style={{ marginBottom: 12 }}>
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: colors.ice, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <MaterialCommunityIcons name="bike-fast" size={22} color={colors.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', fontSize: 15, color: colors.text }}>{t.bikeName}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12.5 }}>{t.date}</Text>
                </View>
                <StatusBadge label={t.status} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                <Stat icon="time-outline" label="Duration" value={`${t.duration}m`} />
                <Stat icon="navigate-outline" label="Distance" value={`${t.distance} mi`} />
                <Stat icon="speedometer-outline" label="Max Speed" value={`${t.maxSpeed}`} />
                <View style={{ alignSelf: 'center' }}>
                  <Ionicons name={open?.id === t.id ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
                </View>
              </View>

              {open?.id === t.id && (
                <View style={{ marginTop: 14, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ marginVertical: 12 }}>
                    <MiniMap height={130} radius={14} markers={[{ x: 0.2, y: 0.7, active: false }, { x: 0.7, y: 0.3, active: true }]} />
                  </View>
                  <Row label="Start Location" value={t.startLocation} />
                  <Row label="End Location" value={t.endLocation} />
                  <Row label="Total Distance" value={`${t.distance} mi`} />
                  <Row label="Average Speed" value={`${t.avgSpeed} mph`} />
                  <Row label="Cellular Stability" value={t.cellStability} valueColor={colors.green} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 11 }}>
                    <Text style={{ color: colors.textMuted, fontSize: 13.5 }}>GPS Accuracy</Text>
                    <Text style={{ color: colors.text, fontSize: 13.5, fontWeight: '700' }}>{t.gpsAccuracy}</Text>
                  </View>
                </View>
              )}
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function Stat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={13} color={colors.textMuted} />
        <Text style={{ color: colors.textMuted, fontSize: 11, marginLeft: 3 }}>{label}</Text>
      </View>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

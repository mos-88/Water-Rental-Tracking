import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BikeCard } from '../../components/BikeCard';
import { MiniMap } from '../../components/MiniMap';
import { SectionTitle, StatCard } from '../../components/ui';
import { colors } from '../../constants/theme';
import { useStore } from '../../data/store';

export default function Dashboard() {
  const router = useRouter();
  const { bikes, rentals, alerts } = useStore();
  const active = rentals.filter((r) => r.status === 'Active').length;
  const available = bikes.filter((b) => b.status === 'Available').length;
  const openAlerts = alerts.filter((a) => !a.resolved).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 18, paddingTop: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: colors.aquaPale, fontSize: 13 }}>Fleet Console</Text>
                <Text style={{ color: colors.white, fontSize: 24, fontWeight: '900' }}>Dashboard</Text>
              </View>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="person" size={20} color={colors.white} />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <StatCard icon="bicycle-outline" label="Total Bikes" value="2" tint={colors.blue} />
          <StatCard icon="navigate-outline" label="Active Rentals" value={`${active}`} tint={colors.blueBadge} />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <StatCard icon="checkmark-circle-outline" label="Available" value={`${available}`} tint={colors.green} />
          <StatCard icon="warning-outline" label="Alerts" value={`${openAlerts}`} tint={colors.orange} />
        </View>

        <SectionTitle title="Live Fleet Map" sub="Real-time GPS positions" />
        <Pressable onPress={() => router.push('/(tabs)/map')}>
          <MiniMap height={190} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginBottom: 18,
            }}
          >
            <Ionicons name="expand-outline" size={15} color={colors.blue} />
            <Text style={{ color: colors.blue, fontWeight: '700', marginLeft: 6, fontSize: 13 }}>
              Open Live Map Tracking
            </Text>
          </View>
        </Pressable>

        <SectionTitle title="Water Bikes" sub="Connected IoT devices" />
        {bikes.map((b) => (
          <BikeCard key={b.id} bike={b} />
        ))}
      </ScrollView>
    </View>
  );
}

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '../../components/StatusBadge';
import { Card, SectionTitle } from '../../components/ui';
import { colors, shadow } from '../../constants/theme';
import { useStore } from '../../data/store';

export default function Rentals() {
  const router = useRouter();
  const { rentals, bikes } = useStore();
  const activeRentals = rentals.filter((r) => r.status === 'Active');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 18, paddingTop: 6 }}>
            <Text style={{ color: colors.aquaPale, fontSize: 13 }}>Operations</Text>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: '900' }}>Rentals</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <Pressable
            onPress={() => router.push('/rental-start')}
            style={{ flex: 1, backgroundColor: colors.blue, borderRadius: 18, padding: 16, ...shadow }}
          >
            <MaterialCommunityIcons name="play-circle" size={26} color={colors.white} />
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 15, marginTop: 8 }}>Start Rental</Text>
            <Text style={{ color: colors.ice, fontSize: 11.5, marginTop: 2 }}>New customer ride</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/history')}
            style={{ flex: 1, backgroundColor: colors.card, borderRadius: 18, padding: 16, ...shadow }}
          >
            <MaterialCommunityIcons name="history" size={26} color={colors.blue} />
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 15, marginTop: 8 }}>Trip History</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>Past trips & logs</Text>
          </Pressable>
        </View>

        <SectionTitle title="Active Rentals" sub={`${activeRentals.length} ride(s) in progress`} />
        {activeRentals.length === 0 && (
          <Card>
            <Text style={{ color: colors.textMuted, textAlign: 'center' }}>No active rentals right now.</Text>
          </Card>
        )}
        {activeRentals.map((r) => {
          const bike = bikes.find((b) => b.id === r.bikeId);
          return (
            <Pressable key={r.id} onPress={() => router.push('/active-rental')} style={{ marginBottom: 12 }}>
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: colors.blueBadgeBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="navigate" size={22} color={colors.blueBadge} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>{r.id}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12.5 }}>
                      {r.customerName} · {bike?.name}
                    </Text>
                  </View>
                  <StatusBadge label="In Rental" />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Mini label="Start" value={r.startTime} />
                  <Mini label="Duration" value={`${r.duration}m`} />
                  <Mini label="Distance" value={`${bike?.distanceToday} mi`} />
                  <Mini label="Speed" value={`${bike?.speed} mph`} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green, marginRight: 6 }} />
                  <Text style={{ color: colors.green, fontSize: 12, fontWeight: '700' }}>Live GPS tracking active</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
                </View>
              </Card>
            </Pressable>
          );
        })}

        <SectionTitle title="Recent" sub="Completed rentals" />
        {rentals
          .filter((r) => r.status === 'Completed')
          .map((r) => (
            <Card key={r.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={20} color={colors.green} style={{ marginRight: 10 }} />
                <Text style={{ flex: 1, fontWeight: '700', color: colors.text }}>{r.id}</Text>
                <StatusBadge label="Completed" />
              </View>
            </Card>
          ))}
      </ScrollView>
    </View>
  );
}

function Mini({ label, value }: { label: string; value?: string }) {
  return (
    <View>
      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14, marginTop: 1 }}>{value}</Text>
    </View>
  );
}

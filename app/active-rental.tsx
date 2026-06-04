import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert as RNAlert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MiniMap } from '../components/MiniMap';
import { Btn, Card, Row } from '../components/ui';
import { colors } from '../constants/theme';
import { useStore } from '../data/store';

export default function ActiveRental() {
  const router = useRouter();
  const { rentals, bikes, endRental } = useStore();
  const rental = rentals.find((r) => r.status === 'Active');
  const bike = bikes.find((b) => b.id === rental?.bikeId);

  if (!rental || !bike) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Ionicons name="boat-outline" size={56} color={colors.textMuted} />
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 16 }}>No Active Rental</Text>
          <Text style={{ color: colors.textMuted, marginTop: 6, textAlign: 'center' }}>Start a new rental to begin live tracking.</Text>
          <View style={{ marginTop: 24, width: '100%' }}>
            <Btn label="Start a Rental" icon="play" onPress={() => router.replace('/rental-start')} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 12, paddingTop: 6 }}>
            <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={26} color={colors.white} />
            </Pressable>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800', marginLeft: 6 }}>Active Rental</Text>
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34,197,94,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green, marginRight: 6 }} />
              <Text style={{ color: '#86EFAC', fontSize: 12, fontWeight: '700' }}>LIVE</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <MiniMap height={200} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 16 }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green, marginRight: 6 }} />
          <Text style={{ color: colors.green, fontWeight: '700', fontSize: 13 }}>Live GPS tracking active · updated {bike.lastUpdate}s ago</Text>
        </View>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: colors.text }}>{rental.id}</Text>
            <View style={{ marginLeft: 'auto', backgroundColor: colors.blueBadgeBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ color: colors.blueBadge, fontWeight: '700', fontSize: 12 }}>{bike.name}</Text>
            </View>
          </View>
          <Row label="Rider" value={rental.customerName} />
          <Row label="Start Time" value={rental.startTime} />
          <Row label="Duration Booked" value={`${rental.duration} min`} />
          <Row label="Current Location" value={bike.locationName} />
          <Row label="Distance Travelled" value={`${bike.distanceToday} mi`} />
          <Row label="Current Speed" value={`${bike.speed} mph`} />
          <Row label="Est. Return Time" value="2:38 PM" />
          <Row label="Payment" value={rental.paymentStatus} valueColor={colors.green} />
        </Card>

        <Pressable
          onPress={() => router.push('/rider')}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.navy, borderRadius: 16, padding: 14, marginBottom: 16 }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Ionicons name="phone-portrait-outline" size={22} color={colors.aquaLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 14.5 }}>Open Rider View</Text>
            <Text style={{ color: colors.aquaPale, fontSize: 12 }}>Hand phone to customer · countdown & help</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.aquaPale} />
        </Pressable>

        <View style={{ gap: 10 }}>
          <Btn
            label="End Rental"
            icon="stop"
            onPress={() => {
              endRental(rental.id);
              RNAlert.alert('Rental Ended', 'Trip saved to history. Bike returned to dock.', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/rentals') },
              ]);
            }}
          />
          <Btn
            label="Contact Rider"
            icon="call"
            variant="soft"
            onPress={() => RNAlert.alert('Contact Rider', `Calling ${rental.customerName}\n${rental.phone}`)}
          />
          <Btn
            label="Emergency Stop / Disable"
            icon="warning"
            variant="danger"
            onPress={() =>
              RNAlert.alert('Emergency Stop', 'This will remotely disable the motor and send an alert to the rider. Continue?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Disable', style: 'destructive' },
              ])
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

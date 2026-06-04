import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert as RNAlert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '../../components/StatusBadge';
import { Btn, Card, Row, SectionTitle } from '../../components/ui';
import { colors, shadow } from '../../constants/theme';
import { useStore } from '../../data/store';

const BIKE_IMG = 'https://d64gsuwffb70l.cloudfront.net/6a21ec5dfac5562c450b83ab_1780608235892_4df7d36c.jpg';

export default function BikeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { bikes, alerts, pingBike, endRental } = useStore();
  const bike = bikes.find((b) => b.id === id);
  const [locked, setLocked] = useState(false);

  if (!bike) return null;
  const bikeAlerts = alerts.filter((a) => a.bikeId === bike.id && !a.resolved);
  const battColor = bike.battery > 50 ? colors.green : bike.battery > 25 ? colors.orange : colors.red;

  const health = [
    { icon: 'map-marker-radius', label: 'GPS Module', value: 'Active', ok: true },
    { icon: 'signal', label: 'Cellular Modem', value: 'Connected', ok: true },
    { icon: 'sim', label: 'SIM Status', value: 'Active', ok: true },
    { icon: 'battery-70', label: 'Device Battery', value: `${bike.battery}%`, ok: bike.battery > 25 },
    { icon: 'water-check', label: 'Waterproof Enclosure', value: 'OK', ok: true },
    { icon: 'chip', label: 'Firmware', value: bike.firmwareVersion, ok: true },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 10, paddingTop: 6 }}>
            <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={26} color={colors.white} />
            </Pressable>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800', marginLeft: 6 }}>{bike.name}</Text>
            <View style={{ marginLeft: 'auto' }}>
              <StatusBadge label={bike.status} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Hero image + online indicator */}
        <View style={[{ borderRadius: 20, overflow: 'hidden', backgroundColor: colors.ice, marginBottom: 16 }, shadow]}>
          <Image source={{ uri: BIKE_IMG }} style={{ width: '100%', height: 160 }} contentFit="cover" />
          <View style={{ position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(2,43,78,0.85)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: 6 }} />
            <Text style={{ color: colors.white, fontSize: 12, fontWeight: '700' }}>Online · Heartbeat {bike.lastUpdate}s ago</Text>
          </View>
        </View>

        <SectionTitle title="Bike Status" />
        <Card style={{ marginBottom: 16 }}>
          <Row label="GPS Coordinates" value={`${bike.latitude.toFixed(4)}, ${bike.longitude.toFixed(4)}`} />
          <Row label="Cellular Network" value={bike.cellularStatus} valueColor={colors.green} />
          <Row label="Signal Strength" value={bike.signalStrength} />
          <Row label="Battery Level" value={`${bike.battery}%`} valueColor={battColor} />
          <Row label="Current Speed" value={`${bike.speed} mph`} />
          <Row label="Trip Distance Today" value={`${bike.distanceToday} mi`} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 11 }}>
            <Text style={{ color: colors.textMuted, fontSize: 13.5 }}>Total Ride Time Today</Text>
            <Text style={{ color: colors.text, fontSize: 13.5, fontWeight: '700' }}>{bike.rideTimeToday} min</Text>
          </View>
        </Card>

        <SectionTitle title="IoT Device Health" sub={`Last sync ${bike.lastUpdate}s ago`} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5, marginBottom: 12 }}>
          {health.map((h) => (
            <View key={h.label} style={{ width: '50%', padding: 5 }}>
              <View style={[{ backgroundColor: colors.card, borderRadius: 14, padding: 12 }, shadow]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <MaterialCommunityIcons name={h.icon as any} size={20} color={colors.blue} />
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: h.ok ? colors.green : colors.orange }} />
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 11.5 }}>{h.label}</Text>
                <Text style={{ color: colors.text, fontWeight: '800', fontSize: 14, marginTop: 1 }}>{h.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {bikeAlerts.length > 0 && (
          <>
            <SectionTitle title="Alerts" />
            {bikeAlerts.map((a) => (
              <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.orangeBg, padding: 14, borderRadius: 14, marginBottom: 16 }}>
                <Ionicons name="warning" size={22} color={colors.orange} style={{ marginRight: 10 }} />
                <Text style={{ flex: 1, color: colors.orange, fontWeight: '600', fontSize: 13.5 }}>{a.message}</Text>
              </View>
            ))}
          </>
        )}

        <SectionTitle title="Rental Controls" />
        <View style={{ gap: 10 }}>
          {bike.status === 'Available' ? (
            <Btn label="Start Rental" icon="play" onPress={() => router.push('/rental-start')} />
          ) : (
            <Btn
              label="End Rental"
              icon="stop"
              variant="danger"
              onPress={() => {
                if (bike.rentalId) endRental(bike.rentalId);
                RNAlert.alert('Rental Ended', 'GPS tracking stopped. Bike returned to dock.');
              }}
            />
          )}
          <Btn
            label={locked ? 'Unlock / Enable Bike' : 'Lock / Disable Bike'}
            icon={locked ? 'lock-open' : 'lock-closed'}
            variant="outline"
            onPress={() => setLocked((l) => !l)}
          />
          <Btn
            label="Send Locate Ping"
            icon="locate"
            variant="soft"
            onPress={() => {
              pingBike(bike.id);
              RNAlert.alert('Locate Ping Sent', 'Device responded. Heartbeat refreshed.');
            }}
          />
          <Btn
            label="Report Maintenance"
            icon="construct"
            variant="outline"
            onPress={() => RNAlert.alert('Maintenance Reported', 'A maintenance ticket has been created for this device.')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

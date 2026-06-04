import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert as RNAlert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MiniMap } from '../components/MiniMap';
import { colors, shadow } from '../constants/theme';
import { useStore } from '../data/store';

function fmt(sec: number) {
  if (sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function RiderMode() {
  const router = useRouter();
  const { rentals, bikes, endRental } = useStore();
  const rental = rentals.find((r) => r.status === 'Active');
  const bike = bikes.find((b) => b.id === rental?.bikeId);

  const [now, setNow] = useState(Date.now());
  const [help, setHelp] = useState(false);
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // No active ride
  if (!rental || !bike) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy }}>
        <SafeAreaView style={{ flex: 1, padding: 26, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="bike-fast" size={64} color={colors.aquaLight} />
          <Text style={{ color: colors.white, fontSize: 22, fontWeight: '800', marginTop: 18 }}>No Active Ride</Text>
          <Text style={{ color: colors.aquaPale, textAlign: 'center', marginTop: 8 }}>
            Your ride hasn’t started yet. Ask the dock operator to start your rental.
          </Text>
          <Pressable
            onPress={() => router.replace('/')}
            style={{ marginTop: 28, backgroundColor: colors.aqua, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 }}
          >
            <Text style={{ color: colors.white, fontWeight: '800' }}>Back to Home</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  const endsAt = rental.startedAt + rental.duration * 60 * 1000;
  const remainingSec = Math.round((endsAt - now) / 1000);
  const overtime = remainingSec <= 0;
  const totalSec = rental.duration * 60;
  const pct = Math.max(0, Math.min(1, remainingSec / totalSec));

  // Ride completed view
  if (ended) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy }}>
        <SafeAreaView style={{ flex: 1, padding: 26, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(34,197,94,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
            <Ionicons name="checkmark" size={58} color="#86EFAC" />
          </View>
          <Text style={{ color: colors.white, fontSize: 26, fontWeight: '900' }}>Ride Ended</Text>
          <Text style={{ color: colors.aquaPale, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
            Thanks for riding with AquaRide!{'\n'}Your bike has been returned to the dock.
          </Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, marginTop: 26, width: '100%' }}>
            <RiderRow label="Rental ID" value={rental.id} />
            <RiderRow label="Distance" value={`${bike.distanceToday} mi`} />
            <RiderRow label="Ride time" value={`${rental.duration - Math.max(0, Math.round(remainingSec / 60))} min`} />
            <RiderRow label="Returned to" value="Dock Station" last />
          </View>
          <Pressable
            onPress={() => router.replace('/')}
            style={{ marginTop: 28, backgroundColor: colors.aqua, paddingHorizontal: 36, paddingVertical: 15, borderRadius: 14 }}
          >
            <Text style={{ color: colors.white, fontWeight: '800' }}>Done</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.navy }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: colors.aqua, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="map-marker-radius" size={20} color={colors.white} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: '800' }}>My Ride</Text>
            <Text style={{ color: colors.aquaPale, fontSize: 12 }}>Hi {rental.customerName.split(' ')[0]} · {bike.name}</Text>
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34,197,94,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green, marginRight: 6 }} />
            <Text style={{ color: '#86EFAC', fontSize: 11.5, fontWeight: '700' }}>GPS LIVE</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
          {/* Countdown card */}
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <Text style={{ color: colors.aquaPale, fontSize: 13, fontWeight: '600' }}>
              {overtime ? 'OVERTIME' : 'TIME REMAINING'}
            </Text>
            <Text style={{ color: overtime ? '#FCA5A5' : colors.white, fontSize: 64, fontWeight: '900', letterSpacing: 1, marginVertical: 4 }}>
              {fmt(Math.abs(remainingSec))}
            </Text>
            {/* progress bar */}
            <View style={{ width: '80%', height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
              <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: overtime ? colors.red : colors.aquaLight }} />
            </View>
            <Text style={{ color: colors.aquaPale, fontSize: 12, marginTop: 8 }}>
              {rental.duration} min rental · started {rental.startTime}
            </Text>
          </View>

          {/* Live map */}
          <View style={[{ borderRadius: 20, overflow: 'hidden', marginBottom: 16 }, shadow]}>
            <MiniMap height={220} radius={20} markers={[{ x: 0.46, y: 0.4, active: true }]} showGeofence showRoute />
            <View style={{ position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(2,43,78,0.85)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14 }}>
              <Ionicons name="location" size={15} color={colors.aquaLight} />
              <Text style={{ color: colors.white, fontWeight: '700', fontSize: 12.5, marginLeft: 6 }}>{bike.locationName}</Text>
            </View>
          </View>

          {/* Stat tiles */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <RiderTile icon="speedometer" label="Current Speed" value={`${bike.speed}`} unit="mph" />
            <RiderTile icon="map-marker-distance" label="Distance" value={`${bike.distanceToday}`} unit="mi" />
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 22 }}>
            <RiderTile icon="battery-70" label="Bike Battery" value={`${bike.battery}`} unit="%" />
            <RiderTile icon="signal" label="Signal" value={bike.signalStrength} unit="" />
          </View>

          {/* Request help */}
          <Pressable
            onPress={() => setHelp(true)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1.5, borderColor: colors.aquaLight, paddingVertical: 16, borderRadius: 16, marginBottom: 12 }}
          >
            <Ionicons name="help-buoy" size={22} color={colors.aquaLight} style={{ marginRight: 10 }} />
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>Request Help</Text>
          </Pressable>

          {/* End my ride */}
          <Pressable
            onPress={() => setEnding(true)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.aqua, paddingVertical: 17, borderRadius: 16 }}
          >
            <Ionicons name="flag" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>End My Ride</Text>
          </Pressable>
          <Text style={{ color: colors.aquaPale, fontSize: 12, textAlign: 'center', marginTop: 12 }}>
            Return to the dock zone before ending your ride.
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* Request Help modal */}
      <Modal transparent visible={help} animationType="fade" onRequestClose={() => setHelp(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 6 }}>
              <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 16 }} />
              <Ionicons name="help-buoy" size={40} color={colors.blue} />
              <Text style={{ fontSize: 20, fontWeight: '900', color: colors.text, marginTop: 12 }}>Need a hand?</Text>
              <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 6 }}>
                Choose how we can help. The dock team can see your live GPS location.
              </Text>
            </View>
            {[
              { icon: 'call', label: 'Call Dock Operator', msg: 'Connecting you to the dock operator at (555) 911...' },
              { icon: 'construct', label: 'Report a Bike Problem', msg: 'Our team has been notified about a bike issue and will assist you.' },
              { icon: 'warning', label: 'Emergency / SOS', msg: 'SOS sent! Help is on the way to your GPS location. Stay where you are.' },
            ].map((o) => (
              <Pressable
                key={o.label}
                onPress={() => {
                  setHelp(false);
                  RNAlert.alert('Help Requested', o.msg);
                }}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, padding: 15, borderRadius: 14, marginTop: 12 }}
              >
                <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: o.icon === 'warning' ? colors.redBg : colors.ice, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name={o.icon as any} size={20} color={o.icon === 'warning' ? colors.red : colors.blue} />
                </View>
                <Text style={{ flex: 1, fontWeight: '700', color: colors.text }}>{o.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
            <Pressable onPress={() => setHelp(false)} style={{ marginTop: 16, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted, fontWeight: '700' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* End Ride confirm modal */}
      <Modal transparent visible={ending} animationType="fade" onRequestClose={() => setEnding(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 26 }}>
          <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.ice, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="flag" size={30} color={colors.blue} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '900', color: colors.text, marginTop: 14 }}>End your ride?</Text>
              <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 6 }}>
                This stops GPS tracking and returns {bike.name} to the dock. You can’t undo this.
              </Text>
            </View>
            <View style={{ backgroundColor: colors.bg, borderRadius: 14, padding: 14, marginBottom: 16 }}>
              <RiderRowDark label="Speed" value={`${bike.speed} mph`} />
              <RiderRowDark label="Distance this ride" value={`${bike.distanceToday} mi`} />
              <RiderRowDark label="Time used" value={`${rental.duration - Math.max(0, Math.round(remainingSec / 60))} min`} last />
            </View>
            <Pressable
              onPress={() => {
                endRental(rental.id);
                setEnding(false);
                setEnded(true);
              }}
              style={{ backgroundColor: colors.blue, paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginBottom: 10 }}
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 15 }}>End Ride & Return Bike</Text>
            </Pressable>
            <Pressable onPress={() => setEnding(false)} style={{ paddingVertical: 13, alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted, fontWeight: '700' }}>Keep Riding</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function RiderTile({ icon, label, value, unit }: { icon: string; label: string; value: string; unit: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 16 }}>
      <MaterialCommunityIcons name={icon as any} size={22} color={colors.aquaLight} />
      <Text style={{ color: colors.aquaPale, fontSize: 12, marginTop: 10 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 2 }}>
        <Text style={{ color: colors.white, fontSize: 24, fontWeight: '900' }}>{value}</Text>
        {unit ? <Text style={{ color: colors.aquaPale, fontSize: 13, fontWeight: '700', marginLeft: 4, marginBottom: 3 }}>{unit}</Text> : null}
      </View>
    </View>
  );
}

function RiderRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: last ? 0 : 1, borderBottomColor: 'rgba(255,255,255,0.12)' }}>
      <Text style={{ color: colors.aquaPale, fontSize: 13.5 }}>{label}</Text>
      <Text style={{ color: colors.white, fontSize: 13.5, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

function RiderRowDark({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textMuted, fontSize: 13.5 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 13.5, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

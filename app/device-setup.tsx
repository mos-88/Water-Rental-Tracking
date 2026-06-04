import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card } from '../components/ui';
import { colors, shadow } from '../constants/theme';

const STEPS = [
  { icon: 'tools', label: 'Install GPS + cellular tracker on water bike' },
  { icon: 'sim', label: 'Insert SIM card' },
  { icon: 'power', label: 'Power on IoT device' },
  { icon: 'qrcode-scan', label: 'Scan QR code or enter Device ID' },
  { icon: 'map-marker-radius', label: 'Confirm GPS signal' },
  { icon: 'signal', label: 'Confirm cellular connection' },
  { icon: 'bike-fast', label: 'Assign device to a Water Bike' },
];

const STATUS = [
  { label: 'GPS detected', icon: 'map-marker-check' },
  { label: 'LTE connected', icon: 'signal' },
  { label: 'Device heartbeat received', icon: 'heart-pulse' },
  { label: 'Ready for rental tracking', icon: 'check-decagram' },
];

export default function DeviceSetup() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [assigned, setAssigned] = useState<string | null>(null);

  useEffect(() => {
    if (!scanning) return;
    if (progress >= STATUS.length) return;
    const t = setTimeout(() => setProgress((p) => p + 1), 900);
    return () => clearTimeout(t);
  }, [scanning, progress]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 12, paddingTop: 6 }}>
            <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={26} color={colors.white} />
            </Pressable>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800', marginLeft: 6 }}>Add Water Bike Device</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Device ID + QR */}
        <Card style={{ marginBottom: 16, alignItems: 'center' }}>
          <View style={{ width: 120, height: 120, borderRadius: 16, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <MaterialCommunityIcons name="qrcode" size={80} color={colors.aquaLight} />
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Device ID</Text>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900', letterSpacing: 1, marginTop: 2 }}>AQR-GPS-LTE-001</Text>
          {!scanning && (
            <View style={{ width: '100%', marginTop: 16 }}>
              <Btn label="Scan & Pair Device" icon="scan" onPress={() => { setScanning(true); setProgress(0); }} />
            </View>
          )}
        </Card>

        {/* Setup steps */}
        <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Setup Steps</Text>
        <Card style={{ marginBottom: 16 }}>
          {STEPS.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: i < STEPS.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.ice, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ color: colors.blue, fontWeight: '800', fontSize: 13 }}>{i + 1}</Text>
              </View>
              <MaterialCommunityIcons name={s.icon as any} size={18} color={colors.blue} style={{ marginRight: 10 }} />
              <Text style={{ flex: 1, color: colors.text, fontSize: 13.5 }}>{s.label}</Text>
            </View>
          ))}
        </Card>

        {/* Live setup status */}
        {scanning && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Connection Status</Text>
            <Card style={{ marginBottom: 16 }}>
              {STATUS.map((st, i) => {
                const done = i < progress;
                const active = i === progress;
                return (
                  <View key={st.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: i < STATUS.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                    <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: done ? colors.greenBg : colors.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      {done ? (
                        <Ionicons name="checkmark" size={18} color={colors.green} />
                      ) : (
                        <MaterialCommunityIcons name={st.icon as any} size={16} color={active ? colors.blue : colors.textMuted} />
                      )}
                    </View>
                    <Text style={{ flex: 1, color: done ? colors.text : colors.textMuted, fontWeight: done ? '700' : '500', fontSize: 14 }}>{st.label}</Text>
                    {active && <Text style={{ color: colors.blue, fontSize: 12, fontWeight: '700' }}>...</Text>}
                  </View>
                );
              })}
            </Card>
          </>
        )}

        {/* Assign device */}
        {progress >= STATUS.length && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Assign Device</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              {['Water Bike 01', 'Water Bike 02'].map((b) => (
                <Pressable
                  key={b}
                  onPress={() => setAssigned(b)}
                  style={[{ flex: 1, borderRadius: 14, padding: 16, alignItems: 'center', backgroundColor: assigned === b ? colors.blue : colors.card, borderWidth: 2, borderColor: assigned === b ? colors.blue : colors.border }, shadow]}
                >
                  <MaterialCommunityIcons name="bike-fast" size={26} color={assigned === b ? colors.white : colors.blue} />
                  <Text style={{ color: assigned === b ? colors.white : colors.text, fontWeight: '700', marginTop: 6, fontSize: 13 }}>{b}</Text>
                </Pressable>
              ))}
            </View>
            {assigned && (
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.greenBg, padding: 14, borderRadius: 14, marginBottom: 12 }}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.green} style={{ marginRight: 10 }} />
                  <Text style={{ flex: 1, color: colors.green, fontWeight: '700', fontSize: 13.5 }}>
                    Device AQR-GPS-LTE-001 assigned to {assigned}. Ready for rental tracking.
                  </Text>
                </View>
                <Btn label="Finish Setup" icon="checkmark-done" onPress={() => router.replace('/(tabs)')} />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card } from '../components/ui';
import { colors, shadow } from '../constants/theme';
import { useStore } from '../data/store';

export default function RentalStart() {
  const router = useRouter();
  const { bikes, startRental } = useStore();
  const available = bikes.filter((b) => b.status === 'Available');

  const [bikeId, setBikeId] = useState(available[0]?.id || bikes[0].id);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState(60);
  const [payment, setPayment] = useState('Paid');
  const [waiver, setWaiver] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const submit = () => {
    if (!name || !waiver) return;
    startRental({
      bikeId,
      customerName: name,
      phone: phone || 'N/A',
      startTime: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      duration,
      distance: 0,
      paymentStatus: payment,
      waiverAccepted: waiver,
    });
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Ionicons name="checkmark" size={56} color={colors.green} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: colors.text, textAlign: 'center' }}>Rental Started</Text>
          <Text style={{ color: colors.textMuted, fontSize: 15, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
            Rental started successfully.{'\n'}GPS tracking is now active.
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: colors.greenBg, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: 8 }} />
            <Text style={{ color: colors.green, fontWeight: '700' }}>Live telemetry streaming · LTE</Text>
          </View>
          <View style={{ width: '100%', marginTop: 36, gap: 12 }}>
            <Btn label="View Active Rental" icon="navigate" onPress={() => router.replace('/active-rental')} />
            <Btn label="Back to Rentals" variant="outline" onPress={() => router.replace('/(tabs)/rentals')} />
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
              <Ionicons name="close" size={26} color={colors.white} />
            </Pressable>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800', marginLeft: 6 }}>Start Rental</Text>
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <Label text="Select Water Bike" />
          <View style={{ gap: 10, marginBottom: 18 }}>
            {bikes.map((b) => {
              const sel = b.id === bikeId;
              const disabled = b.status === 'In Rental';
              return (
                <Pressable
                  key={b.id}
                  onPress={() => !disabled && setBikeId(b.id)}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.card,
                      borderRadius: 14,
                      padding: 14,
                      borderWidth: 2,
                      borderColor: sel ? colors.blue : colors.border,
                      opacity: disabled ? 0.5 : 1,
                    },
                    shadow,
                  ]}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.ice, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <MaterialCommunityIcons name="bike-fast" size={22} color={colors.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: colors.text }}>{b.name}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>{disabled ? 'Currently in rental' : `Battery ${b.battery}% · ${b.locationName}`}</Text>
                  </View>
                  {sel && <Ionicons name="checkmark-circle" size={22} color={colors.blue} />}
                </Pressable>
              );
            })}
          </View>

          <Card>
            <Label text="Customer Name" />
            <Input value={name} onChangeText={setName} placeholder="e.g. Demo Customer" />
            <Label text="Phone Number" />
            <Input value={phone} onChangeText={setPhone} placeholder="(555) 000-0000" keyboardType="phone-pad" />

            <Label text="Rental Duration" />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {[30, 60, 90, 120].map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDuration(d)}
                  style={{ flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: duration === d ? colors.blue : colors.ice }}
                >
                  <Text style={{ color: duration === d ? colors.white : colors.blue, fontWeight: '700', fontSize: 13 }}>{d}m</Text>
                </Pressable>
              ))}
            </View>

            <Label text="Payment Status" />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {['Paid', 'Pending', 'On Site'].map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPayment(p)}
                  style={{ flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: payment === p ? colors.green : colors.greenBg }}
                >
                  <Text style={{ color: payment === p ? colors.white : colors.green, fontWeight: '700', fontSize: 12.5 }}>{p}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => setWaiver((w) => !w)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: waiver ? colors.blue : colors.border,
                  backgroundColor: waiver ? colors.blue : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                {waiver && <Ionicons name="checkmark" size={16} color={colors.white} />}
              </View>
              <Text style={{ flex: 1, color: colors.text, fontSize: 13.5 }}>Safety waiver accepted by customer</Text>
            </Pressable>
          </Card>

          <View style={{ marginTop: 18 }}>
            <Pressable
              onPress={submit}
              disabled={!name || !waiver}
              style={{
                backgroundColor: !name || !waiver ? colors.border : colors.blue,
                paddingVertical: 16,
                borderRadius: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="play" size={18} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>Start Rental</Text>
            </Pressable>
            {(!name || !waiver) && (
              <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 10 }}>
                Enter customer name and accept the waiver to continue.
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13, marginBottom: 8 }}>{text}</Text>;
}
function Input(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.textMuted}
      style={{
        backgroundColor: colors.bg,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: colors.text,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    />
  );
}

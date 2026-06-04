import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Row, SectionTitle } from '../../components/ui';
import { colors } from '../../constants/theme';

export default function Settings() {
  const router = useRouter();
  const [push, setPush] = useState(true);
  const [autoLock, setAutoLock] = useState(true);

  const item = (icon: any, label: string, value?: string, onPress?: () => void) => (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.ice, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Ionicons name={icon} size={18} color={colors.blue} />
      </View>
      <Text style={{ flex: 1, color: colors.text, fontWeight: '600', fontSize: 14.5 }}>{label}</Text>
      {value ? <Text style={{ color: colors.textMuted, fontSize: 13, marginRight: 6 }}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 18, paddingTop: 6 }}>
            <Text style={{ color: colors.aquaPale, fontSize: 13 }}>Configuration</Text>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: '900' }}>Settings</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Business profile */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <MaterialCommunityIcons name="waves" size={28} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text }}>AquaRide Marina Co.</Text>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>Lake Marina · Operator Plan</Text>
            </View>
            <Ionicons name="pencil" size={18} color={colors.blue} />
          </View>
        </Card>

        <SectionTitle title="Business & Pricing" />
        <Card style={{ marginBottom: 16 }}>
          {item('business-outline', 'Business Profile', 'AquaRide')}
          {item('cash-outline', 'Rental Pricing', '$18/hr')}
          {item('call-outline', 'Emergency Contact', '(555) 911')}
        </Card>

        <SectionTitle title="IoT & Tracking" />
        <Card style={{ marginBottom: 16 }}>
          {item('navigate-outline', 'Geofence Radius', '1.2 mi')}
          {item('time-outline', 'GPS Update Interval', '4 sec')}
          {item('hardware-chip-outline', 'Cellular Device Settings', 'LTE/4G')}
          {item('cog-outline', 'Device Firmware', 'v1.0.3')}
          <Pressable
            onPress={() => router.push('/device-setup')}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 13 }}
          >
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name="add" size={20} color={colors.green} />
            </View>
            <Text style={{ flex: 1, color: colors.green, fontWeight: '700', fontSize: 14.5 }}>Add New Water Bike</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.green} />
          </Pressable>
        </Card>

        <SectionTitle title="Alert Preferences" />
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Push Notifications</Text>
            <Switch value={push} onValueChange={setPush} trackColor={{ false: colors.border, true: colors.aquaLight }} thumbColor={push ? colors.blue : '#f4f3f4'} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Auto-lock idle bikes</Text>
            <Switch value={autoLock} onValueChange={setAutoLock} trackColor={{ false: colors.border, true: colors.aquaLight }} thumbColor={autoLock ? colors.blue : '#f4f3f4'} />
          </View>
        </Card>

        <SectionTitle title="System" />
        <Card style={{ marginBottom: 16 }}>
          <Row label="App Version" value="1.0.3 (Demo)" />
          <Row label="Connected Devices" value="2 / 2 online" valueColor={colors.green} />
          <Row label="SIM Provider" value="IoT Connect LTE" />
        </Card>

        <Pressable
          onPress={() => router.replace('/login')}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 14, backgroundColor: colors.redBg }}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.red} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.red, fontWeight: '700' }}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

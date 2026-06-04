import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '../../components/StatusBadge';
import { Card, SectionTitle } from '../../components/ui';
import { colors, severityStyle, shadow } from '../../constants/theme';
import { useStore } from '../../data/store';

const iconForType: Record<string, any> = {
  Geofence: 'map-marker-alert',
  Battery: 'battery-alert',
  Cellular: 'signal-off',
  Offline: 'access-point-off',
};

export default function Alerts() {
  const { alerts, resolveAlert } = useStore();
  const [settings, setSettings] = useState({
    exitZone: true,
    idle: true,
    gpsLoss: true,
  });

  const open = alerts.filter((a) => !a.resolved);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.navy }}>
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 18, paddingTop: 6 }}>
            <Text style={{ color: colors.aquaPale, fontSize: 13 }}>Monitoring</Text>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: '900' }}>Alerts & Geofence</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <SectionTitle title="Active Alerts" sub={`${open.length} unresolved`} />
        {alerts.map((a) => {
          const s = severityStyle(a.severity);
          return (
            <Card key={a.id} style={{ marginBottom: 12, opacity: a.resolved ? 0.55 : 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    backgroundColor: s.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialCommunityIcons name={iconForType[a.type] || 'alert'} size={22} color={s.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <StatusBadge label={a.severity} type="severity" />
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{a.timestamp}</Text>
                  </View>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 8, lineHeight: 19 }}>
                    {a.message}
                  </Text>
                  {!a.resolved ? (
                    <Pressable
                      onPress={() => resolveAlert(a.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginTop: 10,
                        backgroundColor: colors.ice,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 10,
                      }}
                    >
                      <Ionicons name="checkmark" size={14} color={colors.blue} />
                      <Text style={{ color: colors.blue, fontWeight: '700', fontSize: 12, marginLeft: 4 }}>Resolve</Text>
                    </Pressable>
                  ) : (
                    <Text style={{ color: colors.green, fontWeight: '700', fontSize: 12, marginTop: 10 }}>✓ Resolved</Text>
                  )}
                </View>
              </View>
            </Card>
          );
        })}

        <SectionTitle title="Geofence Zones" sub="Configured boundaries" />
        <Card style={{ marginBottom: 16 }}>
          {[
            { name: 'Dock Zone', color: colors.green, desc: 'Charging & parking area' },
            { name: 'Safe Riding Area', color: colors.blue, desc: 'Permitted ride zone · 1.2 mi radius' },
            { name: 'Restricted Area', color: colors.red, desc: 'No-entry / hazard zone' },
          ].map((z, i) => (
            <View
              key={z.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: i < 2 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: z.color, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{z.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>{z.desc}</Text>
              </View>
            </View>
          ))}
        </Card>

        <SectionTitle title="Alert Rules" />
        <Card>
          <SwitchRow label="Alert when bike exits allowed zone" value={settings.exitZone} onChange={(v) => setSettings((s) => ({ ...s, exitZone: v }))} />
          <SwitchRow label="Alert when bike is idle too long" value={settings.idle} onChange={(v) => setSettings((s) => ({ ...s, idle: v }))} />
          <SwitchRow label="Alert when bike loses GPS signal" value={settings.gpsLoss} onChange={(v) => setSettings((s) => ({ ...s, gpsLoss: v }))} last />
        </Card>
      </ScrollView>
    </View>
  );
}

function SwitchRow({ label, value, onChange, last }: { label: string; value: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 14, flex: 1, marginRight: 12 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.aquaLight }}
        thumbColor={value ? colors.blue : '#f4f3f4'}
      />
    </View>
  );
}

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '../../components/StatusBadge';
import { colors, shadow } from '../../constants/theme';
import { useStore } from '../../data/store';

const MAP_IMG = 'https://d64gsuwffb70l.cloudfront.net/6a21ec5dfac5562c450b83ab_1780608215907_e039a7f4.jpg';

export default function MapScreen() {
  const router = useRouter();
  const { bikes } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'alerts'>('all');
  const [selected, setSelected] = useState('WB01');

  const active = bikes.find((b) => b.status === 'In Rental');
  const sel = bikes.find((b) => b.id === selected) || bikes[0];

  const visible = bikes.filter((b) => {
    if (filter === 'active') return b.status === 'In Rental';
    if (filter === 'alerts') return b.id === 'WB01';
    return true;
  });

  const positions: Record<string, { x: number; y: number }> = {
    WB01: { x: 0.44, y: 0.36 },
    WB02: { x: 0.6, y: 0.72 },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.navyDeep }}>
      <ImageBackground source={{ uri: MAP_IMG }} style={{ flex: 1 }} contentFit="cover">
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                ...shadow,
              }}
            >
              <Ionicons name="chevron-back" size={22} color={colors.navy} />
            </Pressable>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, ...shadow }}>
                <Text style={{ fontWeight: '800', color: colors.navy }}>Live Map Tracking</Text>
              </View>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Filter toggles */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8 }}>
            {([['all', 'All Bikes'], ['active', 'Active Only'], ['alerts', 'Alerts']] as const).map(([k, l]) => (
              <Pressable
                key={k}
                onPress={() => setFilter(k)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: filter === k ? colors.blue : colors.white,
                  ...shadow,
                }}
              >
                <Text style={{ color: filter === k ? colors.white : colors.navy, fontWeight: '700', fontSize: 12.5 }}>{l}</Text>
              </Pressable>
            ))}
          </View>

          {/* Geofence + route + markers overlay */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: 'absolute',
                left: '14%',
                top: '14%',
                width: '60%',
                height: '52%',
                borderRadius: 999,
                borderWidth: 2,
                borderColor: colors.aqua,
                borderStyle: 'dashed',
                backgroundColor: 'rgba(0,180,216,0.08)',
              }}
            />
            <View style={{ position: 'absolute', left: '15%', top: '15%', backgroundColor: 'rgba(0,180,216,0.85)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
              <Text style={{ color: colors.white, fontSize: 10, fontWeight: '700' }}>Safe Riding Area</Text>
            </View>

            {filter !== 'alerts' &&
              [0.0, 0.12, 0.24, 0.36, 0.48].map((t, i) => (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${(0.58 - t * 0.3) * 100}%`,
                    top: `${(0.7 - t * 0.7) * 100}%`,
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: colors.blueBadge,
                    opacity: 0.4 + i * 0.12,
                  }}
                />
              ))}

            {visible.map((b) => {
              const p = positions[b.id];
              const isActive = b.status === 'In Rental';
              return (
                <Pressable
                  key={b.id}
                  onPress={() => setSelected(b.id)}
                  style={{
                    position: 'absolute',
                    left: `${p.x * 100}%`,
                    top: `${p.y * 100}%`,
                    alignItems: 'center',
                    marginLeft: -22,
                    marginTop: -44,
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                      backgroundColor: colors.navy,
                      marginBottom: 3,
                    }}
                  >
                    <Text style={{ color: colors.white, fontSize: 9, fontWeight: '700' }}>{b.speed} mph</Text>
                  </View>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: isActive ? colors.blueBadge : colors.green,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 3,
                      borderColor: colors.white,
                      ...shadow,
                    }}
                  >
                    <MaterialCommunityIcons name="bike-fast" size={24} color={colors.white} />
                  </View>
                </Pressable>
              );
            })}

            {/* Dock marker */}
            <View style={{ position: 'absolute', left: '58%', top: '74%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.navy, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                <Ionicons name="boat-outline" size={12} color={colors.aquaLight} />
                <Text style={{ color: colors.white, fontSize: 9, fontWeight: '700', marginLeft: 4 }}>Dock Zone</Text>
              </View>
            </View>

            {/* Zoom + refresh controls */}
            <View style={{ position: 'absolute', right: 16, top: '30%', gap: 10 }}>
              {(['add', 'remove', 'refresh'] as const).map((ic) => (
                <Pressable
                  key={ic}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadow,
                  }}
                >
                  <Ionicons name={ic} size={22} color={colors.navy} />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Bottom location card */}
          <View style={{ padding: 14 }}>
            <View style={{ backgroundColor: colors.white, borderRadius: 20, padding: 16, ...shadow }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    backgroundColor: colors.ice,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialCommunityIcons name="bike-fast" size={24} color={colors.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{sel.name}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{sel.locationName}</Text>
                </View>
                <StatusBadge label={sel.status} />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Info label="Speed" value={`${sel.speed} mph`} />
                <Info label="GPS Accuracy" value="5m" />
                <Info label="Cellular" value={sel.signalStrength} />
                {sel.rentalId ? <Info label="Rental ID" value={sel.rentalId} /> : <Info label="State" value="Parked" />}
                <Info label="Distance from Dock" value={sel.status === 'In Rental' ? '0.8 mi' : '0 mi'} />
                <Info label="Coordinates" value={`${sel.latitude.toFixed(3)}, ${sel.longitude.toFixed(3)}`} />
              </View>

              {active && sel.id === active.id && (
                <Pressable
                  onPress={() => router.push('/active-rental')}
                  style={{ marginTop: 8, backgroundColor: colors.blue, paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                >
                  <Text style={{ color: colors.white, fontWeight: '700' }}>View Active Rental</Text>
                </Pressable>
              )}
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '50%', marginBottom: 10 }}>
      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 1 }}>{value}</Text>
    </View>
  );
}

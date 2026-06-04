import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, shadow } from '../constants/theme';
import type { WaterBike } from '../data/store';
import { StatusBadge } from './StatusBadge';

function Metric({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
        {icon}
        <Text style={{ color: colors.textMuted, fontSize: 11, marginLeft: 4 }}>{label}</Text>
      </View>
      <Text style={{ color: color || colors.text, fontSize: 15, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

export function BikeCard({ bike }: { bike: WaterBike }) {
  const router = useRouter();
  const battColor = bike.battery > 50 ? colors.green : bike.battery > 25 ? colors.orange : colors.red;

  return (
    <View style={[{ backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 14 }, shadow]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: colors.ice,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <MaterialCommunityIcons name="bike-fast" size={26} color={colors.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{bike.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: 12, marginLeft: 3 }}>{bike.locationName}</Text>
          </View>
        </View>
        <StatusBadge label={bike.status} />
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Metric
          icon={<MaterialCommunityIcons name="map-marker-radius" size={14} color={colors.blue} />}
          label="GPS"
          value={bike.gpsStatus}
          color={colors.green}
        />
        <Metric
          icon={<MaterialCommunityIcons name="signal" size={14} color={colors.blue} />}
          label="Cellular"
          value={bike.cellularStatus.split(' ')[0]}
          color={colors.text}
        />
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 14 }}>
        <Metric
          icon={<Ionicons name="battery-half-outline" size={14} color={battColor} />}
          label="Battery"
          value={`${bike.battery}%`}
          color={battColor}
        />
        <Metric
          icon={<MaterialCommunityIcons name="speedometer" size={14} color={colors.blue} />}
          label="Speed"
          value={`${bike.speed} mph`}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green, marginRight: 5 }} />
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>Updated {bike.lastUpdate}s ago</Text>
        </View>
        <Pressable
          onPress={() => router.push(`/bike/${bike.id}`)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.blue,
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: colors.white, fontWeight: '700', fontSize: 13, marginRight: 4 }}>View Details</Text>
          <Feather name="chevron-right" size={15} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

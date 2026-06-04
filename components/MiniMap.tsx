import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { colors } from '../constants/theme';

const MAP_IMG = 'https://d64gsuwffb70l.cloudfront.net/6a21ec5dfac5562c450b83ab_1780608215907_e039a7f4.jpg';

type Marker = { x: number; y: number; active: boolean };

export function MiniMap({
  height = 180,
  radius = 18,
  markers = [
    { x: 0.42, y: 0.38, active: true },
    { x: 0.62, y: 0.7, active: false },
  ],
  showRoute = true,
  showGeofence = true,
}: {
  height?: number;
  radius?: number;
  markers?: Marker[];
  showRoute?: boolean;
  showGeofence?: boolean;
}) {
  return (
    <ImageBackground
      source={{ uri: MAP_IMG }}
      style={{ height, borderRadius: radius, overflow: 'hidden', backgroundColor: colors.aquaPale }}
      contentFit="cover"
    >
      {/* geofence area */}
      {showGeofence && (
        <View
          style={{
            position: 'absolute',
            left: '12%',
            top: '15%',
            width: '64%',
            height: '60%',
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.aqua,
            borderStyle: 'dashed',
            backgroundColor: 'rgba(0,180,216,0.10)',
          }}
        />
      )}

      {/* route trail (dots) */}
      {showRoute &&
        [0.2, 0.28, 0.36, 0.42].map((t, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: `${(0.22 + t * 0.5) * 100}%`,
              top: `${(0.6 - t * 0.6) * 100}%`,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.blueBadge,
              opacity: 0.5 + i * 0.12,
            }}
          />
        ))}

      {/* markers */}
      {markers.map((m, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${m.x * 100}%`,
            top: `${m.y * 100}%`,
            alignItems: 'center',
            marginLeft: -16,
            marginTop: -32,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: m.active ? colors.blueBadge : colors.green,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.white,
            }}
          >
            <MaterialCommunityIcons name="bike" size={18} color={colors.white} />
          </View>
          <Ionicons name="caret-down" size={14} color={m.active ? colors.blueBadge : colors.green} style={{ marginTop: -4 }} />
        </View>
      ))}
    </ImageBackground>
  );
}

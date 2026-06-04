import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

const BG = 'https://d64gsuwffb70l.cloudfront.net/6a21ec5dfac5562c450b83ab_1780608199932_e0b7c03f.png';

export default function Welcome() {
  const router = useRouter();
  return (
    <ImageBackground source={{ uri: BG }} style={{ flex: 1, backgroundColor: colors.navyDeep }} contentFit="cover">
      <View style={{ flex: 1, backgroundColor: 'rgba(1,30,56,0.55)' }}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', padding: 26 }}>
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 28,
                backgroundColor: colors.aqua,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 22,
                shadowColor: colors.aqua,
                shadowOpacity: 0.6,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              <MaterialCommunityIcons name="map-marker-radius" size={52} color={colors.white} />
            </View>
            <Text style={{ fontSize: 38, fontWeight: '900', color: colors.white, letterSpacing: -0.5 }}>
              AquaRide
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text style={{ fontSize: 38, fontWeight: '900', color: colors.aquaLight, letterSpacing: -0.5 }}>IoT</Text>
            </View>
            <Text
              style={{
                color: colors.ice,
                fontSize: 15,
                textAlign: 'center',
                marginTop: 14,
                lineHeight: 22,
                maxWidth: 280,
              }}
            >
              Smart GPS & Cellular Tracking for Water Bike Rentals
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 22, marginBottom: 34 }}>
              {[
                { icon: 'gps-fixed', label: 'Live GPS' },
                { icon: 'signal-cellular-3', label: 'LTE / 4G' },
                { icon: 'shield-check', label: 'Geofence' },
              ].map((f) => (
                <View key={f.label} style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 16,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 7,
                    }}
                  >
                    <MaterialCommunityIcons name={f.icon as any} size={24} color={colors.aquaLight} />
                  </View>
                  <Text style={{ color: colors.ice, fontSize: 11.5, fontWeight: '600' }}>{f.label}</Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => router.push('/login')}
              style={{
                backgroundColor: colors.aqua,
                paddingVertical: 17,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16, marginRight: 8 }}>Get Started</Text>
              <Ionicons name="arrow-forward" size={19} color={colors.white} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/rider')}
              style={{
                marginTop: 12,
                paddingVertical: 15,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.35)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person-outline" size={18} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={{ color: colors.white, fontWeight: '700', fontSize: 15 }}>I'm a Rider — Track My Ride</Text>
            </Pressable>

            <Text style={{ color: colors.aquaPale, textAlign: 'center', marginTop: 16, fontSize: 12 }}>
              Fleet operations & live telemetry · v1.0.3
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

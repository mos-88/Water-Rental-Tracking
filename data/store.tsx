import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export type WaterBike = {
  id: string;
  name: string;
  status: string;
  gpsStatus: string;
  cellularStatus: string;
  battery: number;
  speed: number;
  latitude: number;
  longitude: number;
  locationName: string;
  lastUpdate: number; // seconds ago
  rentalId: string | null;
  firmwareVersion: string;
  signalStrength: string;
  distanceToday: number;
  rideTimeToday: number; // minutes
};

export type Rental = {
  id: string;
  bikeId: string;
  customerName: string;
  phone: string;
  startTime: string;
  startedAt: number; // epoch ms
  duration: number; // minutes
  status: string;
  distance: number;
  paymentStatus: string;
  waiverAccepted: boolean;
};

export type Alert = {
  id: string;
  bikeId: string;
  type: string;
  severity: string;
  message: string;
  timestamp: string;
  resolved: boolean;
};

export type Trip = {
  id: string;
  bikeName: string;
  date: string;
  duration: number;
  distance: number;
  maxSpeed: number;
  avgSpeed: number;
  startLocation: string;
  endLocation: string;
  cellStability: string;
  gpsAccuracy: string;
  status: string;
};

type StoreType = {
  bikes: WaterBike[];
  rentals: Rental[];
  alerts: Alert[];
  trips: Trip[];
  startRental: (r: Omit<Rental, 'id' | 'status' | 'startedAt'>) => string;
  endRental: (rentalId: string) => void;
  resolveAlert: (id: string) => void;
  pingBike: (id: string) => void;
};

const StoreContext = createContext<StoreType | null>(null);

const initialBikes: WaterBike[] = [
  {
    id: 'WB01',
    name: 'Water Bike 01',
    status: 'In Rental',
    gpsStatus: 'Active',
    cellularStatus: 'LTE Connected',
    battery: 82,
    speed: 7.4,
    latitude: 36.0541,
    longitude: -112.1401,
    locationName: 'Lake Marina Zone A',
    lastUpdate: 12,
    rentalId: 'AR-1024',
    firmwareVersion: 'v1.0.3',
    signalStrength: 'Good',
    distanceToday: 3.1,
    rideTimeToday: 42,
  },
  {
    id: 'WB02',
    name: 'Water Bike 02',
    status: 'Available',
    gpsStatus: 'Active',
    cellularStatus: '4G Connected',
    battery: 64,
    speed: 0,
    latitude: 36.0498,
    longitude: -112.1455,
    locationName: 'Dock Station',
    lastUpdate: 25,
    rentalId: null,
    firmwareVersion: 'v1.0.3',
    signalStrength: 'Excellent',
    distanceToday: 0,
    rideTimeToday: 0,
  },
];

const initialAlerts: Alert[] = [
  {
    id: 'AL-1',
    bikeId: 'WB01',
    type: 'Geofence',
    severity: 'Medium',
    message: 'Water Bike 01 is approaching geofence boundary.',
    timestamp: '2 minutes ago',
    resolved: false,
  },
  {
    id: 'AL-2',
    bikeId: 'WB02',
    type: 'Battery',
    severity: 'Low',
    message: 'Water Bike 02 battery below 65%.',
    timestamp: '15 minutes ago',
    resolved: false,
  },
  {
    id: 'AL-3',
    bikeId: 'WB01',
    type: 'Cellular',
    severity: 'Low',
    message: 'Cellular signal dropped briefly on Water Bike 01.',
    timestamp: 'Yesterday',
    resolved: false,
  },
];

const initialTrips: Trip[] = [
  {
    id: 'TR-1',
    bikeName: 'Water Bike 01',
    date: 'Today',
    duration: 42,
    distance: 3.1,
    maxSpeed: 8.2,
    avgSpeed: 4.4,
    startLocation: 'Dock Station',
    endLocation: 'Lake Marina Zone A',
    cellStability: '99.2% stable (LTE)',
    gpsAccuracy: 'Avg 5m, 1240 fixes',
    status: 'Completed',
  },
  {
    id: 'TR-2',
    bikeName: 'Water Bike 02',
    date: 'Yesterday',
    duration: 30,
    distance: 2.4,
    maxSpeed: 6.8,
    avgSpeed: 4.8,
    startLocation: 'Dock Station',
    endLocation: 'Sunset Cove',
    cellStability: '97.5% stable (4G)',
    gpsAccuracy: 'Avg 6m, 890 fixes',
    status: 'Completed',
  },
  {
    id: 'TR-3',
    bikeName: 'Water Bike 01',
    date: 'Yesterday',
    duration: 55,
    distance: 4.0,
    maxSpeed: 9.1,
    avgSpeed: 4.3,
    startLocation: 'Dock Station',
    endLocation: 'North Bay',
    cellStability: '98.8% stable (LTE)',
    gpsAccuracy: 'Avg 4m, 1610 fixes',
    status: 'Completed',
  },
  {
    id: 'TR-4',
    bikeName: 'Water Bike 02',
    date: 'Mar 12',
    duration: 25,
    distance: 1.9,
    maxSpeed: 6.2,
    avgSpeed: 4.5,
    startLocation: 'Dock Station',
    endLocation: 'Marina Zone B',
    cellStability: '96.1% stable (4G)',
    gpsAccuracy: 'Avg 7m, 720 fixes',
    status: 'Completed',
  },
];

const initialRentals: Rental[] = [
  {
    id: 'AR-1024',
    bikeId: 'WB01',
    customerName: 'Demo Customer',
    phone: '(555) 014-2280',
    startTime: '1:38 PM',
    startedAt: Date.now() - 22 * 60 * 1000,
    duration: 60,
    status: 'Active',
    distance: 3.1,
    paymentStatus: 'Paid',
    waiverAccepted: true,
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [bikes, setBikes] = useState<WaterBike[]>(initialBikes);
  const [rentals, setRentals] = useState<Rental[]>(initialRentals);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [trips] = useState<Trip[]>(initialTrips);
  const counter = useRef(1025);

  // Simulated real-time telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBikes((prev) =>
        prev.map((b) => {
          if (b.status === 'In Rental') {
            const newSpeed = Math.max(0, +(b.speed + (Math.random() - 0.5) * 1.2).toFixed(1));
            return {
              ...b,
              speed: Math.min(newSpeed, 9.5),
              latitude: +(b.latitude + (Math.random() - 0.5) * 0.0004).toFixed(5),
              longitude: +(b.longitude + (Math.random() - 0.5) * 0.0004).toFixed(5),
              lastUpdate: Math.floor(Math.random() * 8) + 3,
              distanceToday: +(b.distanceToday + 0.02).toFixed(2),
            };
          }
          return { ...b, lastUpdate: b.lastUpdate + 5 };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const startRental: StoreType['startRental'] = (r) => {
    const id = `AR-${counter.current++}`;
    const rental: Rental = { ...r, id, status: 'Active', startedAt: Date.now() };
    setRentals((p) => [rental, ...p]);
    setBikes((p) =>
      p.map((b) =>
        b.id === r.bikeId
          ? { ...b, status: 'In Rental', rentalId: id, speed: 4.2 }
          : b
      )
    );
    return id;
  };

  const endRental: StoreType['endRental'] = (rentalId) => {
    setRentals((p) => p.map((r) => (r.id === rentalId ? { ...r, status: 'Completed' } : r)));
    setBikes((p) =>
      p.map((b) =>
        b.rentalId === rentalId
          ? { ...b, status: 'Available', rentalId: null, speed: 0, locationName: 'Dock Station' }
          : b
      )
    );
  };

  const resolveAlert: StoreType['resolveAlert'] = (id) => {
    setAlerts((p) => p.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const pingBike: StoreType['pingBike'] = (id) => {
    setBikes((p) => p.map((b) => (b.id === id ? { ...b, lastUpdate: 1 } : b)));
  };

  return (
    <StoreContext.Provider
      value={{ bikes, rentals, alerts, trips, startRental, endRental, resolveAlert, pingBike }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

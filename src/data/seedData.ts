import type {
  ParkingSpace,
  Booking,
  ProviderStats,
  ActivityItem,
  MonthlyEarningPoint,
  DailyEarningBar,
  ParkEaseStoreState,
  Coordinates,
} from '../types/parkease';

export const BENGALURU_CENTER: Coordinates = {
  lat: 12.9716,
  lng: 77.5946,
};

// High-fidelity SVG illustration presets (100% offline, self-contained data URIs)
export const DRIVEWAY_PRESETS = [
  {
    id: 'preset-green-view',
    title: 'Covered Garden Porch',
    dataUri:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
        <defs>
          <linearGradient id="sky1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#E0F2FE" />
            <stop offset="100%" stop-color="#BAE6FD" />
          </linearGradient>
          <linearGradient id="grass1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#86EFAC" />
            <stop offset="100%" stop-color="#22C55E" />
          </linearGradient>
          <linearGradient id="wall1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#F8FAFC" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
          <linearGradient id="roof1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E3A5F" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
        </defs>
        <!-- Background Sky -->
        <rect width="400" height="250" fill="url(#sky1)" />
        <!-- Garden Grass -->
        <rect y="140" width="400" height="110" fill="url(#grass1)" />
        <!-- House Wall -->
        <polygon points="50,90 200,30 350,90 350,170 50,170" fill="url(#wall1)" stroke="#CBD5E1" stroke-width="2" />
        <!-- Porch Canopy -->
        <polygon points="30,90 200,20 370,90 350,98 200,35 50,98" fill="url(#roof1)" />
        <rect x="70" y="100" width="12" height="70" fill="#94A3B8" />
        <rect x="318" y="100" width="12" height="70" fill="#94A3B8" />
        <!-- Concrete Driveway Bay -->
        <polygon points="90,170 310,170 360,250 40,250" fill="#64748B" />
        <polygon points="105,170 295,170 340,250 60,250" fill="#475569" opacity="0.4" />
        <!-- Parking Stripes -->
        <line x1="120" y1="180" x2="80" y2="245" stroke="#FDE047" stroke-width="4" stroke-dasharray="10,6" />
        <line x1="280" y1="180" x2="320" y2="245" stroke="#FDE047" stroke-width="4" stroke-dasharray="10,6" />
        <!-- P Badge on Floor -->
        <circle cx="200" cy="210" r="18" fill="#1E6B43" />
        <text x="200" y="217" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">P</text>
        <!-- Shrubbery -->
        <circle cx="40" cy="165" r="24" fill="#15803D" />
        <circle cx="25" cy="175" r="18" fill="#166534" />
        <circle cx="360" cy="165" r="24" fill="#15803D" />
        <circle cx="375" cy="175" r="18" fill="#166534" />
      </svg>
    `),
  },
  {
    id: 'preset-indiranagar-driveway',
    title: 'Gated Driveway',
    dataUri:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
        <defs>
          <linearGradient id="sky2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FEF3C7" />
            <stop offset="100%" stop-color="#FDE68A" />
          </linearGradient>
        </defs>
        <rect width="400" height="250" fill="url(#sky2)" />
        <!-- Boundary Wall -->
        <rect x="0" y="70" width="400" height="70" fill="#E2E8F0" />
        <rect x="0" y="60" width="400" height="10" fill="#94A3B8" />
        <!-- Open Iron Gates -->
        <rect x="30" y="40" width="20" height="100" fill="#334155" />
        <rect x="350" y="40" width="20" height="100" fill="#334155" />
        <line x1="50" y1="50" x2="110" y2="70" stroke="#1E293B" stroke-width="4" />
        <line x1="50" y1="90" x2="110" y2="100" stroke="#1E293B" stroke-width="4" />
        <line x1="50" y1="130" x2="110" y2="135" stroke="#1E293B" stroke-width="4" />
        <line x1="350" y1="50" x2="290" y2="70" stroke="#1E293B" stroke-width="4" />
        <line x1="350" y1="90" x2="290" y2="100" stroke="#1E293B" stroke-width="4" />
        <line x1="350" y1="130" x2="290" y2="135" stroke="#1E293B" stroke-width="4" />
        <!-- Driveway Tarmac -->
        <polygon points="50,140 350,140 400,250 0,250" fill="#475569" />
        <!-- Paver Interlocks -->
        <line x1="200" y1="140" x2="200" y2="250" stroke="#94A3B8" stroke-width="2" stroke-dasharray="6,4" />
        <!-- Space Marker -->
        <circle cx="200" cy="195" r="16" fill="#1E6B43" />
        <text x="200" y="201" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">P</text>
        <rect x="140" y="160" width="120" height="70" fill="none" stroke="#22C55E" stroke-width="2" stroke-dasharray="8,6" rx="6" />
      </svg>
    `),
  },
  {
    id: 'preset-koramangala-bay',
    title: 'Covered Basement Bay',
    dataUri:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
        <rect width="400" height="250" fill="#1E293B" />
        <!-- Concrete Ceiling & Beams -->
        <rect x="0" y="0" width="400" height="50" fill="#334155" />
        <rect x="60" y="0" width="30" height="80" fill="#475569" />
        <rect x="310" y="0" width="30" height="80" fill="#475569" />
        <circle cx="200" cy="40" r="12" fill="#FEF08A" opacity="0.8" />
        <!-- Concrete Floor with Epoxy Finish -->
        <polygon points="0,110 400,110 400,250 0,250" fill="#334155" />
        <polygon points="80,120 320,120 360,250 40,250" fill="#1E3A5F" opacity="0.3" />
        <!-- Bay Markings -->
        <line x1="90" y1="120" x2="60" y2="250" stroke="#38BDF8" stroke-width="4" />
        <line x1="310" y1="120" x2="340" y2="250" stroke="#38BDF8" stroke-width="4" />
        <!-- Bay Label -->
        <rect x="150" y="130" width="100" height="30" fill="#0F172A" rx="4" />
        <text x="200" y="151" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#38BDF8" text-anchor="middle">BAY B-04</text>
        <circle cx="200" cy="200" r="18" fill="#1E6B43" />
        <text x="200" y="207" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">P</text>
      </svg>
    `),
  },
  {
    id: 'preset-jayanagar-porch',
    title: 'Residential Carport',
    dataUri:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
        <defs>
          <linearGradient id="warmSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FED7AA" />
            <stop offset="100%" stop-color="#FFEDD5" />
          </linearGradient>
        </defs>
        <rect width="400" height="250" fill="url(#warmSky)" />
        <!-- House Front -->
        <rect x="40" y="60" width="320" height="110" fill="#FEF3C7" stroke="#FDE68A" />
        <rect x="80" y="90" width="50" height="80" fill="#78350F" />
        <rect x="260" y="90" width="60" height="50" fill="#93C5FD" stroke="#3B82F6" stroke-width="2" />
        <!-- Wooden Pergola Canopy -->
        <rect x="60" y="50" width="280" height="15" fill="#92400E" rx="3" />
        <line x1="90" y1="50" x2="70" y2="170" stroke="#78350F" stroke-width="6" />
        <line x1="310" y1="50" x2="330" y2="170" stroke="#78350F" stroke-width="6" />
        <!-- Tiled Paving -->
        <polygon points="50,170 350,170 400,250 0,250" fill="#CBD5E1" />
        <circle cx="200" cy="210" r="16" fill="#1E6B43" />
        <text x="200" y="216" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">P</text>
        <!-- Flower Pots -->
        <rect x="140" y="155" width="20" height="15" fill="#EA580C" rx="2" />
        <circle cx="150" cy="150" r="10" fill="#16A34A" />
        <rect x="240" y="155" width="20" height="15" fill="#EA580C" rx="2" />
        <circle cx="250" cy="150" r="10" fill="#16A34A" />
      </svg>
    `),
  },
] as const;

export const SEED_SPACES: readonly ParkingSpace[] = [
  {
    id: 's1',
    title: 'Green View Parking',
    address: 'No. 14, Lavelle Road, Shanthala Nagar, Bengaluru, Karnataka 560001',
    coordinates: {
      lat: 12.973827,
      lng: 77.596885,
    },
    distanceMeters: 350,
    walkMinutes: 5,
    dimensionsFt: {
      length: 15,
      width: 10,
    },
    supportedVehicles: ['Car', 'Scooty'],
    hourlyRateInr: 30,
    rating: 4.5,
    reviewCount: 120,
    imageUrl: DRIVEWAY_PRESETS[0].dataUri,
    availabilityWindow: '07:00 AM – 10:00 PM',
    isActive: true,
  },
  {
    id: 's2',
    title: 'Indiranagar 5th Cross Driveway',
    address: '5th Cross, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    coordinates: {
      lat: 12.975099,
      lng: 77.591009,
    },
    distanceMeters: 550,
    walkMinutes: 7,
    dimensionsFt: {
      length: 10,
      width: 6,
    },
    supportedVehicles: ['Scooty', 'Bike'],
    hourlyRateInr: 15,
    rating: 4.7,
    reviewCount: 64,
    imageUrl: DRIVEWAY_PRESETS[1].dataUri,
    availabilityWindow: '06:00 AM – 11:00 PM',
    isActive: true,
  },
  {
    id: 's3',
    title: 'Koramangala Apartment Bay',
    address: '4th Block, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560034',
    coordinates: {
      lat: 12.966191,
      lng: 77.600149,
    },
    distanceMeters: 850,
    walkMinutes: 11,
    dimensionsFt: {
      length: 18,
      width: 11,
    },
    supportedVehicles: ['Car', 'Scooty'],
    hourlyRateInr: 45,
    rating: 4.6,
    reviewCount: 92,
    imageUrl: DRIVEWAY_PRESETS[2].dataUri,
    availabilityWindow: '24 Hours',
    isActive: true,
  },
  {
    id: 's4',
    title: 'Jayanagar Covered Porch',
    address: '3rd Block, 11th Main, Jayanagar, Bengaluru, Karnataka 560011',
    coordinates: {
      lat: 12.964601,
      lng: 77.587419,
    },
    distanceMeters: 1100,
    walkMinutes: 14,
    dimensionsFt: {
      length: 14,
      width: 9,
    },
    supportedVehicles: ['Car', 'Scooty'],
    hourlyRateInr: 25,
    rating: 4.4,
    reviewCount: 41,
    imageUrl: DRIVEWAY_PRESETS[3].dataUri,
    availabilityWindow: '08:00 AM – 09:00 PM',
    isActive: true,
  },
];

export const SEED_BOOKINGS: readonly Booking[] = [
  // Provider pending requests (appear on Provider Dashboard and Manage Bookings)
  {
    id: 'REQ-001',
    spaceId: 's1',
    spaceTitle: 'Car Booking Request',
    vehicleType: 'Car',
    durationHours: 2,
    totalPriceInr: 80,
    scheduleLabel: 'Today, 3:30 PM – 5:30 PM',
    requestedAtLabel: '3:20 PM',
    status: 'Pending',
  },
  {
    id: 'REQ-002',
    spaceId: 's2',
    spaceTitle: 'Scooty Booking',
    vehicleType: 'Scooty',
    durationHours: 1,
    totalPriceInr: 15,
    scheduleLabel: 'Tomorrow, 10:00 AM – 11:00 AM',
    requestedAtLabel: 'Tomorrow, 10 AM',
    status: 'Pending',
  },
  // Seeker past completed bookings (appear in Seeker's "Past" tab)
  {
    id: 'PAST-001',
    spaceId: 's2',
    spaceTitle: 'Indiranagar 5th Cross Driveway',
    vehicleType: 'Scooty',
    durationHours: 2,
    totalPriceInr: 30,
    scheduleLabel: 'Yesterday, 2:00 PM – 4:00 PM',
    requestedAtLabel: 'Yesterday',
    status: 'Completed',
  },
  {
    id: 'PAST-002',
    spaceId: 's1',
    spaceTitle: 'Green View Parking',
    vehicleType: 'Car',
    durationHours: 3,
    totalPriceInr: 90,
    scheduleLabel: '3 days ago, 11:00 AM – 2:00 PM',
    requestedAtLabel: '3 days ago',
    status: 'Completed',
  },
];

export const SEED_SEEKER_BOOKING_IDS: readonly string[] = ['PAST-001', 'PAST-002'];

export const SEED_PROVIDER_STATS: ProviderStats = {
  totalBookings: 12,
  totalEarningsInr: 4800,
  upcomingCount: 3,
  growthBadge: '↑ 20%',
};

export const SEED_RECENT_ACTIVITY: readonly ActivityItem[] = [
  {
    id: 'act-1',
    text: '+ ₹80 • 2 hrs ago',
    timestampLabel: '2 hrs ago',
  },
  {
    id: 'act-2',
    text: '+ ₹40 • 1 day ago',
    timestampLabel: '1 day ago',
  },
];

export const SEED_MONTHLY_EARNINGS: readonly MonthlyEarningPoint[] = [
  { month: 'Aug', amount: 2400 },
  { month: 'Sep', amount: 3100 },
  { month: 'Oct', amount: 3600 },
  { month: 'Nov', amount: 4000 },
  { month: 'Dec', amount: 4800 },
];

export const SEED_DAILY_EARNINGS: readonly DailyEarningBar[] = [
  { label: 'Aug 1', amount: 1200 },
  { label: 'Aug 15', amount: 1800 },
  { label: 'Aug 31', amount: 1800 },
];

export const INITIAL_STORE_STATE: ParkEaseStoreState = {
  spaces: SEED_SPACES,
  bookings: SEED_BOOKINGS,
  seekerBookingIds: SEED_SEEKER_BOOKING_IDS,
  favoriteSpaceIds: ['s1'],
  providerStats: SEED_PROVIDER_STATS,
  recentActivity: SEED_RECENT_ACTIVITY,
  monthlyEarnings: SEED_MONTHLY_EARNINGS,
  dailyEarnings: SEED_DAILY_EARNINGS,
  bookingCounter: 2510247, // First generated booking will be #PE2510247
};

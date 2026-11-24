; ============================================================
; AI-IR v1.0 | Compiled from: "# ParkEase — Academic Prototype Specification (Strict TypeSc..."
; Source tokens: ~3,600 (est.) | IR tokens: ~6,500 (est.)
; Compilation confidence: MEDIUM
; ============================================================

@GOAL {
  Build a complete, client-only, strict-TypeScript React prototype of ParkEase, a peer-to-peer
  residential parking-sharing platform for Bengaluru. It has a mobile-framed Seeker app and a
  desktop Provider portal. Both share live state through localStorage on one device (same tab,
  or two side-by-side windows). A presenter control bar drives it, and it must support the
  90-second VTU demo runbook.
  priority: P0
  type: create
}

@INPUTS {
  product_name      : string = "ParkEase" [EXPLICIT]
  tagline           : string = "Find a space. Park with ease. Earn from your space." [EXPLICIT]
  locale            : string = "Bengaluru, India"; currency = INR (₹) [EXPLICIT]
  fallback_location : coordinates = {lat: 12.9716, lng: 77.5946} [EXPLICIT]
  toolchain         : list(string) = ["Vite react-ts", "React 19", "Tailwind CSS v4 + @tailwindcss/vite",
                      "lucide-react"] [EXPLICIT]
  map_options       : list(string) = ["Leaflet + @types/leaflet", "typed interactive SVG street map"] [EXPLICIT]
  tsconfig_flags    : list(string) = ["strict: true", "noUncheckedIndexedAccess: true",
                      "noImplicitAny: true"] [EXPLICIT]
  domain_types      : spec = §2 verbatim [EXPLICIT]
    ; VehicleType = 'Car'|'Scooty'|'Bike'
    ; BookingStatus = 'Pending'|'Confirmed'|'Rejected'|'Cancelled'|'Completed'
    ; Coordinates{lat,lng}; ParkingDimensionsFt{length,width}
    ; ParkingSpace{id,title,address,coordinates,distanceMeters,walkMinutes,dimensionsFt,
    ;   supportedVehicles,hourlyRateInr,rating,reviewCount,imageUrl,availabilityWindow,isActive}
    ; Booking{id,spaceId,spaceTitle,vehicleType,durationHours,totalPriceInr,scheduleLabel,
    ;   requestedAtLabel,status}; all fields readonly; file: src/types/parkease.ts
  seed_spaces       : list(partial ParkingSpace) [EXPLICIT]   ; file: src/data/seedData.ts
    s1: "Green View Parking"               | 350 m  | 5 min  | 10×15 ft | [Car, Scooty]    | ₹30/hr | ★4.5 (120)
    s2: "Indiranagar 5th Cross Driveway"   | 550 m  | 7 min  | 6×10 ft  | [Scooty, Bike]   | ₹15/hr | ★4.7 (64)
    s3: "Koramangala Apartment Bay"        | 850 m  | 11 min | 11×18 ft | [Car, Scooty]    | ₹45/hr | ★4.6 (92)
    s4: "Jayanagar Covered Porch"          | 1.1 km | 14 min | 9×14 ft  | [Car, Scooty]    | ₹25/hr | ★4.4 (41)
  seed_provider     : structured(key-value) [EXPLICIT]
    login            : email = rohan.blr@parkease.in (password pre-filled); display_name = Rohan
    kpis             : total_bookings = 12 (blue tint); total_earnings = ₹4,800 (green tint);
                       upcoming = 3 (amber tint)
    growth_badge     : "↑ 20%"
    monthly_line     : x-axis Aug..Dec, green line
    earnings_bars    : x-axis "Aug 1", "Aug 15", "Aug 31", green vertical bars; filter dropdown "This Month"
    recent_activity  : ["+ ₹80 • 2 hrs ago", "+ ₹40 • 1 day ago"]
    pending_requests : ["Car Booking Request — 2 hrs • ₹80 • Requested at: 3:20 PM",
                        "Scooty Booking — 1 hr • ₹15 • Tomorrow, 10 AM"]
  design_tokens     : structured(key-value) [EXPLICIT]
    primary #1E6B43 | mint #E8F5EE | provider_sidebar #1E3A5F | card #FFFFFF | canvas #F8FAFC
    text #0F172A | muted #64748B | danger #DC2626
    font: Inter; tabular-nums on distances, dimensions, ₹ amounts
  demo_runbook      : list(step) = §7 (0:00–0:30 Seeker; 0:30–1:10 Provider; 1:10–1:30 Reset) [EXPLICIT]
  audience          : string = "VTU classroom evaluation, single device, ~5 minutes" [EXPLICIT]
}

@OUTPUTS {
  app : application(vite_react_ts_spa) [EXPLICIT]
    destination: new project directory [DEFAULT]
    mandated_files: [src/types/parkease.ts, src/data/seedData.ts] [EXPLICIT]
    source_extensions: .ts/.tsx only; zero .js/.jsx [EXPLICIT]

  presenter_bar : component(floating_top_bar, outside_app_viewport, discreet) [EXPLICIT]
    mode_switcher: "Parking Seeker App (Mobile View)" | "Parking Provider Portal (Dashboard View)"
    shortcuts: "Seeker Map" (skips splash/login), "Provider Dashboard" (skips login), "Reset Demo Data"

  seeker_app : component(mobile_frame) [EXPLICIT]
    frame: 390×844 px, rounded corners, centered on desktop; full-width on mobile devices
    bottom_nav: 3 tabs Home | Bookings | Profile, shown on main screens
    S1_splash:
      green map-pin icon containing white "P"; bold "ParkEase" wordmark; tagline;
      full-width solid green "Get Started"; outlined "Login"
    S2_location_prompt:
      darkened map background + native-style dialog
      "Allow ParkEase to access your location? This helps us show you nearby parking spaces."
      buttons "Do Not Allow" | "Allow"
      Allow → navigator.geolocation.getCurrentPosition; on denial/unavailability → fallback coordinates
    S3_map_view:
      header: hamburger icon, centered ParkEase pin logo, notification bell
      search: floating rounded white input "Search nearby..."
      filter_pills: typed VehicleType 'All'|'Car'|'Scooty'|'Bike'
      map: light-gray + green-park street map; blue pulsing dot (user); green circular "P" markers
      preview_card: floating above bottom nav; updates and highlights on pin tap; thumbnail, name
        (default "Green View Parking"), "350 m • ₹30/hr", "★ 4.5"; tapping opens S4
    S4_details:
      photo banner + back arrow + favorite heart; title; "★ 4.5 (120 reviews)"; "350 m • 5 min";
      "10 × 15 ft • Car/Scooty"; bold green "₹30 / hour"
      duration pills: "1 hr" | "2 hrs" (default, solid green) | "3 hrs" | "Custom" numeric input
      live "Total Price: ₹60"; full-width green "Book Now" at bottom
    S5_confirmation:
      large green circle + white check; bold "Booking Confirmed!";
      "Your parking space is booked for [X] hours."; light-gray card with Booking ID (e.g. #PE2510247);
      solid green "View Booking"; outlined "Get Directions"
    S6_my_bookings:
      segmented tabs "Current" | "Past"; card: thumbnail, title, "350 m • ₹30/hr",
      schedule "Today, 4:00 PM – 6:00 PM", green "Confirmed" or "Pending" badge,
      red-outlined "Cancel", "View Details"

  provider_portal : component(responsive_split_dashboard, sidebar_collapsible_on_narrow) [EXPLICIT]
    sidebar: #1E3A5F, "ParkEase" branding, links Dashboard | My Listings | Bookings | Earnings | Profile | Logout
    P1_login:
      split card: driveway photo left; "ParkEase Provider Login" right; Email pre-filled
      rohan.blr@parkease.in; Password pre-filled; green "Login" → Dashboard immediately
    P2_dashboard:
      "Welcome back, Rohan! Here is your overview"; 3 KPI cards (see seed_provider);
      Total Earnings updates dynamically on accept; monthly green line chart Aug–Dec + "↑ 20%" badge
    P3_add_space_wizard:
      stepper "1 Details" (active green) | "2 Photos" | "3 Pricing"
      step1: photo preview thumbnail + dashed "+ Add Photos" box (select preset driveway photo);
             Location input (placeholder "e.g. 5th Cross, Bengaluru"); Dimensions (L × W) two numeric
             inputs in ft; Vehicle Type checkboxes Car|Scooty|Bike; "Cancel" | "Next"
      steps2-3: availability window selector (default "08:00 AM – 08:00 PM"); hourly rate input (₹/hr)
      submit: validate typed payload; publish new ParkingSpace to localStorage; appears on Seeker map
    P4_manage_bookings:
      request cards: vehicle photo or icon; title; "2 hrs • ₹80 • Requested at: 3:20 PM" /
      "1 hr • ₹15 • Tomorrow, 10 AM"; solid green "Accept"; red-outlined "Reject"
      Accept → update BookingStatus in Seeker "My Bookings" + add amount to Total Earnings
    P5_earnings:
      "Earnings Overview" card; "This Month" dropdown; large "₹4,800" + "↑ 20%" badge;
      green vertical bar chart (Aug 1 / Aug 15 / Aug 31); "Recent Activity" feed

  shared_infra : [useLocalStorage<T> hook, typed store/actions, seed loader, formatters,
                  discriminated-union navigation state, typed validators] [EXPLICIT/INFERRED]
}

@CONSTRAINTS {
  - Client-side only; Vite react-ts, React 19, Tailwind v4 (@tailwindcss/vite), lucide-react [EXPLICIT]
  - tsconfig: strict, noUncheckedIndexedAccess, noImplicitAny all true [EXPLICIT]
  - Every component, hook, store, and seed in .ts/.tsx; explicit interfaces and discriminated unions [EXPLICIT]
  - Zero `any`; zero plain JavaScript files [EXPLICIT]
  - Domain models match §2 exactly, shared across both UIs [EXPLICIT]
  - Generic type-safe useLocalStorage<T> validates and stores spaces, booking requests,
    confirmed bookings, provider earnings [EXPLICIT]
  - Subscribe to window 'storage' events [EXPLICIT]
  - Seeker/Provider toggle in one tab shares state instantly [EXPLICIT]
  - Two windows side-by-side on one laptop update each other in real time, no backend [EXPLICIT]
  - Presenter bar floats outside the app viewport [EXPLICIT]
  - Seeker frame 390×844 on desktop, full-width on mobile [EXPLICIT]
  - Provider layout collapsible on narrow viewports [EXPLICIT]
  - Geolocation falls back to 12.9716° N, 77.5946° E [EXPLICIT]
  - Initialize storage with seed data on first load [EXPLICIT]
  - Palette and typography per design_tokens [EXPLICIT]
  - Wizard submission validates the typed payload before publishing [EXPLICIT]
  - Runbook path completes within 90 seconds [EXPLICIT]
}

@GUARD {
  - No backend servers [EXPLICIT]
  - No external databases [EXPLICIT]
  - No paid third-party map API keys [EXPLICIT]
  - No overly complex infrastructure [EXPLICIT]
  - No `any`, `as any`, or `@ts-ignore` to bypass strictness [INFERRED]
    ; because the zero-`any` rule would otherwise be defeated
  - No production auth, payments, or security hardening [INFERRED]
    ; because the spec declares an academic "forever-prototype"
}

@ASSUMPTIONS {
  - Book Now creates a booking with status 'Pending'. Screen S5 still shows the mandated
    "Booking Confirmed!" copy. Provider Accept → 'Confirmed'; Reject → 'Rejected'.
    ; because §4.6 allows a Pending badge and §5.4 says Accept updates the Seeker's status, while §4.5
    ; mandates the "Confirmed" heading [AMBIGUOUS]
    ; alternative: create as 'Confirmed' immediately and treat Accept as cosmetic
  - "Booking requests" and "confirmed bookings" are one Booking[] collection discriminated by status
    ; because Booking.status already encodes the distinction; separate arrays would duplicate state [AMBIGUOUS]
  - §2 interfaces are implemented verbatim. Extra data (earnings ledger, monthly series, provider stats,
    seekerBookingIds index) lives in additional types, not as new fields on Booking/ParkingSpace.
    seekerBookingIds keeps provider-seeded requests out of the Seeker's "My Bookings".
    ; because the spec requires "exact" structures and Booking has no seeker/provider id [INFERRED]
  - Rohan owns all four seed listings and any wizard-created listing
    ; because ParkingSpace has no owner field and one demo provider exists [INFERRED]
  - Screens with no specified behavior get minimal defaults: provider "My Listings" = listing cards with
    an isActive toggle; both "Profile" screens = static demo identity cards; Seeker "Login" = same path as
    "Get Started"; hamburger and bell = inert visuals; "View Details" = modal/bottom sheet of booking fields;
    "View Booking" = Bookings tab (Current); back arrow on S4 = Map [DEFAULT]
  - Seed coordinates are synthetic, positioned around the fallback center so haversine distances equal
    350/550/850/1100 m; addresses use real neighbourhood names
    ; because the seed omits coordinates, and real Indiranagar/Koramangala/Jayanagar positions lie
    ; km away from 12.9716, 77.5946, contradicting the stated distances [INFERRED]
  - walkMinutes = ceil(distanceMeters / 80) for computed values
    ; because all four seed rows satisfy it (350→5, 550→7, 850→11, 1100→14) [INFERRED]
  - Map engine = typed interactive SVG street map
    ; because tile-based Leaflet needs internet during a classroom demo; SVG is deterministic and offline
    [AMBIGUOUS]
    ; alternative: leaflet + @types/leaflet (+ react-leaflet@5 for React 19) with keyless tiles
  - Wizard-created listing coordinates: keyword lookup of known Bengaluru neighbourhoods in the Location
    text, else a deterministic offset from the fallback center; distanceMeters via haversine from the
    active user location
    ; because geocoding is unavailable and the pin must appear on the Seeker map immediately [INFERRED]
  - Wizard-derived fields: title = "<Location> Parking"; address = Location; rating = 0; reviewCount = 0
    (rendered "New"); isActive = true; generated id; imageUrl = selected preset
    ; because the wizard collects no title or rating [INFERRED]
  - Wizard mapping: step 1 = details + selected-photo thumbnail; step 2 = preset driveway gallery;
    step 3 = availability window + hourly rate + publish
    ; because §5.3 assigns the availability and rate controls jointly to "Steps 2 and 3" [AMBIGUOUS]
  - Parking Details gains a compact vehicle selector limited to supportedVehicles, defaulting to the
    active filter pill (unless 'All'), else the first supported vehicle
    ; because Booking.vehicleType is required and §4.4 provides no selector [INFERRED]
  - totalPriceInr = hourlyRateInr × durationHours (2 × ₹30 = ₹60 verified); presets 1/2/3 with 2 selected;
    Custom = positive integer 1–24 [DEFAULT]
  - Schedule label: start = next full hour, formatted "Today, 4:00 PM – 6:00 PM"; requestedAtLabel =
    current local time; availabilityWindow is not enforced against bookings
    ; because no time picker exists in §4.4 [DEFAULT]
  - Booking ID: "#PE" + 7-digit sequential counter seeded so the first booking after Reset is exactly
    #PE2510247, then increments
    ; because the runbook expects #PE2510247 while §4.5 says "generated" [AMBIGUOUS]
  - Provider seeded requests are stored literally and sorted newest-first so a Seeker-created request
    appears at the top. Price is not forced to rate × hours: ₹80/2 hrs = ₹40/hr matches no seed rate,
    while ₹15/hr matches Indiranagar [INFERRED]
  - Accept: Total Earnings += amount [EXPLICIT]; Total Bookings and Upcoming each +1 [INFERRED];
    Reject changes no counters
  - Seeker "Cancel" → 'Cancelled', moved to Past. If the booking was 'Confirmed', earnings are decremented
    and an activity entry is appended. Current = Pending|Confirmed; Past = Completed|Cancelled|Rejected.
    No automatic 'Completed' transition, so ≥2 'Completed' seed bookings populate Past [DEFAULT]
  - Charts use the literal spec labels (Aug–Dec line; Aug 1/15/31 bars under "This Month"), not
    calendar-derived. "↑ 20%" is static. Seed series ends at ₹4,800 with prior point ₹4,000 so +20% is
    arithmetically consistent [INFERRED]
  - Recent Activity: two seeded rows; Accept prepends "+ ₹N • just now". Relative labels are stored
    strings [INFERRED]
  - useLocalStorage<T>(key, initial, isValid: (v: unknown) => v is T): JSON.parse narrowed via unknown;
    invalid or corrupt data reseeds; keys namespaced `parkease:v1:*`; same-tab updates propagate through
    useSyncExternalStore or a custom event, because 'storage' does not fire in the writing tab;
    handles event.key === null; setter applies functional updates to the latest persisted value;
    snapshots referentially stable
    ; because React 19 + strict typing + two-window concurrency require these guarantees [INFERRED]
  - Per-tab UI state (mode, screen, selected space, filter, geolocation result, provider session) is
    not persisted in shared localStorage
    ; because side-by-side windows must hold different modes simultaneously [INFERRED]
  - Reset Demo Data re-seeds all `parkease:v1:*` keys (propagating to the other window) and returns the
    current tab to that mode's start screen [INFERRED]
  - Shortcuts bypass splash/permission/login. The Seeker shortcut uses fallback coordinates without
    prompting; the Provider shortcut sets the logged-in flag [INFERRED]
  - Geolocation: browser prompt follows the in-app dialog on "Allow" (double prompt); ~5 s timeout;
    denial, error, or insecure context → fallback; "Do Not Allow" → fallback and proceed to Map.
    A granted position outside a Bengaluru bounding box is replaced by the fallback center
    ; because listings are anchored to Bengaluru [AMBIGUOUS]
  - Search = case-insensitive substring on title+address, ANDed with the vehicle filter
    (supportedVehicles.includes). Seed result: Scooty → 4, Car → 3, Bike → 1 (Indiranagar) [DEFAULT]
  - Tooling conformance: strict flags applied to tsconfig.app.json and tsconfig.node.json, mirrored in
    root tsconfig.json; template eslint.config.js removed or converted to .ts; Tailwind v4 CSS-first
    (@import "tailwindcss" + @theme), no tailwind.config.js; vite.config.ts
    ; because the Vite react-ts template ships JS config files and split tsconfigs [DEFAULT]
  - Font = Inter via a bundled npm font package with a system sans-serif fallback
    ; because remote font hosts may be unreachable in class [DEFAULT]
  - Charts = hand-rolled typed SVG components; no charting dependency [DEFAULT]
  - Images (imageUrl, wizard presets, login photo) = bundled local assets or inline SVG/data-URI driveway
    illustrations; no remote images
    ; because the prototype must work offline [DEFAULT]
  - Provider login: password is demo-only; fields are editable, Login performs no credential check;
    Logout returns to the login screen and clears only the provider session flag [DEFAULT]
  - "Get Directions" opens https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng> with
    noopener (no API key); offline fallback = toast [AMBIGUOUS]
  - Favorite heart toggles a persisted visual flag per space [DEFAULT]
  - KPI tints: blue and amber hex values chosen by the implementer; green = mint #E8F5EE [DEFAULT]
  - Seeker bottom nav hidden on Splash, Location Prompt, Details, Confirmation; Home tab = Map; active
    filter pills = mint fill + green text; duration selected = solid green [INFERRED]
}

@CONTEXT {
  domain: frontend-engineering, React 19, strict TypeScript, localStorage-based multi-window sync, civic-tech UX
  prior_state: greenfield; no repository exists
  environment: Node + Vite; browser demo on one laptop; connectivity during demo unknown
  evaluation: VTU classroom; presentation-driven, so deterministic seed state and fast reset matter more
              than production concerns
}

@PLAN {
  step[0]: @SUBTASK(scaffold_and_config) {
    @GOAL { Scaffold Vite react-ts; install tailwindcss, @tailwindcss/vite, lucide-react; conform configs }
    @PLAN {
      step[0a]: Create project; set strict flags in all tsconfig files
      step[0b]: Replace JS configs (eslint.config.js) with .ts or remove; configure Tailwind v4 CSS-first
      step[0c]: Define @theme tokens for the palette; bundle font; set tabular-nums utility
    }
  }
  step[1]: @SUBTASK(types_and_seed) {
    @GOAL { Write src/types/parkease.ts verbatim; auxiliary types; src/data/seedData.ts }
    depends_on: step[0]
    @PLAN {
      step[1a]: Domain interfaces + auxiliary types (EarningsEntry, MonthlyPoint, ProviderStats, StoreState)
      step[1b]: Four listings with synthetic coordinates matching stated distances; presets; seeded
                bookings, activity, and monthly series
      step[1c]: Type guards (isParkingSpace, isBooking, isStoreState) over unknown
    }
  }
  step[2]: @SUBTASK(state_layer) {
    @GOAL { useLocalStorage<T>, cross-tab and same-tab sync, typed actions, id generator, reset }
    depends_on: step[1]
    @PLAN {
      step[2a]: Generic hook with validation, versioned keys, storage listener, key === null handling
      step[2b]: Actions: createBooking, acceptBooking, rejectBooking, cancelBooking, publishSpace, resetDemo
      step[2c]: Discriminated unions: Mode, SeekerScreen, ProviderScreen, GeoStatus, DurationSelection,
                Result<T,E> for validators
    }
  }
  step[3]: @SUBTASK(design_system_and_primitives) {
    @GOAL { Buttons, pills, badges, cards, stepper, KPI card, SVG line/bar charts, map-pin "P" icon, formatters }
    depends_on: step[0], step[1]
  }
  step[4]: @SUBTASK(shell_and_presenter_bar) {
    @GOAL { App shell, presenter bar, mode switcher, shortcuts, Reset, per-tab routing }
    depends_on: step[2], step[3]
  }
  step[5]: @SUBTASK(seeker_app) {
    @GOAL { Screens S1–S6, bottom nav, geolocation flow, SVG map, filters, booking creation }
    depends_on: step[4]   ; parallelizable with step[6]
  }
  step[6]: @SUBTASK(provider_portal) {
    @GOAL { Screens P1–P5, My Listings, Profile, sidebar collapse, wizard validation, accept/reject }
    depends_on: step[4]   ; parallelizable with step[5]
  }
  step[7]: Cross-session verification — same-tab toggle, two-window sync, wizard-published space appears,
           Accept updates the Seeker tab and earnings, Reset propagates
    depends_on: step[5], step[6]
  step[8]: Conformance and rehearsal — tsc -b, vite build, grep for `any`/.js, time the §7 runbook (≤ 90 s)
    depends_on: step[7]
}

@QUALITY {
  - tsc -b reports zero errors under the three mandated flags [EXPLICIT]
  - Zero `any` and zero .js/.jsx source files, verified by search [EXPLICIT]
  - vite build succeeds [DEFAULT]
  - Runbook completes ≤ 90 s: Scooty/Car filter → Green View → 2 hrs (₹60) → Book Now shows
    #PE2510247 → Provider shows ₹4,800 → Accept → live increment → Add Space wizard → Reset [EXPLICIT]
  - Two-window sync is visible without reload; target < 1 s [INFERRED]
  - Literal copy, amounts, IDs, and palette hex values match the spec [EXPLICIT]
  - Every named screen and button is reachable; no dead ends [INFERRED]
  - Layout honors 390×844 frame, full-width mobile, and sidebar collapse [EXPLICIT]
  - Reset restores deterministic seed state and is idempotent [INFERRED]
  - Geolocation denial, timeout, and insecure context all land on the Bengaluru fallback [EXPLICIT]
  - No console errors or unhandled storage exceptions (quota, corrupt JSON) [DEFAULT]
}

@UNKNOWNS {
  - Map engine: SVG or Leaflet? ; impacts: @ASSUMPTIONS, @PLAN step[5]
  - Should the confirmation screen reflect 'Pending' semantics, or should bookings be created
    'Confirmed'? ; impacts: step[2b], S5, S6, P4
  - Will internet be available during the demo? ; impacts: font choice, map engine, Get Directions
  - Contents of seeded Seeker bookings (Current/Past)? ; impacts: step[1b], S6
  - Seed values for the Aug–Dec series and the three bars? ; impacts: P2, P5
  - Which listing do seeded requests belong to, and is the ₹80 price intentional? ; impacts: step[1b], P4
  - Behavior of My Listings, Profile screens, hamburger, bell, "View Details"? ; impacts: step[5], step[6]
  - Should Cancel of a confirmed booking reverse earnings? ; impacts: step[2b], P2, P5
  - Minimum window width for side-by-side mode and the sidebar-collapse breakpoint? ; impacts: step[4], step[6]
  - Inter or Plus Jakarta Sans? ; impacts: step[0c]
  - Deliverable format (repository, zip, run instructions) and any test requirement? ; impacts: step[8]
  - Should bookings be validated against availabilityWindow? ; impacts: S4, step[2b]
  - Should the new wizard listing accept free-text Location only, or a neighbourhood picker for
    reliable pin placement? ; impacts: P3, step[1], step[2b]
}

@META {
  source_prompt_hash: unavailable (source not materialized on disk; hash not computed)
  compiled_by: claude-sonnet-5-5
  compiled_at: 2026-11-24T15:40:07Z
  ir_version: 1.0
  token_ratio: ~0.55 (est.)
}

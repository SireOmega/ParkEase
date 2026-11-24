import React, { useState } from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { DRIVEWAY_PRESETS } from '../../data/seedData';
import { deriveCoordinatesForLocation } from '../../utils/geo';
import { Check, ArrowRight, ArrowLeft, Image as ImageIcon, MapPin, CheckCircle2 } from 'lucide-react';
import type { VehicleType } from '../../types/parkease';

type StepNumber = 1 | 2 | 3;

export const AddSpaceWizardScreen: React.FC = () => {
  const { publishSpace, setProviderScreen } = useParkEase();

  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Step 1: Details
  const [location, setLocation] = useState('5th Cross, Indiranagar, Bengaluru');
  const [lengthFt, setLengthFt] = useState<number>(16);
  const [widthFt, setWidthFt] = useState<number>(10);
  const [vehicles, setVehicles] = useState<readonly VehicleType[]>(['Car', 'Scooty']);

  // Step 2: Photo Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>(DRIVEWAY_PRESETS[0].id);

  // Step 3: Pricing & Availability
  const [availability, setAvailability] = useState('08:00 AM – 08:00 PM');
  const [hourlyRate, setHourlyRate] = useState<number>(35);

  const toggleVehicle = (v: VehicleType) => {
    if (vehicles.includes(v)) {
      if (vehicles.length > 1) {
        setVehicles(vehicles.filter((item) => item !== v));
      }
    } else {
      setVehicles([...vehicles, v]);
    }
  };

  const selectedPreset =
    DRIVEWAY_PRESETS.find((p) => p.id === selectedPresetId) ?? DRIVEWAY_PRESETS[0];

  const handleNext = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const coords = deriveCoordinatesForLocation(location);
    const title = `${location.split(',')[0]?.trim() || 'Residential'} Parking`;

    publishSpace({
      title,
      address: location,
      coordinates: coords,
      dimensionsFt: { length: lengthFt, width: widthFt },
      supportedVehicles: vehicles,
      hourlyRateInr: hourlyRate,
      availabilityWindow: availability,
      imageUrl: selectedPreset.dataUri,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setProviderScreen('listings');
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-[#1E6B43] text-white flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Parking Space Published!</h2>
        <p className="mt-1 text-xs text-slate-500">
          Your space is now active and immediately discoverable on the Seeker map.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Add New Parking Space</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          List your residential parking spot and start earning from commuters in Bengaluru.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/90 flex items-center justify-between">
        {[
          { step: 1, label: '1 Details' },
          { step: 2, label: '2 Photos' },
          { step: 3, label: '3 Pricing' },
        ].map(({ step, label }) => {
          const isActive = currentStep === step;
          const isDone = currentStep > step;

          return (
            <div
              key={step}
              className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-[#E8F5EE] text-[#1E6B43] border border-[#A7F3D0]'
                  : isDone
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              {isDone && <Check className="w-3.5 h-3.5" />}
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Step Forms */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        {/* Step 1: Details */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Location Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 5th Cross, Bengaluru"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6B43]/50"
                />
              </div>
            </div>

            {/* Dimensions (L × W) in ft */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Dimensions (Length × Width in Feet)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Length (ft):</span>
                  <input
                    type="number"
                    min={4}
                    max={40}
                    value={lengthFt}
                    onChange={(e) => setLengthFt(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Width (ft):</span>
                  <input
                    type="number"
                    min={4}
                    max={30}
                    value={widthFt}
                    onChange={(e) => setWidthFt(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Type Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Supported Vehicle Types
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Car', 'Scooty', 'Bike'] as const).map((v) => {
                  const isChecked = vehicles.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVehicle(v)}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-[#E8F5EE] border-[#1E6B43] text-[#1E6B43]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{v}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center ${
                          isChecked ? 'bg-[#1E6B43] text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Photo Preview Box */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Selected Photo Preview
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={selectedPreset.dataUri}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#1E6B43] text-slate-500 hover:text-[#1E6B43] text-xs font-semibold flex items-center gap-2 transition"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>+ Change or Select Driveway Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photos Gallery */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Select Driveway Photo Preset</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose a verified high-resolution illustration that matches your driveway.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DRIVEWAY_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition p-2.5 flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#1E6B43] bg-[#E8F5EE]/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="h-32 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={preset.dataUri}
                        alt={preset.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-900">{preset.title}</span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E6B43] text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Availability */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Availability Window
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6B43]/50 bg-white"
              >
                <option value="08:00 AM – 08:00 PM">08:00 AM – 08:00 PM (Standard Day)</option>
                <option value="06:00 AM – 11:00 PM">06:00 AM – 11:00 PM (Extended)</option>
                <option value="24 Hours">24 Hours (Full Access)</option>
                <option value="09:00 AM – 06:00 PM">09:00 AM – 06:00 PM (Office Hours)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Hourly Rate (₹ / hour)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center font-bold text-slate-500">
                  ₹
                </span>
                <input
                  type="number"
                  min={10}
                  max={200}
                  step={5}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6B43]/50"
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-800">Publish Summary:</p>
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <span className="font-semibold text-slate-900">{location}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vehicles:</span>
                <span className="font-semibold text-slate-900">{vehicles.join(', ')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Rate:</span>
                <span className="font-bold text-[#1E6B43]">₹{hourlyRate} / hr</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Bottom Button Controls */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setProviderScreen('dashboard')}
              className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="py-3 px-6 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <span>Publish Parking Space</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

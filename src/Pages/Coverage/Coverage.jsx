// src/components/Coverage/Coverage.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLoaderData } from 'react-router';
import {
    FaSearch,
    FaMapMarkerAlt,
    FaGlobeAsia,
    FaBuilding,
    FaExpand,
    FaLocationArrow,
    FaPhone,
    FaChevronDown,
    FaInfoCircle,
    FaTimes,
    FaCheckCircle,
    FaFilter,
    FaCrosshairs,
    FaPlus,
    FaMinus,
    FaCompress,
    FaMapPin
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';

// ============ CONSTANTS ============
const BANGLADESH_CENTER = { lat: 23.6850, lng: 90.3563 };
const DEFAULT_ZOOM = 7;
const MARKER_ZOOM = 12;

const REGION_COLORS = {
    'Dhaka': '#3B82F6',
    'Chattogram': '#10B981',
    'Sylhet': '#8B5CF6',
    'Rangpur': '#F59E0B',
    'Khulna': '#EF4444',
    'Rajshahi': '#EC4899',
    'Barisal': '#06B6D4',
    'Mymensingh': '#84CC16'
};

const PHONE_NUMBERS = {
    'Dhaka': '+880 1234 567890',
    'Chattogram': '+880 1234 567891',
    'Sylhet': '+880 1234 567892',
    'Khulna': '+880 1234 567893',
    'Rajshahi': '+880 1234 567894',
    'Barisal': '+880 1234 567895',
    'Rangpur': '+880 1234 567896',
    'Mymensingh': '+880 1234 567897'
};

// ============ HELPER COMPONENTS ============
const AreaBadges = ({ areas, limit = 3 }) => (
    <>
        {areas.slice(0, limit).map(area => (
            <span key={area} className="badge badge-sm badge-outline">
                {area}
            </span>
        ))}
        {areas.length > limit && (
            <span className="badge badge-sm">
                +{areas.length - limit} more
            </span>
        )}
    </>
);

const StatCard = ({ label, value }) => (
    <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
        <div className="card-body p-4 text-center">
            <div className="text-3xl font-bold text-primary">{value}</div>
            <div className="text-sm font-semibold text-base-content/70 capitalize">
                {label}
            </div>
        </div>
    </div>
);

// ============ MAIN COMPONENT ============
const Coverage = () => {
    // ============ DATA LOADING ============
    const warehouses = useLoaderData();

    // ============ REFS ============
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const leafletLoadedRef = useRef(false);

    // ============ STATE ============
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

    // Map State
    const [mapReady, setMapReady] = useState(false);
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const [center, setCenter] = useState(BANGLADESH_CENTER);
    const [userLocation, setUserLocation] = useState(null);

    // ============ MEMOIZED VALUES ============
    const regions = useMemo(() =>
        ['All', ...new Set(warehouses.map(wh => wh.region))],
        [warehouses]
    );

    const filteredWarehouses = useMemo(() =>
        warehouses.filter(warehouse => {
            const matchesSearch = searchTerm === '' ||
                warehouse.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warehouse.covered_area.some(area =>
                    area.toLowerCase().includes(searchTerm.toLowerCase())
                );
            const matchesRegion = selectedRegion === 'All' || warehouse.region === selectedRegion;
            return matchesSearch && matchesRegion;
        }),
        [warehouses, searchTerm, selectedRegion]
    );

    const districtStats = useMemo(() => ({
        total: warehouses.length,
        active: warehouses.filter(w => w.status === 'active').length,
        regions: regions.length - 1,
        coverage: '64 districts'
    }), [warehouses, regions]);

    // ============ HELPER FUNCTIONS ============
    const getRegionColor = useCallback((region) =>
        REGION_COLORS[region] || '#6B7280',
        []
    );

    const getContactNumber = useCallback((region) =>
        PHONE_NUMBERS[region] || '+880 1234 567899',
        []
    );

    // ============ MAP FUNCTIONS ============
    const createMarkerIcon = useCallback((color) => {
        if (!window.L) return null;
        return window.L.divIcon({
            html: `
                <div style="
                    background: ${color};
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                </div>
            `,
            className: 'custom-marker',
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28]
        });
    }, []);

    const createPopupContent = useCallback((warehouse) => `
        <div style="min-width: 220px; padding: 8px;">
            <h3 style="font-weight: bold; font-size: 16px; margin: 0 0 4px 0; color: #333;">
                ${warehouse.district}
            </h3>
            <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">
                ${warehouse.city}, ${warehouse.region}
            </p>
            <p style="font-size: 12px; font-weight: bold; margin: 0 0 4px 0; color: #555;">
                Covered Areas:
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                ${warehouse.covered_area.slice(0, 3).map(area =>
        `<span style="background: #f1f1f1; padding: 2px 8px; border-radius: 12px; font-size: 11px; color: #333;">${area}</span>`
    ).join('')}
                ${warehouse.covered_area.length > 3 ?
            `<span style="background: #f1f1f1; padding: 2px 8px; border-radius: 12px; font-size: 11px; color: #333;">+${warehouse.covered_area.length - 3} more</span>` : ''
        }
            </div>
            <p style="font-size: 12px; margin: 0 0 4px 0;">
                <strong>Phone:</strong> ${getContactNumber(warehouse.region)}
            </p>
            <span style="background: #10b981; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; display: inline-block;">
                Active Branch
            </span>
        </div>
    `, [getContactNumber]);

    const clearMarkers = useCallback(() => {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (userMarkerRef.current) {
            userMarkerRef.current.remove();
            userMarkerRef.current = null;
        }
    }, []);

    const updateMarkers = useCallback(() => {
        const map = mapInstanceRef.current;
        if (!map || !window.L || !mapReady) return;

        clearMarkers();

        filteredWarehouses.forEach(warehouse => {
            const color = getRegionColor(warehouse.region);
            const icon = createMarkerIcon(color);

            if (!icon) return;

            const marker = window.L.marker([warehouse.latitude, warehouse.longitude], { icon })
                .addTo(map)
                .bindPopup(createPopupContent(warehouse));

            marker.on('click', () => {
                setSelectedDistrict(warehouse);
            });

            markersRef.current.push(marker);
        });
    }, [filteredWarehouses, mapReady, getRegionColor, createMarkerIcon, createPopupContent, clearMarkers]);

    const initMap = useCallback(() => {
        if (!mapRef.current || mapInstanceRef.current || !window.L) return;

        try {
            const L = window.L;

            // Clear container
            mapRef.current.innerHTML = '';

            const mapInstance = L.map(mapRef.current, {
                fadeAnimation: false,
                zoomAnimation: false
            }).setView([BANGLADESH_CENTER.lat, BANGLADESH_CENTER.lng], DEFAULT_ZOOM);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(mapInstance);

            mapInstance.on('zoomend', () => {
                setZoom(mapInstance.getZoom());
            });

            mapInstance.on('moveend', () => {
                const center = mapInstance.getCenter();
                setCenter({ lat: center.lat, lng: center.lng });
            });

            mapInstanceRef.current = mapInstance;
            setMapReady(true);
            setZoom(DEFAULT_ZOOM);

        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }, []);

    // ============ EVENT HANDLERS ============
    const handleDistrictClick = useCallback((warehouse) => {
        setSelectedDistrict(prev => prev?.district === warehouse.district ? null : warehouse);

        const map = mapInstanceRef.current;
        if (map) {
            map.flyTo([warehouse.latitude, warehouse.longitude], MARKER_ZOOM, {
                duration: 1.5
            });

            // Open popup for the clicked marker
            const marker = markersRef.current.find(m =>
                m.getLatLng().lat === warehouse.latitude &&
                m.getLatLng().lng === warehouse.longitude
            );
            if (marker) {
                marker.openPopup();
            }
        }
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedDistrict(null);
        setHoveredDistrict(null);

        // Close any open popups
        if (mapInstanceRef.current) {
            mapInstanceRef.current.closePopup();
        }
    }, []);

    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedRegion('All');
        clearSelection();

        const map = mapInstanceRef.current;
        if (map) {
            map.flyTo([BANGLADESH_CENTER.lat, BANGLADESH_CENTER.lng], DEFAULT_ZOOM, {
                duration: 1.5
            });
            map.closePopup();
        }
    }, [clearSelection]);

    const findUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                setUserLocation(userPos);

                const map = mapInstanceRef.current;
                if (map && window.L) {
                    map.flyTo([userPos.lat, userPos.lng], 14, { duration: 2 });

                    // Remove existing user marker
                    if (userMarkerRef.current) {
                        userMarkerRef.current.remove();
                    }

                    const userIcon = window.L.divIcon({
                        html: `
                            <div style="
                                background: #4285F4;
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                border: 4px solid white;
                                box-shadow: 0 0 0 2px #4285F4;
                            "></div>
                        `,
                        className: 'user-location-marker',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });

                    userMarkerRef.current = window.L.marker([userPos.lat, userPos.lng], { icon: userIcon })
                        .addTo(map)
                        .bindPopup('Your location')
                        .openPopup();
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enable location services.');
            }
        );
    }, []);

    const zoomIn = useCallback(() => {
        mapInstanceRef.current?.zoomIn();
    }, []);

    const zoomOut = useCallback(() => {
        mapInstanceRef.current?.zoomOut();
    }, []);

    const resetView = useCallback(() => {
        mapInstanceRef.current?.flyTo(
            [BANGLADESH_CENTER.lat, BANGLADESH_CENTER.lng],
            DEFAULT_ZOOM,
            { duration: 1.5 }
        );
        mapInstanceRef.current?.closePopup();
        clearSelection();
    }, [clearSelection]);

    // ============ EFFECTS ============
    // Load Leaflet and initialize map
    useEffect(() => {
        if (leafletLoadedRef.current) return;

        const loadLeaflet = async () => {
            if (typeof window.L === 'undefined') {
                // Load CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                // Load JS
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                    script.crossOrigin = '';
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }

            leafletLoadedRef.current = true;

            // Small delay to ensure DOM is ready
            setTimeout(initMap, 100);
        };

        loadLeaflet();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }
            setMapReady(false);
            leafletLoadedRef.current = false;
        };
    }, [initMap]);

    // Update markers when data changes
    useEffect(() => {
        if (mapReady) {
            updateMarkers();
        }
    }, [mapReady, updateMarkers]);

    // Center map on selected district and open popup
    useEffect(() => {
        if (selectedDistrict && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(
                [selectedDistrict.latitude, selectedDistrict.longitude],
                MARKER_ZOOM,
                { duration: 1.5 }
            );

            // Find and open the corresponding marker's popup
            const marker = markersRef.current.find(m =>
                m.getLatLng().lat === selectedDistrict.latitude &&
                m.getLatLng().lng === selectedDistrict.longitude
            );
            if (marker) {
                setTimeout(() => {
                    marker.openPopup();
                }, 1500); // Open popup after flyTo completes
            }
        }
    }, [selectedDistrict]);

    // ============ RENDER ============
    return (
        <div className={`min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 md:p-6 ${isMapFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
            {isMapFullscreen && (
                <button
                    onClick={() => setIsMapFullscreen(false)}
                    className="fixed top-4 right-4 z-[1000] btn btn-primary btn-sm shadow-lg"
                >
                    <FaCompress className="mr-2" />
                    Exit Fullscreen
                </button>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        We are available in <span className="text-secondary">64 districts</span>
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
                        Find our branches and warehouses across Bangladesh. Search by district, city, or area to find the nearest location to you.
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {Object.entries(districtStats).map(([key, value]) => (
                        <StatCard
                            key={key}
                            label={key === 'coverage' ? 'National Coverage' : key}
                            value={value}
                        />
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Search Box */}
                        <div className="card bg-base-100 shadow-lg border border-base-300">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="card-title text-lg flex items-center gap-2">
                                        <FaSearch className="text-primary" />
                                        Find Your Location
                                    </h3>
                                    <button
                                        onClick={resetFilters}
                                        className="btn btn-xs btn-ghost"
                                        aria-label="Clear all filters"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search district, city, or area..."
                                        className="input input-bordered w-full pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Search locations"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm text-base-content/70">
                                        Showing {filteredWarehouses.length} of {warehouses.length} districts
                                    </span>
                                    <button
                                        onClick={findUserLocation}
                                        className="btn btn-xs btn-outline gap-1"
                                        aria-label="Find nearby locations"
                                    >
                                        <FaCrosshairs />
                                        Near Me
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Region Filter */}
                        <div className="card bg-base-100 shadow-lg border border-base-300">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="card-title text-lg flex items-center gap-2">
                                        <FaFilter className="text-primary" />
                                        Filter by Region
                                    </h3>
                                    <button
                                        onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                                        className="btn btn-sm btn-ghost"
                                        aria-label="Toggle region dropdown"
                                    >
                                        <FaChevronDown className={`transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <button
                                        onClick={() => setSelectedRegion('All')}
                                        className={`btn btn-sm ${selectedRegion === 'All' ? 'btn-primary text-black' : 'btn-outline'}`}
                                        aria-label="Show all regions"
                                    >
                                        All Regions
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showRegionDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-base-300">
                                                {regions.slice(1).map(region => (
                                                    <button
                                                        key={region}
                                                        onClick={() => {
                                                            setSelectedRegion(region);
                                                            setShowRegionDropdown(false);
                                                        }}
                                                        className={`btn btn-sm ${selectedRegion === region ? 'btn-primary text-black' : 'btn-outline'}`}
                                                        aria-label={`Filter by ${region} region`}
                                                    >
                                                        {region}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* District List */}
                        <div className="card bg-base-100 shadow-lg border border-base-300">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="card-title text-lg flex items-center gap-2">
                                        <FaBuilding className="text-primary" />
                                        Available Districts
                                    </h3>
                                    <span className="badge text-black badge-primary">{filteredWarehouses.length}</span>
                                </div>
                                <div className="overflow-y-auto max-h-96 pr-2">
                                    {filteredWarehouses.length === 0 ? (
                                        <div className="text-center py-8 text-base-content/70">
                                            <FaInfoCircle className="text-3xl mx-auto mb-2" />
                                            <p>No districts found matching your search</p>
                                            <button
                                                onClick={resetFilters}
                                                className="btn btn-link btn-sm mt-2"
                                                aria-label="Reset filters"
                                            >
                                                Reset filters
                                            </button>
                                        </div>
                                    ) : (
                                        filteredWarehouses.map(warehouse => (
                                            <div
                                                key={warehouse.district}
                                                onClick={() => handleDistrictClick(warehouse)}
                                                onMouseEnter={() => setHoveredDistrict(warehouse)}
                                                onMouseLeave={() => setHoveredDistrict(null)}
                                                className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-300 ${selectedDistrict?.district === warehouse.district
                                                        ? 'bg-primary/20 border-l-4 border-primary scale-[1.02]'
                                                        : hoveredDistrict?.district === warehouse.district
                                                            ? 'bg-base-300 border-l-2 border-primary/50'
                                                            : 'bg-base-200 hover:bg-base-300'
                                                    }`}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Select ${warehouse.district} district`}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleDistrictClick(warehouse);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-semibold">{warehouse.district}</h4>
                                                        <p className="text-sm text-base-content/70">
                                                            {warehouse.city} • {warehouse.region}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: getRegionColor(warehouse.region) }}
                                                            aria-label={`${warehouse.region} region color`}
                                                        />
                                                        <FaMapMarkerAlt className="text-primary" />
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    <AreaBadges areas={warehouse.covered_area} limit={2} />
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-sm">
                                                    <FaPhone className="text-xs text-primary" />
                                                    <span className="font-semibold">{getContactNumber(warehouse.region)}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Map */}
                    <div className="lg:col-span-2">
                        <div className="card bg-base-100 shadow-lg border border-base-300 h-full">
                            <div className="card-body p-4 h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="card-title text-lg flex items-center gap-2">
                                        <FaGlobeAsia className="text-primary" />
                                        Bangladesh Coverage Map
                                        <span className="text-sm font-normal text-base-content/70 ml-2">
                                            (Interactive OpenStreetMap)
                                        </span>
                                    </h3>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-base-content/70">Zoom: {zoom}x</span>
                                        </div>
                                        <button
                                            onClick={resetView}
                                            className="btn btn-sm btn-outline"
                                            aria-label="Reset map view"
                                        >
                                            Reset View
                                        </button>
                                        <button
                                            onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                                            className="btn btn-sm btn-outline"
                                            aria-label={isMapFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                                        >
                                            {isMapFullscreen ? <FaCompress /> : <FaExpand />}
                                        </button>
                                    </div>
                                </div>

                                {/* Map Container */}
                                <div className="relative rounded-lg overflow-hidden border border-base-300">
                                    <div
                                        ref={mapRef}
                                        style={{ height: '500px', width: '100%' }}
                                        className="leaflet-map"
                                        aria-label="Interactive map showing warehouse locations"
                                    />

                                    {/* Map Controls */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
                                        <button
                                            onClick={zoomIn}
                                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border border-base-300 shadow-md"
                                            aria-label="Zoom in"
                                        >
                                            <FaPlus />
                                        </button>
                                        <button
                                            onClick={zoomOut}
                                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border border-base-300 shadow-md"
                                            aria-label="Zoom out"
                                        >
                                            <FaMinus />
                                        </button>
                                        <div className="h-px bg-base-300 my-1"></div>
                                        <button
                                            onClick={findUserLocation}
                                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border border-base-300 shadow-md"
                                            aria-label="Find my location"
                                            title="Find my location"
                                        >
                                            <FaLocationArrow />
                                        </button>
                                    </div>

                                    {/* Coordinates Display */}
                                    <div className="absolute bottom-4 left-4 bg-base-100/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-base-300 z-[400]">
                                        <div className="text-xs font-mono">
                                            <div>Lat: {center.lat.toFixed(4)}</div>
                                            <div>Lng: {center.lng.toFixed(4)}</div>
                                            <div>Zoom: {zoom}x</div>
                                        </div>
                                    </div>

                                    {/* Filter Status */}
                                    <div className="absolute top-4 left-4 bg-base-100/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-base-300 z-[400] max-w-xs">
                                        <div className="text-sm">
                                            <div className="font-semibold">Active Filters:</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {searchTerm && (
                                                    <span className="badge badge-sm">
                                                        Search: {searchTerm}
                                                    </span>
                                                )}
                                                {selectedRegion !== 'All' && (
                                                    <span className="badge badge-sm badge-primary">
                                                        Region: {selectedRegion}
                                                    </span>
                                                )}
                                                <span className="badge badge-sm badge-secondary">
                                                    {filteredWarehouses.length} districts
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="absolute bottom-4 right-20 bg-base-100/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-base-300 z-[400]">
                                        <div className="text-xs">
                                            <div className="font-semibold mb-1">Map Legend:</div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                <span>Dhaka Region</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span>Chattogram Region</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapPin className="text-purple-500" />
                                                <span>Other Regions</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="mt-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold">Features:</span>
                                            <div className="flex items-center gap-2">
                                                <FaPlus className="text-xs" />
                                                <FaMinus className="text-xs" />
                                                <span>Zoom in/out</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaLocationArrow className="text-xs" />
                                                <span>Find your location</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-xs" />
                                                <span>Click markers for details</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-base-content/70">
                                            Powered by OpenStreetMap • Drag to pan
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card bg-base-100 shadow-lg border border-base-300"
                >
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">How to Use This Interactive Map</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { icon: FaSearch, title: 'Search & Filter', desc: 'Type to search or filter by region to update map markers instantly' },
                                { icon: FaLocationArrow, title: 'Find Location', desc: 'Click "Near Me" to find branches closest to your current location' },
                                { icon: FaPlus, title: 'Zoom Controls', desc: 'Use +/- buttons to zoom in/out on the map', dualIcon: true },
                                { icon: FaMapMarkerAlt, title: 'Interactive Markers', desc: 'Click on any marker to see branch details and contact information' }
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                        {item.dualIcon ? (
                                            <>
                                                <FaPlus className="text-primary" />
                                                <FaMinus className="text-primary" />
                                            </>
                                        ) : (
                                            <item.icon className="text-primary" />
                                        )}
                                    </div>
                                    <h4 className="font-semibold mb-1">{item.title}</h4>
                                    <p className="text-sm text-base-content/70">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Coverage;
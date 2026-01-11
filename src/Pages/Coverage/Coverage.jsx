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

// We'll create a simple map without react-leaflet to avoid dependency issues
const Coverage = () => {
    const warehouses = useLoaderData();
    const mapRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [map, setMap] = useState(null);
    const [zoom, setZoom] = useState(7);
    const [center, setCenter] = useState({ lat: 23.6850, lng: 90.3563 });
    const [userLocation, setUserLocation] = useState(null);
    const [markers, setMarkers] = useState([]);

    // Extract unique regions
    const regions = ['All', ...new Set(warehouses.map(wh => wh.region))];

    // Filter warehouses based on search and region
    const filteredWarehouses = useMemo(() => {
        return warehouses.filter(warehouse => {
            const matchesSearch = searchTerm === '' ||
                warehouse.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warehouse.covered_area.some(area =>
                    area.toLowerCase().includes(searchTerm.toLowerCase())
                );
            const matchesRegion = selectedRegion === 'All' || warehouse.region === selectedRegion;
            return matchesSearch && matchesRegion;
        });
    }, [warehouses, searchTerm, selectedRegion]);

    // District statistics
    const districtStats = {
        total: warehouses.length,
        active: warehouses.filter(w => w.status === 'active').length,
        regions: regions.length - 1,
        coverage: '64 districts'
    };

    // Get contact number for a district
    const getContactNumber = (region) => {
        const phoneNumbers = {
            'Dhaka': '+880 1234 567890',
            'Chattogram': '+880 1234 567891',
            'Sylhet': '+880 1234 567892',
            'Khulna': '+880 1234 567893',
            'Rajshahi': '+880 1234 567894',
            'Barisal': '+880 1234 567895',
            'Rangpur': '+880 1234 567896',
            'Mymensingh': '+880 1234 567897'
        };
        return phoneNumbers[region] || '+880 1234 567899';
    };

    // Get region color
    const getRegionColor = (region) => {
        const colors = {
            'Dhaka': '#3B82F6',
            'Chattogram': '#10B981',
            'Sylhet': '#8B5CF6',
            'Rangpur': '#F59E0B',
            'Khulna': '#EF4444',
            'Rajshahi': '#EC4899',
            'Barisal': '#06B6D4',
            'Mymensingh': '#84CC16'
        };
        return colors[region] || '#6B7280';
    };

    // Initialize Leaflet map
    const initMap = useCallback(() => {
        if (!mapRef.current || map) return;

        // Check if Leaflet is available
        if (typeof window.L === 'undefined') {
            console.error('Leaflet is not loaded. Please check the Leaflet CSS and JS are included.');
            return;
        }

        try {
            const leaflet = window.L;

            // Create map instance
            const mapInstance = leaflet.map(mapRef.current).setView([center.lat, center.lng], zoom);

            // Add OpenStreetMap tiles
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</Link> contributors',
                maxZoom: 19,
            }).addTo(mapInstance);

            // Store map instance
            setMap(mapInstance);

            // Add event listeners
            mapInstance.on('zoomend', () => {
                setZoom(mapInstance.getZoom());
            });

            mapInstance.on('moveend', () => {
                const center = mapInstance.getCenter();
                setCenter({ lat: center.lat, lng: center.lng });
            });

        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }, [center.lat, center.lng, zoom, map]);

    // Update markers on map
    const updateMarkers = useCallback(() => {
        if (!map) return;

        // Clear existing markers
        markers.forEach(marker => marker.removeFrom(map));
        const newMarkers = [];

        // Add markers for filtered warehouses
        filteredWarehouses.forEach(warehouse => {
            try {
                const leaflet = window.L;
                if (!leaflet) return;

                const color = getRegionColor(warehouse.region);

                // Create custom marker icon
                const icon = leaflet.divIcon({
                    html: `
                        <div style="
                            background: ${color};
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                        ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="white" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>
                        </div>
                    `,
                    className: 'custom-marker',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24]
                });

                // Create marker
                const marker = leaflet.marker([warehouse.latitude, warehouse.longitude], { icon })
                    .addTo(map)
                    .bindPopup(`
                        <div style="min-width: 200px; padding: 8px;">
                            <h3 style="font-weight: bold; font-size: 16px; margin: 0 0 4px 0;">${warehouse.district}</h3>
                            <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">${warehouse.city}, ${warehouse.region}</p>
                            <p style="font-size: 12px; font-weight: bold; margin: 0 0 4px 0;">Covered Areas:</p>
                            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                                ${warehouse.covered_area.slice(0, 3).map(area =>
                        `<span style="background: #f1f1f1; padding: 2px 6px; border-radius: 10px; font-size: 11px;">${area}</span>`
                    ).join('')}
                                ${warehouse.covered_area.length > 3 ?
                            `<span style="background: #f1f1f1; padding: 2px 6px; border-radius: 10px; font-size: 11px;">+${warehouse.covered_area.length - 3} more</span>` : ''
                        }
                            </div>
                            <p style="font-size: 12px; margin: 0 0 4px 0;">
                                <strong>Phone:</strong> ${getContactNumber(warehouse.region)}
                            </p>
                            <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold;">
                                Active
                            </span>
                        </div>
                    `);

                // Add click handler
                marker.on('click', () => {
                    handleDistrictClick(warehouse);
                });

                newMarkers.push(marker);

            } catch (error) {
                console.error('Error creating marker:', error);
            }
        });

        setMarkers(newMarkers);
    }, [map, filteredWarehouses]);

    // Handle district click
    const handleDistrictClick = useCallback((warehouse) => {
        setSelectedDistrict(selectedDistrict?.district === warehouse.district ? null : warehouse);

        if (map) {
            map.flyTo([warehouse.latitude, warehouse.longitude], 12);
        }
    }, [map, selectedDistrict]);

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedDistrict(null);
        setHoveredDistrict(null);
    }, []);

    // Reset filters
    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedRegion('All');
        clearSelection();

        if (map) {
            map.flyTo([23.6850, 90.3563], 7);
        }
    }, [map, clearSelection]);

    // Find user location
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

                if (map) {
                    map.flyTo([userPos.lat, userPos.lng], 14);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enable location services.');
            }
        );
    }, [map]);

    // Zoom in
    const zoomIn = useCallback(() => {
        if (map) {
            map.zoomIn();
        }
    }, [map]);

    // Zoom out
    const zoomOut = useCallback(() => {
        if (map) {
            map.zoomOut();
        }
    }, [map]);

    // Initialize map on component mount
    useEffect(() => {
        initMap();

        // Load Leaflet JS dynamically if not loaded
        if (typeof window.L === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = initMap;
            document.head.appendChild(script);
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []);

    // Update markers when filtered warehouses change
    useEffect(() => {
        if (map) {
            updateMarkers();
        }
    }, [map, filteredWarehouses, updateMarkers]);

    // Center on selected district
    useEffect(() => {
        if (selectedDistrict && map) {
            map.flyTo([selectedDistrict.latitude, selectedDistrict.longitude], 12);
        }
    }, [selectedDistrict, map]);

    return (
        <div className={`min-h-screen bg-linear-to-br from-base-100 to-base-200 p-4 md:p-6 ${isMapFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Back button for fullscreen mode */}
            {isMapFullscreen && (
                <button
                    onClick={() => setIsMapFullscreen(false)}
                    className="absolute top-4 right-4 z-1000 btn btn-primary btn-sm"
                >
                    <FaCompress className="mr-1" />
                    Exit Fullscreen
                </button>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
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
                        <div key={key} className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
                            <div className="card-body p-4 text-center">
                                <div className="text-3xl font-bold text-primary">{value}</div>
                                <div className="text-sm font-semibold text-base-content/70 capitalize">
                                    {key === 'coverage' ? 'National Coverage' : key}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left Panel - Search and Filters */}
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
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                </div>

                                {/* Results Count */}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm text-base-content/70">
                                        Showing {filteredWarehouses.length} of {warehouses.length} districts
                                    </span>
                                    <button
                                        onClick={findUserLocation}
                                        className="btn btn-xs btn-outline"
                                    >
                                        <FaCrosshairs className="mr-1" />
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
                                    >
                                        <FaChevronDown className={`transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <button
                                        onClick={() => setSelectedRegion('All')}
                                        className={`btn btn-sm ${selectedRegion === 'All' ? 'btn-primary text-black' : 'btn-outline'}`}
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
                                                        ></div>
                                                        <FaMapMarkerAlt className="text-primary" />
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {warehouse.covered_area.slice(0, 2).map(area => (
                                                        <span key={area} className="badge badge-sm badge-outline">
                                                            {area}
                                                        </span>
                                                    ))}
                                                    {warehouse.covered_area.length > 2 && (
                                                        <span className="badge badge-sm">
                                                            +{warehouse.covered_area.length - 2} more
                                                        </span>
                                                    )}
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

                    {/* Right Panel - Leaflet Map */}
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
                                            onClick={() => {
                                                if (map) {
                                                    map.flyTo([23.6850, 90.3563], 7);
                                                }
                                            }}
                                            className="btn btn-sm btn-outline"
                                        >
                                            Reset View
                                        </button>
                                        <button
                                            onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                                            className="btn btn-sm btn-outline"
                                        >
                                            {isMapFullscreen ? <FaCompress /> : <FaExpand />}
                                        </button>
                                    </div>
                                </div>

                                {/* Leaflet Map Container */}
                                <div className="relative rounded-lg overflow-hidden border border-base-300">
                                    <div
                                        ref={mapRef}
                                        style={{ height: '500px', width: '100%' }}
                                        className="leaflet-map"
                                    />

                                    {/* Map Controls */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <button
                                            onClick={zoomIn}
                                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border border-base-300"
                                        >
                                            <FaPlus />
                                        </button>
                                        <button
                                            onClick={zoomOut}
                                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border border-base-300"
                                        >
                                            <FaMinus />
                                        </button>
                                        <div className="h-px bg-base-300 my-1"></div>
                                        <button
                                            onClick={findUserLocation}
                                            className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border border-base-300"
                                            title="Find my location"
                                        >
                                            <FaLocationArrow />
                                        </button>
                                    </div>

                                    {/* Coordinates Display */}
                                    <div className="absolute bottom-4 left-4 bg-base-100/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-base-300">
                                        <div className="text-xs font-mono">
                                            <div>Lat: {center.lat.toFixed(4)}</div>
                                            <div>Lng: {center.lng.toFixed(4)}</div>
                                            <div>Zoom: {zoom}x</div>
                                        </div>
                                    </div>

                                    {/* Filter Status */}
                                    <div className="absolute top-4 left-4 bg-base-100/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-base-300">
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

                                    {/* Selected District Info Overlay */}
                                    <AnimatePresence>
                                        {selectedDistrict && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="absolute top-20 left-4 bg-base-100/95 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-xs border border-base-300"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full"
                                                                style={{ backgroundColor: getRegionColor(selectedDistrict.region) }}
                                                            ></div>
                                                            <h4 className="font-bold text-lg">{selectedDistrict.district}</h4>
                                                        </div>
                                                        <p className="text-sm text-base-content/70 mb-2">
                                                            {selectedDistrict.city}, {selectedDistrict.region}
                                                        </p>
                                                        <div className="mb-3">
                                                            <p className="text-sm font-semibold mb-1">Covered Areas:</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {selectedDistrict.covered_area.slice(0, 4).map(area => (
                                                                    <span key={area} className="badge badge-sm">
                                                                        {area}
                                                                    </span>
                                                                ))}
                                                                {selectedDistrict.covered_area.length > 4 && (
                                                                    <span className="badge badge-sm">
                                                                        +{selectedDistrict.covered_area.length - 4} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FaPhone className="text-sm text-primary" />
                                                            <span className="text-sm font-semibold">{getContactNumber(selectedDistrict.region)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaCheckCircle className="text-success" />
                                                            <span className="text-sm font-semibold text-success">Active Branch</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={clearSelection}
                                                        className="btn btn-circle btn-xs btn-ghost ml-2"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Legend */}
                                    <div className="absolute bottom-4 right-20 bg-base-100/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-base-300">
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

                                {/* Map Instructions */}
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
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaSearch className="text-primary" />
                                </div>
                                <h4 className="font-semibold mb-1">Search & Filter</h4>
                                <p className="text-sm text-base-content/70">Type to search or filter by region to update map markers instantly</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaLocationArrow className="text-primary" />
                                </div>
                                <h4 className="font-semibold mb-1">Find Location</h4>
                                <p className="text-sm text-base-content/70">Click "Near Me" to find branches closest to your current location</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaPlus className="text-primary" />
                                    <FaMinus className="text-primary" />
                                </div>
                                <h4 className="font-semibold mb-1">Zoom Controls</h4>
                                <p className="text-sm text-base-content/70">Use +/- buttons to zoom in/out on the map</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaMapMarkerAlt className="text-primary" />
                                </div>
                                <h4 className="font-semibold mb-1">Interactive Markers</h4>
                                <p className="text-sm text-base-content/70">Click on any marker to see branch details and contact information</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Coverage;
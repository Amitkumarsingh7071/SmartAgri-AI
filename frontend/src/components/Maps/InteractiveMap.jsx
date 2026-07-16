import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon asset mapping issues
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom component to dynamically center map when coordinates change
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
};

const InteractiveMap = ({ farms, activeFarm }) => {
  // Default map center (e.g. Haryana/Delhi area coordinates)
  const defaultCenter = [28.6139, 77.2090];
  
  // Decide center coordinates
  let centerCoords = defaultCenter;
  if (activeFarm && activeFarm.latitude && activeFarm.longitude) {
    centerCoords = [activeFarm.latitude, activeFarm.longitude];
  } else if (farms && farms.length > 0 && farms[0].latitude && farms[0].longitude) {
    centerCoords = [farms[0].latitude, farms[0].longitude];
  }

  // Create a customized green leaf icon for agriculture nodes
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="w-full h-96 relative border border-gray-200/50 dark:border-gray-800/30 rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={centerCoords}
        zoom={activeFarm ? 13 : 8}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Add a dark mode filter to the tile layer if dark mode is active (handled nicely in CSS or left default)
        />
        
        <MapRecenter center={centerCoords} />

        {farms && farms.map((farm) => {
          if (!farm.latitude || !farm.longitude) return null;
          const isSelected = activeFarm && activeFarm._id === farm._id;
          
          return (
            <Marker
              key={farm._id}
              position={[farm.latitude, farm.longitude]}
              icon={greenIcon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 font-sans text-left">
                  <h4 className="font-extrabold text-sm text-green-700 dark:text-green-500 mb-1">{farm.name}</h4>
                  <p className="text-[10px] text-gray-500 mb-2">{farm.location}</p>
                  
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] border-t border-gray-100 pt-2">
                    <div>
                      <span className="text-gray-400 block uppercase font-semibold">Area Size</span>
                      <span className="font-bold">{farm.area} Acres</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-semibold">Water Source</span>
                      <span className="font-bold">{farm.waterSource}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-semibold">Soil Type</span>
                      <span className="font-bold">{farm.soilType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-semibold">Current Crop</span>
                      <span className="font-bold text-green-600">{farm.currentCrop || 'Fallow'}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;

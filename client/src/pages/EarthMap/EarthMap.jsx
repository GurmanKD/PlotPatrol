import { useState, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Box, Button, Switch, FormControlLabel, TextField } from '@mui/material';

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc',
    libraries: ['places']
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [enablePinning, setEnablePinning] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const initializeAutocomplete = () => {
    if (!searchInputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      {
        fields: ['formatted_address', 'geometry', 'name'],
      }
    );

    // Bind autocomplete to map bounds
    if (mapRef.current) {
      autocompleteRef.current.bindTo('bounds', mapRef.current);
    }

    // Handle place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();

      if (!place.geometry || !place.geometry.location) {
        alert('No details available for input: ' + place.name);
        return;
      }

      // Update map view
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setCurrentLocation(newLocation);
      
      // If viewport is available, use it
      if (place.geometry.viewport && mapRef.current) {
        mapRef.current.fitBounds(place.geometry.viewport);
      } else if (mapRef.current) {
        mapRef.current.setCenter(newLocation);
        mapRef.current.setZoom(17);
      }

      // Update search location text
      setSearchLocation(place.formatted_address);
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setCurrentLocation(newLocation);
          
          // Reverse geocoding to get address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newLocation }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setSearchLocation(results[0].formatted_address);
            }
          });
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleMapClick = (event) => {
    if (enablePinning && markers.length < 4) {
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { lat: event.latLng.lat(), lng: event.latLng.lng() },
      ]);
    }
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
    initializeAutocomplete();
  };

  const handleToggle = () => {
    setEnablePinning((prev) => !prev);
    if (!enablePinning) setMarkers([]); // Reset markers when disabling pinning
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <TextField
          inputRef={searchInputRef}
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          label="Search location"
          variant="outlined"
          size="small"
          sx={{ minWidth: '250px', flex: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button variant="contained" onClick={handleCurrentLocation}>
            Current Location
          </Button>
          <FormControlLabel
            control={<Switch checked={enablePinning} onChange={handleToggle} />}
            label="Enable Pinning"
          />
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={currentLocation || { lat: 37.7749, lng: -122.4194 }}
          zoom={currentLocation ? 15 : 12}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
        >
          {currentLocation && (
            <Marker 
              position={currentLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
            />
          )}
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default MapComponent;
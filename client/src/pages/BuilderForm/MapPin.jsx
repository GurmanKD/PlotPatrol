import { useState, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Box, Button, Switch, FormControlLabel, TextField, Stack } from '@mui/material';

const MapPinComp = ({markers, setMarkers,searchLocation, setSearchLocation}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc',
    libraries: ['places'],
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [enablePinning, setEnablePinning] = useState(false);
  


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

    if (mapRef.current) {
      autocompleteRef.current.bindTo('bounds', mapRef.current);
    }

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();

      if (!place.geometry || !place.geometry.location) {
        alert('No details available for input: ' + place.name);
        return;
      }

      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setCurrentLocation(newLocation);
      
      if (place.geometry.viewport && mapRef.current) {
        mapRef.current.fitBounds(place.geometry.viewport);
      } else if (mapRef.current) {
        mapRef.current.setCenter(newLocation);
        mapRef.current.setZoom(17);
      }

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
    if (enablePinning) setMarkers([]); 
    setEnablePinning(!enablePinning);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        py: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 2
      }}>
        <Stack direction="row" width="60%" alignItems="flex-end" gap={2}>

        <TextField
          inputRef={searchInputRef}
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          label="Search location"
          variant="standard"
          size="small"
          sx={{ width: "70%" }}
          />
          <Button variant="contained" onClick={handleCurrentLocation}>
            Current Location
          </Button>
          </Stack>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={<Switch checked={enablePinning} onChange={handleToggle} />}
            label="Enable Pinning"
          />
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: 450 }}
          center={currentLocation || { lat: 37.7749, lng: -122.4194 }}
          zoom={currentLocation ? 15 : 12}
          mapTypeId="satellite"
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

export default MapPinComp;
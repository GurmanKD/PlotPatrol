  import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, GroundOverlay } from '@react-google-maps/api';

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc',
  });


  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100vh' }}
      center={{ lat: 37.7749, lng: -122.4194 }}
      zoom={12}
    />
  );
};

export default MapComponent;

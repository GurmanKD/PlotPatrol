  import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, GroundOverlay } from '@react-google-maps/api';

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc',
  });

  const [imageUrl, setImageUrl] = useState('');
  const bounds = {
    north: 37.7749,
    south: 37.7740,
    east: -122.4194,
    west: -122.4200,
  };

  useEffect(() => {
    // Fetch the image URL from your backend
    fetch('/api/getSatelliteImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: 2020, bounds }),
    })
      .then((res) => res.json())
      .then((data) => setImageUrl(data.url));
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100vh' }}
      center={{ lat: 37.7749, lng: -122.4194 }}
      zoom={12}
    >
      {imageUrl && (
        <GroundOverlay
          url={imageUrl}
          bounds={bounds}
          opacity={0.8}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;

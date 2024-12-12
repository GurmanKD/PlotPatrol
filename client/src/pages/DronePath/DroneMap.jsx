import React, { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const MapWithMarkers = ({ locations }) => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  var bounds = new google.maps.LatLngBounds();
  useEffect(() => {
    if (locations.length === 0) return;

    const initMap = async () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: locations[0].lat, lng: locations[0].lng },
        zoom: 12,
      });

      const markers = locations.map((location, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: `Marker ${index + 1}`,
        });

        return marker;
      });

      setMarkers(markers);
map.fitBounds(bounds    )
      // Optionally, you can add a marker clusterer for better performance with many markers
      const markerCluster = new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      });

      return () => {
        markerCluster.clearMarkers();
      };
    };

    initMap();
  }, [locations]);

  useEffect(() => {
    const markersToRemove = markers.filter((marker) => !locations.some(({ lat, lng }) => marker.getPosition().lat() === lat && marker.getPosition().lng() === lng));
   
    markersToRemove.forEach((marker) => marker.setMap(null));

    const markersToAdd = locations.filter(({ lat, lng }) => !markers.some(marker => marker.getPosition().lat() === lat && marker.getPosition().lng() === lng));

    markersToAdd.forEach(({ lat, lng }) => {
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: `Marker ${markers.length + 1}`,
      });
      bounds.extend(newMarker.position);
      setMarkers([...markers, newMarker]);

    });
    // map.set
  }, [locations, markers]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default MapWithMarkers;
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PincodeMap = ({ pincode }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 11);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri',
      maxZoom: 19
    }).addTo(map);

    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.zIndex = '9999';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    fetch('/delhi-pincode.kml')
      .then(response => response.text())
      .then(kmlData => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlData, 'text/xml');
        
        // Convert KML to GeoJSON using a library like @mapbox/togeojson
        // For this example, we'll simulate the boundary
        const dummyBoundary = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [77.1, 28.5],
              [77.3, 28.5],
              [77.3, 28.7],
              [77.1, 28.7],
              [77.1, 28.5]
            ]]
          }
        };

        // Display boundary
        const polygon = L.geoJSON(dummyBoundary, {
          style: {
            color: '#000000',
            weight: 2,
            fillColor: '#FFFFFF',
            fillOpacity: 0.1
          }
        }).addTo(map);

        // Add mask for areas outside boundary
        const maskGeoJSON = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90]
                ]]
              }
            },
            dummyBoundary
          ]
        };

        L.geoJSON(maskGeoJSON, {
          style: {
            color: '#000000',
            fillColor: '#000000',
            fillOpacity: 0.7,
            weight: 0
          },
          interactive: false
        }).addTo(map);

        // Fit map to polygon bounds
        map.fitBounds(polygon.getBounds());

        // Generate and add drone path
        const coords = dummyBoundary.geometry.coordinates[0];
        generateDronePath(coords).forEach(line => {
          L.polyline(line, {
            color: 'red',
            weight: 2
          }).addTo(map);
        });
      });

    // Move tooltip with cursor
    map.on('mousemove', (e) => {
      tooltip.style.top = e.originalEvent.pageY + 15 + 'px';
      tooltip.style.left = e.originalEvent.pageX + 15 + 'px';
    });

    function generateDronePath(coordinates) {
      const pathCoordinates = [];
      const bounds = L.latLngBounds(
        coordinates.map(coord => [coord[1], coord[0]])
      );
      
      const south = bounds.getSouth();
      const north = bounds.getNorth();
      const step = (north - south) / 50;
      let isLeftSide = true;

      for (let lat = south; lat <= north; lat += step) {
        const line = [[lat, bounds.getWest()], [lat, bounds.getEast()]];
        pathCoordinates.push(line);

        // Add connecting vertical lines
        if (isLeftSide) {
          pathCoordinates.push([
            [lat, bounds.getWest()],
            [lat + step, bounds.getWest()]
          ]);
        }
        isLeftSide = !isLeftSide;
      }

      return pathCoordinates;
    }

    // Cleanup
    return () => {
      map.remove();
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    };
  }, [pincode]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default PincodeMap;
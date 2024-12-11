async function getPlacesInPincode(pincode, apiKey) {
  if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      throw new Error('Invalid pincode');
  }

  if (typeof google === 'undefined') {
      throw new Error('Google Maps JavaScript API is not loaded. Please ensure the API script is included in your HTML.');
  }

  const placesList = [];

  try {
      // Initialize Google Maps services
      const geocoder = new google.maps.Geocoder();
      const service = new google.maps.places.PlacesService(document.createElement('div'));

      // Get pincode area coordinates
      const geocodeResult = await new Promise((resolve, reject) => {
          geocoder.geocode(
              { address: `${pincode}, India` },
              (results, status) => {
                  if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                      resolve(results[0]);
                  } else {
                      reject(new Error(`Geocoding failed: ${status}`));
                  }
              }
          );
      });

      const bounds = geocodeResult.geometry.bounds ||
          new google.maps.LatLngBounds(
              geocodeResult.geometry.location,
              geocodeResult.geometry.location
          );

      // Define search types
      const searchTypes = ['school', 'hospital', 'commercial', 'industrial', 'corporate'];

      for (const type of searchTypes) {
          const places = await new Promise((resolve, reject) => {
              service.nearbySearch(
                  {
                      bounds: bounds,
                      type: type,
                  },
                  (results, status) => {
                      if (status === google.maps.places.PlacesServiceStatus.OK) {
                          resolve(results);
                      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                          resolve([]); // No results found
                      } else {
                          reject(new Error(`Places search failed: ${status}`));
                      }
                  }
              );
          });

          // Add found places to the list
          places.forEach(place => {
              placesList.push({
                  name: place.name,
                  type: ['commercial', 'industrial', 'corporate'].includes(type) ? 'commercial' : type,
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
              });
          });
      }

      return placesList;

  } catch (error) {
      throw new Error(`Failed to fetch places: ${error.message}`);
  }
}

export { getPlacesInPincode };

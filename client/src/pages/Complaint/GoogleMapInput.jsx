import React, { useEffect, useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const mapsKey = "AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc";

const GoogleMapInput = ({ onChange, onUseCurrentLocation, onPlaceSelected }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [location, setLocation] = useState(""); // State for managing TextField value

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.749933, lng: -73.98633 },
        zoom: 13,
        mapTypeControl: false,
      });
      setMap(mapInstance);

      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["formatted_address", "geometry", "name"],
        }
      );
      setAutocomplete(autocompleteInstance);

      autocompleteInstance.bindTo("bounds", mapInstance);

      const marker = new window.google.maps.Marker({
        map: mapInstance,
        anchorPoint: new window.google.maps.Point(0, -29),
      });

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();

        if (!place.geometry || !place.geometry.location) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        if (place.geometry.viewport) {
          mapInstance.fitBounds(place.geometry.viewport);
        } else {
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        const returnObj = {
          coords: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          address: place.formatted_address,
        };

        if (place.formatted_address) {
          setLocation(place.formatted_address); // Update TextField value
          handleChange(returnObj);
          onPlaceSelected && onPlaceSelected(place);
        }
      });
    };

    loadGoogleMapsScript();
  }, []);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = new window.google.maps.LatLng(latitude, longitude);
        map.setCenter(currentLocation);
        map.setZoom(15);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: currentLocation }, (results, status) => {
          if (status === "OK" && results[0]) {
            setLocation(results[0].formatted_address); // Update TextField value
            const returnObj = {
              coords: { lat: latitude, lng: longitude },
              address: results[0].formatted_address,
            };
            handleChange(returnObj);
            onUseCurrentLocation && onUseCurrentLocation(results[0]);
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        });
      });
    }
  };

  const handleChange = (obj) => {
    onChange && onChange(obj);
  };

  return (
    <Box
      sx={{ my: 2,p: 2, pb: 3, }}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <TextField
        inputRef={inputRef}
        name="location"
        label="Search for a location"
        variant="standard"
        sx={{ alignSelf: "flex-start", width: "80%" }}
        size="small"
        value={location} // Controlled TextField value
        onChange={(e) => setLocation(e.target.value)} // Update state on user input
      />

      {/* Use Current Location Button */}
      <Button
        sx={{ alignSelf: "flex-start", width: "50%" }}
        onClick={handleUseCurrentLocation}
        variant="contained"
        color="primary"
      >
        Use Current Location
      </Button>

      {/* Map */}
      <Box
        ref={mapRef}
        sx={{
          width: "100%",
          border: "2px solid var(--primary-color)",
          height: 450,
          backgroundColor: "grey.200",
          borderRadius: 1,
        }}
      />
    </Box>
  );
};

export default GoogleMapInput;

import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  School,
  LocalHospital,
  Factory,
  Delete,
  LocationOn,
  ZoomIn,
} from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Wrapper } from "@googlemaps/react-wrapper";

const MapComponent = ({ onMapLoad, onClick, center, zoom, marker }) => {
  const ref = React.useRef(null);
  const [map, setMap] = useState(null);

  React.useEffect(() => {
    if (ref.current && !map) {
      const mapInstance = new window.google.maps.Map(ref.current, {
        center: center || { lat: 30.3515154, lng: 76.3624647 },
        zoom: zoom || 17,
        mapTypeId: "satellite",
      });

      if (onClick) {
        mapInstance.addListener("click", (event) => {
          onClick(event.latLng, mapInstance);
        });
      }

      setMap(mapInstance);
      onMapLoad(mapInstance);
    }
  }, [ref, map, onMapLoad, onClick, center, zoom]);

  React.useEffect(() => {
    if (map && center) {
      map.setCenter(center);
      map.setZoom(zoom || 17);
    }
  }, [map, center, zoom]);

  React.useEffect(() => {
    if (map && marker) {
      new window.google.maps.Marker({
        position: marker,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#ff0000",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    }
  }, [map, marker]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
};

const MapAreaLock = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [places, setPlaces] = useState({
    schools: [],
    hospitals: [],
    industries: [],
  });
  const [satelliteImage, setSatelliteImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setSelectedPlace] = useState(null);
  const [miniMapCenter, setMiniMapCenter] = useState(null);

  const handleMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const addMarker = useCallback(
    (location, mapInstance) => {
      if (markers.length >= 4) {
        setError("Maximum 4 points allowed");
        return;
      }

      const marker = new window.google.maps.Marker({
        position: location,
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#1976d2",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      setMarkers((prev) => [...prev, marker]);
    },
    [markers]
  );

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    if (polygon) polygon.setMap(null);
    setMarkers([]);
    setPolygon(null);
    setSatelliteImage("");
    setPlaces({ schools: [], hospitals: [], industries: [] });
    setError("");
    setSelectedPlace(null);
    setMiniMapCenter(null);
  };

  const showPlaceOnMap = (place) => {
    setSelectedPlace(place);
    setMiniMapCenter(place.geometry.location);
  };

  const getStaticMapUrl = (bounds) => {
    // const ne = bounds.getNorthEast();
    // const sw = bounds.getSouthWest();
    const center = bounds.getCenter();

    // Create path string for polygon
    const pathPoints = markers
      .map((marker) => {
        const pos = marker.getPosition();
        return `${pos.lat()},${pos.lng()}`;
      })
      .join("|");

    return (
      `https://maps.googleapis.com/maps/api/staticmap?` +
      `center=${center.lat()},${center.lng()}&` +
      `zoom=18&` +
      `size=800x600&` +
      `maptype=satellite&` +
      `path=color:0x1976d2|weight:3|${pathPoints}&` +
      `key=AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc&libraries=places`
    );
  };

  const lockArea = async () => {
    if (markers.length < 3) {
      setError("Please add at least 3 markers to create an area");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (polygon) polygon.setMap(null);

      const newPolygon = new window.google.maps.Polygon({
        paths: markers.map((marker) => marker.getPosition()),
        strokeColor: "#1976d2",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#1976d2",
        fillOpacity: 0.35,
      });

      newPolygon.setMap(map);
      setPolygon(newPolygon);

      // Calculate bounds
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.getPosition()));

      // Get static map image of the area
      const imageUrl = getStaticMapUrl(bounds);
      setSatelliteImage(imageUrl);

      await fetchPlaces(bounds);
    } catch (err) {
      setError("Error locking area: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async (bounds) => {
    if (!map || !window.google) {
      setError("Google Maps not initialized");
      return;
    }

	console.log(google.maps);
    const service = new window.google.maps.places.PlacesService(map);
    const placeTypes = ["school", "hospital", "industrial"];
    const newPlaces = { schools: [], hospitals: [], industries: [] };

    try {
      await Promise.all(
        placeTypes.map((type) =>
          new Promise((resolve) => {
            service.nearbySearch(
              {
                bounds: bounds,
                type: type,
              },
              (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                  const category = type + "s";
                  newPlaces[category] = results.map((place) => ({
                    name: place.name,
                    location: place.geometry.location,
                    placeData: place,
                  }));
                }
                resolve();
              }
            );
          })
        )
      );

      setPlaces(newPlaces);
    } catch (error) {
      setError("Error fetching places: " + error.message);
    }
  };

  const PlacesList = ({ title, items, icon }) => (
    <Box mb={2}>
      <Typography variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <List dense>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
              primary={item.name}
              secondary={`${item.location.lat().toFixed(6)}, ${item.location
                .lng()
                .toFixed(6)}`}
            />

            <Tooltip title="View on Map">
              <IconButton
                onClick={() => showPlaceOnMap(item.placeData)}
                sx={{
                  border: "2px solid var(--primary-color)",
                  color: "var(--primary-color)",
                  mx: 1,
                }}
                size="small"
              >
                <ZoomIn fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Flag">
              <IconButton
                color="success"
                size="small"
                sx={{ border: "2px solid", mx: 1 }}
                onClick={() => handleApproval(index)}
              >
                <DoneIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Halt">
              <IconButton
                color="error"
                size="small"
                sx={{ border: "2px solid", mx: 1 }}
                onClick={() => handleDisapproval(index)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
        {items.length === 0 && (
          <ListItem>
            <ListItemText secondary="No places found" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  const render = (status) => {
    if (status === "LOADING") return <CircularProgress />;
    if (status === "FAILURE")
      return <Alert severity="error">Error loading Google Maps</Alert>;
    return null;
  };

  return (
      <Box p={2}>
        <Typography variant="h3" color="primary.main" sx={{fontWeight:600, mb: 2 }}>
          Building Detection
        </Typography>

        <Box mb={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={lockArea}
            startIcon={<LocationOn />}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Lock Area"}
          </Button>
          <Button
            variant="outlined"
            onClick={clearMarkers}
            startIcon={<Delete />}
            disabled={loading}
          >
            Clear
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ mb: 4 }}>
          <Box
            id="map-container"
            sx={{ height: 500, width: "100%", borderRadius: 1 }}
          >
            <Wrapper
              apiKey="AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc"
              render={render}
              libraries={["places"]}
            >
              <MapComponent onMapLoad={handleMapLoad} onClick={addMarker} />
            </Wrapper>
          </Box>
        </Paper>

        {satelliteImage && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Captured Area
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              image={satelliteImage}
              alt="Captured Area"
              sx={{ height: 400 }}
            />
          </Card>
        )}

        <Grid container spacing={3}>
          {/* Places List */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ p: 3, height: "600px", overflowY: "auto" }}
            >
              <Typography variant="h5" gutterBottom>
                Flagged Commercial Places
              </Typography>

              <PlacesList
                title="Schools"
                items={places.schools}
                icon={<School color="primary" />}
              />

              <PlacesList
                title="Hospitals"
                items={places.hospitals}
                icon={<LocalHospital color="primary" />}
              />

              <PlacesList
                title="Industries"
                items={places.industries}
                icon={<Factory color="primary" />}
              />
            </Paper>
          </Grid>

          {/* Mini Map */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: "600px" }}>
              <Typography variant="h5" gutterBottom>
                Location Preview
              </Typography>
              <Box sx={{ height: "calc(100% - 40px)" }}>
                <Wrapper
                  apiKey="AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc"
                  render={render}
                  libraries={["places"]}
                >
                  <MapComponent
                    onMapLoad={() => {}}
                    center={miniMapCenter}
                    zoom={19}
                    marker={miniMapCenter}
                  />
                </Wrapper>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
};

export default MapAreaLock;

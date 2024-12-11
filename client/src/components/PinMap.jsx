import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-omnivore";
import "./Map.css";

const PinMap = ({ showFormModal }) => {
  useEffect(() => {
    const map = L.map("map").setView([28.6139, 77.2090], 11); // Delhi center

    // Add a tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // Add tooltip
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    document.body.appendChild(tooltip);

    // Load KML file
    omnivore
      .kml("/delhi-pincode.kml")
      .on("ready", function (e) {
        const layer = e.target;
        const boundaryGeoJSON = layer.toGeoJSON();

        // Boundary Layer
        L.geoJson(boundaryGeoJSON, {
          style: {
            color: "#000000",
            weight: 2,
            fillColor: "#FFFFFF",
            fillOpacity: 1,
          },
        }).addTo(map);

        const bounds = L.geoJson(boundaryGeoJSON).getBounds();
        map.fitBounds(bounds);
      })
      .on("error", (e) => console.error("Error loading KML:", e))
      .addTo(map);

    // Interactions
    function highlightFeature(e) {
      const layer = e.target;
      layer.setStyle({ weight: 3, color: "#666" });
      const { NAME, PINCODE } = layer.feature.properties || {};
      tooltip.innerHTML = `Area: ${NAME || "Unknown"}<br>PIN Code: ${PINCODE || "Unknown"}`;
      tooltip.style.display = "block";
    }

    function resetHighlight(e) {
      const layer = e.target;
      layer.setStyle({ weight: 2, color: "white" });
      tooltip.style.display = "none";
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: () => {
          const { PINCODE } = feature.properties || {};
          showFormModal(PINCODE);
        },
      });
    }

    omnivore
      .kml("/delhi-pincode.kml")
      .on("ready", function (e) {
        const geojson = L.geoJson(e.target.toGeoJSON(), {
          style: () => ({
            fillColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            weight: 2,
            color: "white",
            fillOpacity: 0.7,
          }),
          onEachFeature,
        }).addTo(map);
      });

    // Update tooltip position based on mousemove
    map.on("mousemove", (event) => {
      tooltip.style.left = event.containerPoint.x - 10 + "px"; // Add some offset for visibility
      tooltip.style.top = event.containerPoint.y - 10 + "px";  // Add some offset for visibility
    });

    return () => map.remove();
  }, [showFormModal]);

  return <div id="map"></div>;
};

export default PinMap;

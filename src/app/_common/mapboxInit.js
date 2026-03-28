"use client";

import AppData from "@data/app.json";

const MAPBOX_STYLESHEET_HREF = "https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css";

function ensureMapboxStylesheet() {
  if (document.querySelector(`link[href="${MAPBOX_STYLESHEET_HREF}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = MAPBOX_STYLESHEET_HREF;
  link.setAttribute("data-mapbox-gl-styles", "true");
  document.head.appendChild(link);
}

export const mapboxInit = async () => {
  const mapContainer = document.querySelector('#map');

  if (mapContainer !== undefined && mapContainer !== null) {
    const mapboxgl = (await import('mapbox-gl')).default;
    ensureMapboxStylesheet();

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    const map = new mapboxgl.Map({
      container: 'map',
      style: AppData.settings.mapbox.style,
      center: [AppData.settings.mapbox.long, AppData.settings.mapbox.lat],
      zoom: AppData.settings.mapbox.zoom
    });
    new mapboxgl.Marker()
      .setLngLat([AppData.settings.mapbox.long, AppData.settings.mapbox.lat])
      .addTo(map);
  }
}

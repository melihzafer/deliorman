"use client";

import AppData from "@data/app.json";

export const mapboxInit = async () => {
  const mapContainer = document.querySelector('#map');

  if (mapContainer !== undefined && mapContainer !== null) {
    const mapboxgl = (await import('mapbox-gl')).default;
    await import('mapbox-gl/dist/mapbox-gl.css');

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
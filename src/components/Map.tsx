"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Client } from "@/services/api";

interface MapProps {
  clients: Client[];
  center: [number, number];
}

const SetViewOnClick = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13);
    }
  }, [coords, map]);
  return null;
};

export default function Map({ clients, center }: MapProps) {
  return (
    <div className="map-section glass-card">
      <h2>📍 Mapa de Cobertura</h2>
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%", borderRadius: "4px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetViewOnClick coords={center} />

        {clients.map((client) => {
          if (!client.lat || !client.lng) return null;
          return (
            <Marker key={client.id} position={[client.lat, client.lng]}>
              <Popup>
                <strong>{client.name}</strong>
                <br />
                {client.address}
                <br />
                Porte: {client.porte}
                <br />
                Status: {client.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

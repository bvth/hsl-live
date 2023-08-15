"use client"
import GtfsRealtimeBindings, { transit_realtime } from "gtfs-realtime-bindings";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "./map.css";
import VehiclePosition = transit_realtime.VehiclePosition;

import { Icon } from 'leaflet'
import IPosition = transit_realtime.IPosition;
const myIcon = new Icon({
	iconUrl: '/assets/map-marker-alt-svgrepo-com.svg',
	iconSize: [32,32]
})

export default function VehiclePositions() {
	const [vehicle, setVehicle] = useState<VehiclePosition>();
	const [vehiclePosition, setVehiclePosition] = useState<IPosition>()
	useEffect(() => {
		fetchVehiclePositions();
	}, [])

	const fetchVehiclePositions = () => {
		new Promise((resolve, reject) => {
			fetch("http://localhost:8000/vehicle-positions").then(res => res).then(async res => {
				const buffer = await res.arrayBuffer();
				let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
				const json_feed = JSON.parse(JSON.stringify(feed));
				
				setVehicle(json_feed.entity[0]);
				setVehiclePosition(json_feed.entity[0].vehicle.position)
				setInterval(() => {
					resolve()
				}, 1000);
			})
		}).then(() => {
			fetchVehiclePositions()
		})
	}

	return <MapContainer center={[60.1699, 24.9384]} zoom={9}>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		{vehiclePosition && <Marker position={[vehiclePosition?.latitude, vehiclePosition?.longitude]} icon={myIcon}></Marker>}
	</MapContainer>
}
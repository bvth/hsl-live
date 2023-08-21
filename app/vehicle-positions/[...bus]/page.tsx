"use client"
import { useEffect, useState } from "react";
import GtfsRealtimeBindings, { transit_realtime } from "gtfs-realtime-bindings";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import IPosition = transit_realtime.IPosition;
import "leaflet/dist/leaflet.css";
import "../map.css";

import { Icon } from 'leaflet';
const myIcon = new Icon({
	iconUrl: '/assets/map-marker-alt-svgrepo-com.svg',
	iconSize: [32,32]
})

export default function Page({params}: {params: {bus: [string]}}) {
	const [vehiclePosition, setVehiclePosition] = useState<IPosition>();
	useEffect(() => {
		fetchVehiclePositions();
	}, []);

	const fetchVehiclePositions = () => {
		new Promise<void>((resolve, reject) => {
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle-positions`).then(res => res).then(async res => {
				const buffer = await res.arrayBuffer();
				let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
				const json_feed = JSON.parse(JSON.stringify(feed));
				const vehicle = json_feed.entity.find(item => item.vehicle.vehicle.id.split("/")[1] === params.bus[0])?.vehicle;
				if(vehicle) {
					setVehiclePosition(vehicle.position);
					setInterval(() => {
						resolve();
					}, 1000);
				}
				else
					reject();
			})
		}).then(() => {
			fetchVehiclePositions()
		}).catch(() => {
			console.log("not found")
		})
	}

	return vehiclePosition ? <MapContainer center={[60.1699, 24.9384]} zoom={9}>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png?digitransit-subscription-key=ac3a74d4a33749198e6ab53a5086e00f"
		/>
		<Marker position={[vehiclePosition?.latitude, vehiclePosition?.longitude]} icon={myIcon}></Marker>
	</MapContainer> : <h1>Not found</h1>
}
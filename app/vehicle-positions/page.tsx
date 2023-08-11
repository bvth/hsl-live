"use client"
import GtfsRealtimeBindings, { transit_realtime } from "gtfs-realtime-bindings";
import { useEffect, useState } from "react";
import FeedMessage = transit_realtime.FeedMessage;


export default function VehiclePositions() {
	const [vehiclePosition, setVehiclePosition] = useState<FeedMessage>();

	useEffect(() => {
		fetchVehiclePositions();
	}, [])

	const fetchVehiclePositions = () => {
		new Promise ((resolve, reject) => {
			fetch("http://localhost:8000/vehicle-positions").then(res => res).then(async res => {
				const buffer = await res.arrayBuffer();
				let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
				setVehiclePosition(JSON.parse(JSON.stringify(feed)));
				setInterval(() => {resolve()}, 1000);
			})
		}).then(() => {fetchVehiclePositions()})
	}

	if(vehiclePosition) {
		let {vehicle} = vehiclePosition.entity[0];
		return <div>
			<p><span>{vehicle.position?.latitude}</span> - <span>{vehicle.position?.longitude}</span></p>
		</div>
	}
	return <h1>Nothing for you, mate!</h1>
}
"use client"
import GtfsRealtimeBindings, { transit_realtime } from "gtfs-realtime-bindings";
import { useEffect, useState } from "react";
import FeedMessage = transit_realtime.FeedMessage;


export default function TripUpdates() {
	const [tripUpdates, setTripUpdates] = useState<FeedMessage>();

	useEffect(() => {
		fetchTripUpdates();
	}, [])

	const fetchTripUpdates = () => {
		new Promise<void>((resolve, reject) => {
			fetch("http://localhost:8000/trip-updates").then(res => res).then(async res => {
				const buffer = await res.arrayBuffer();
				let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
				setTripUpdates(JSON.parse(JSON.stringify(feed)));
				// setInterval(() => {resolve()}, 15000);
			})
		})
			// .then(() => {fetchTripUpdates()})
		/**
		 * Should be recursive once I know what to do next
		 * */
	}

	if(tripUpdates) {
		console.log(tripUpdates.entity)
		// return tripUpdates.entity.map(entity => {
		// 	let { alert } = entity
		// 	return <div key={entity.id}>
		// 		<h3>{alert?.headerText?.translation?.find(t => t.language === "en")?.text}</h3>
		// 		<p>
		// 			{alert?.descriptionText?.translation?.find(t => t.language === "en")?.text}
		// 		</p>
		// 	</div>
		// })
	}
	return <h1>Nothing for you, mate!</h1>
}
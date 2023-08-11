"use client"
import GtfsRealtimeBindings, { transit_realtime } from "gtfs-realtime-bindings";
import { useEffect, useState } from "react";
import FeedMessage = transit_realtime.FeedMessage;


export default function ServiceAlerts() {
	const [serviceAlerts, setServiceAlerts] = useState<FeedMessage>();

	useEffect(() => {
		fetchServiceAlerts();
	}, [])

	const fetchServiceAlerts = () => {
		new Promise ((resolve, reject) => {
			fetch("http://localhost:8000/service-alerts").then(res => res).then(async res => {
				const buffer = await res.arrayBuffer();
				let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
				setServiceAlerts(JSON.parse(JSON.stringify(feed)));
				setInterval(() => {resolve()}, 300000);
			})
		}).then(() => {fetchServiceAlerts()})
	}

	if(serviceAlerts) {
		console.log(serviceAlerts.entity)
		return serviceAlerts.entity.map(entity => {
			let { alert } = entity
			return <div key={entity.id}>
				<h3>{alert?.headerText?.translation?.find(t => t.language === "en")?.text}</h3>
				<p>
					{alert?.descriptionText?.translation?.find(t => t.language === "en")?.text}
				</p>
			</div>
		})
	}
	return <h1>Nothing for you, mate!</h1>
}
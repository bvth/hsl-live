"use client"
import GtfsRealtimeBindings, { transit_realtime } from "gtfs-realtime-bindings";
import { useEffect, useState } from "react";
import FeedMessage = transit_realtime.FeedMessage;
import IFeedEntity = transit_realtime.IFeedEntity;


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

	const saveAlert = (body: IFeedEntity) => {
		let data = {
			entityId: body.id,
			headerText_en: body.alert?.headerText?.translation?.find(item => item.language === "en").text,
			descriptionText_en: body.alert?.descriptionText?.translation?.find(item => item.language === "en").text,
			start: body.alert?.activePeriod[0].start,
			end: body.alert?.activePeriod[0].end,
		}
		fetch("http://localhost:8000/service-alerts", {
			method: "POST",
			body: JSON.stringify(data)
		}).then(res => {console.log(res)})
	}

	if(serviceAlerts) {
		return serviceAlerts.entity.map(entity => {
			let { alert } = entity
			return <div key={entity.id}>
				<h3>{alert?.headerText?.translation?.find(t => t.language === "en")?.text}</h3>
				<p>
					{alert?.descriptionText?.translation?.find(t => t.language === "en")?.text}
				</p>
				<button onClick={() => {
					saveAlert(entity)
				}}>
					Save alert
				</button>
			</div>
		})
	}
	return <h1>Nothing for you, mate!</h1>
}
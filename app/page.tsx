import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const getData = async () => {
  fetch("https://realtime.hsl.fi/realtime/service-alerts/v2/hsl").then(res => res).then(async res => {
    const buffer = await res.arrayBuffer();
    let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    feed.entity.forEach((entity) => {
      if (entity.alert) {
        console.log(entity.alert.descriptionText);
      }
    });
  })
}

export default async function Home() {
  const data = await getData();
  return <p>hello</p>
}

import * as protobuf from "protobufjs";

const getData = async () => {
  const res = await fetch("https://data.waltti.fi/tampere/api/gtfsrealtime/v1.0/feed/servicealert", {
    headers: {
      "Authorization": `Basic ${btoa(`${process.env.WALTTI_CLIENT_ID}:${process.env.WALTTI_CLIENT_SECRET}`)}`
    }
  })

  return protobuf.load("gtfs-realtime.proto").then( root => {
    let AlertMessage = root.lookupType('transit_realtime.Alert')
    let payload = res.body;
    let errMsg = AlertMessage.verify(payload);
    if (errMsg)
      throw Error(errMsg);

    let msg = AlertMessage.create(payload)

    let buffer = AlertMessage.encode(msg).finish();
    // ... do something with buffer

    // Decode an Uint8Array (browser) or Buffer (node) to a message
    let message = AlertMessage.decode(buffer);

    console.log('======', message)
    return AlertMessage.toObject(message)
  })
}

export default async function Home() {
  const data = await getData();
  console.log('----....--', data)
  return <p>hello</p>
}

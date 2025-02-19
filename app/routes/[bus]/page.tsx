import '../../globals.scss';
import Link from 'next/link';

async function getData(id: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_DIGITRANSIT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY,
    },
    body: JSON.stringify({
      query: `
        query {
          route(id: "HSL:${id}") {
            longName
            shortName
            mode
            patterns {
              name
              stops {
                name
                code
                lat
                lon
              }
            }
          }
        }
      `
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function RoutePage({ params }: { params: { bus: string } }) {
  const data = await getData(params.bus);
  const route = data.data.route;
console.log(route)
  if (!route) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Route not found</h1>
        <p className="text-gray-600">The requested route does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Link href="/routes" className="inline-block mb-4 text-primary-blue hover:text-dark-blue">
        ← Back to routes
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">
        Route {route.shortName}: {route.longName}
      </h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Route Details</h2>
        <p className="text-gray-600">Type: {route.mode}</p>
      </div>

      <div>
        <div className="overflow-x-auto">
          {route.patterns.map((pattern: any, patternIndex: number) => (
            <div key={patternIndex} className="mb-8">
              <h3 className="text-lg font-medium mb-2">{pattern.name}</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Stop Name</th>
                    <th className="px-4 py-2">Stop Code</th>
                    <th className="px-4 py-2">Bus stop location</th>
                  </tr>
                </thead>
                <tbody>
                  {pattern.stops.map((stop: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{stop.name}</td>
                      <td className="px-4 py-2">{stop.code}</td>
                      <td className="px-4 py-2">
                        <a 
                          href={`https://www.google.com/maps?q=${stop.lat},${stop.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-blue hover:text-dark-blue underline"
                        >
                          View on map
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




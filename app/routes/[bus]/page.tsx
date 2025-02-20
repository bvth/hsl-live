import '../../../globals.scss';
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

  if (!route) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Route not found</h1>
            <p className="text-gray-600">The requested route does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/routes" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to routes
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Route {route.shortName}: {route.longName}
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Route Details</h2>
            <p className="text-gray-600">Type: {route.mode}</p>
          </div>

          <div className="space-y-8">
            {route.patterns.map((pattern: any, patternIndex: number) => (
              <div key={patternIndex} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{pattern.name}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pattern.stops.map((stop: any, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-900">{stop.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{stop.code}</td>
                          <td className="px-6 py-4 text-sm">
                            <a 
                              href={`https://www.google.com/maps?q=${stop.lat},${stop.lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View on map
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




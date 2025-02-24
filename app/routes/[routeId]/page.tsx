import Link from 'next/link';
import { fetchOneRoute } from '../../../utils/route';

type Params = Promise<{ routeId: string }>

export default async function RoutePage({ params } : { params: Params }) {
  const { routeId } = await params
  const data = await fetchOneRoute(routeId);
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
            className="back-button"
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
            <div className="grid grid-cols-2 gap-4">
              {route.patterns.map((pattern: any, patternIndex: number) => (
                <div key={patternIndex} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{pattern.name}</h3>
                  <div className="overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th>Stop Name</th>
                          <th>Stop Code</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pattern.stops.map((stop: any, index: number) => (
                          <tr key={index}>
                            <td className="text-sm text-gray-900">{stop.name}</td>
                            <td className="text-sm text-gray-500">{stop.code}</td>
                            <td className="text-sm">
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
    </div>
  );
}




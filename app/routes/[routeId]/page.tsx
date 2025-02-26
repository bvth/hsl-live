import Link from 'next/link';
import { fetchOneRoute } from '../../../utils/route';
import { Stop, StopTime } from '../../../types/routeTypes';
import './style.scss';
type Params = Promise<{ routeId: string }>

export default async function RoutePage({ params } : { params: Params }) {
  const { routeId } = await params
  const data = await fetchOneRoute(routeId);
  const route = data.data.route;
  const awayStops: StopTime[] = []
  const returnStops: StopTime[] = []

  route.patterns.forEach(pattern => {

    pattern.stops.forEach(stop => {
      if (pattern.directionId === 1) {
        awayStops.push(stop.away[0]);
      } else {
        returnStops.push(stop.return[0]);
      }
    });
  });

  const avgAwayDelay = (awayStops.reduce((acc, stop) => acc + stop.arrivalDelay, 0) + returnStops.reduce((acc, stop) => acc + stop.arrivalDelay, 0)) / (awayStops.length + returnStops.length);
  const avgReturnDelay = (awayStops.reduce((acc, stop) => acc + stop.departureDelay, 0) + returnStops.reduce((acc, stop) => acc + stop.departureDelay, 0)) / (awayStops.length + returnStops.length);

  console.log(avgAwayDelay, avgReturnDelay)

  const getDelayTime = (directionId: number, index: number) => {
      if(directionId === 1) {
        return `Arrival delay: ${awayStops[index].arrivalDelay}s | Departure delay: ${awayStops[index].departureDelay}s`
      } else {
        return `Arrival delay: ${returnStops[index].arrivalDelay}s | Departure delay:  ${returnStops[index].departureDelay}s`
      }
  }

  const getRouteState = (directionId: number) => {
    const avgDelay = directionId === 1 ? avgAwayDelay : avgReturnDelay;
    if(avgDelay > 0) {
      return "Delayed by " + Math.round(Math.abs(avgDelay)) + "s on average"
    } else if(avgDelay < 0) {
      return "Early by " + Math.round(Math.abs(avgDelay)) + "s on average"
    } else {
      return "On time"
    }
  }

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
            <div className="grid grid-cols-2 gap-4">
              {route.patterns.map((pattern: any, patternIndex: number) => (
                <div key={patternIndex} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">{pattern.name} ({pattern.stops.length} stops)</h2>
                  <p>Most likely to be: {getRouteState(pattern.directionId)}</p>
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
                            <td className="text-sm text-gray-900">
                                <div>{stop.name}</div>
                                <div>{getDelayTime(pattern.directionId, index)}</div>
                            </td>
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




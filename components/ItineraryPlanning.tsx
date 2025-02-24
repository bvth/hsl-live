"use client"
import '../globals.scss';
import { useState, useEffect } from 'react';

interface Coordinates {
    lat: number;
    lon: number;
}

interface ItineraryPlanningProps {
    origin: Coordinates | null;
    dest: Coordinates | null;
}

export default function ItineraryPlanning({ origin, dest }: ItineraryPlanningProps) {
    const [itineraryData, setItineraryData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<'time' | 'distance'>('time');
    const [sortedItineraries, setSortedItineraries] = useState<any[]>([]);

    useEffect(() => {
        if (origin && dest) {
            fetchItinerary();
        }
    }, [origin, dest]);

    useEffect(() => {
        if (!itineraryData?.itineraries) {
            setSortedItineraries([]);
            return;
        }

        const sorted = [...itineraryData.itineraries].sort((a, b) => {
            if (sortBy === 'time') {
                return a.duration - b.duration;
            } else {
                const distanceA = a.legs.reduce((total: number, leg: any) => total + leg.distance, 0);
                const distanceB = b.legs.reduce((total: number, leg: any) => total + leg.distance, 0);
                return distanceA - distanceB;
            }
        });

        setSortedItineraries(sorted);
    }, [sortBy, itineraryData]);

    const fetchItinerary = async () => {
        if (!origin || !dest) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY!
                    },
                    body: JSON.stringify({
                        query: `
              query {
                plan(
                  from: {lat: ${origin.lat}, lon: ${origin.lon}}
                  to: {lat: ${dest.lat}, lon: ${dest.lon}}
                ) {
                  itineraries {
                    duration
                    legs {
                      mode
                      startTime
                      endTime
                      from {
                        name
                        stop {
                          code
                          name
                        }
                      }
                      to {
                        name
                        stop {
                          code
                          name
                        }
                      }
                      distance
                      route {
                        shortName
                        longName
                      }
                    }
                  }
                }
              }
            `
                    })
                }
            );

            const data = await response.json();
            console.log(data);
            setItineraryData(data.data.plan);
        } catch (error) {
            console.error('Error fetching itinerary:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!origin || !dest) {
        return <p>Please select both origin and destination</p>;
    }

    if (isLoading) {
        return <p>Loading itinerary...</p>;
    }

    if (!itineraryData) {
        return null;
    }

    const getFastestAndShortest = () => {
        if (!itineraryData?.itineraries?.length) return { fastest: null, shortest: null };

        let fastest = itineraryData.itineraries[0];
        let shortest = itineraryData.itineraries[0];
        let shortestDistance = shortest.legs.reduce((total: number, leg: any) => total + leg.distance, 0);

        itineraryData.itineraries.forEach((itinerary: any) => {
            if (itinerary.duration < fastest.duration) {
                fastest = itinerary;
            }
            const distance = itinerary.legs.reduce((total: number, leg: any) => total + leg.distance, 0);
            if (distance < shortestDistance) {
                shortest = itinerary;
                shortestDistance = distance;
            }
        });

        return { fastest, shortest };
    };

    const { fastest, shortest } = getFastestAndShortest();

    return (
        <div className="mt-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Routes</h2>
            </div>
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'time' | 'distance')}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="time">Time</option>
                        <option value="distance">Distance</option>
                    </select>
                </div>
            </div>
            <div className="space-y-4">
                {sortedItineraries.map((itinerary: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex flex-col gap-3">
                            {[fastest, shortest].includes(itinerary) && (
                                <div className="flex flex-row flex-space-between">
                                    {itinerary === fastest && (
                                        <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                            Fastest Route
                                        </div>
                                    )}
                                    {itinerary === shortest && (
                                        <div className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                            Shortest Route
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="grid gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Mode:</span>
                                    <span className="text-gray-900">{itinerary.legs.map((leg: any) => leg.mode).join(', ')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                                    <span className="text-gray-900">{Math.round(itinerary.duration / 60)} minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Distance:</span>
                                    <span className="text-gray-900">{(itinerary.legs.reduce((total: number, leg: any) => total + leg.distance, 0) / 1000).toFixed(1)} km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
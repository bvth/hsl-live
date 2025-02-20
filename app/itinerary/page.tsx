"use client"

import Link from 'next/link';
import { useState } from 'react';
import '../../globals.scss';
import ItineraryPlanning from '../../components/ItineraryPlanning';

export default function Itinerary() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCoords, setOriginCoords] = useState<{lat: number, lon: number} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{lat: number, lon: number} | null>(null);
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);

  const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.digitransit.fi/geocoding/v1/search?text=${encodeURIComponent(address)}`, 
        {
          headers: {
            'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY!
          }
        }
      );
      
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return [];
    }
  };

  const handleOriginChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrigin(value);
    if (value.length > 2) {
      const suggestions = await fetchCoordinates(value);
      setOriginSuggestions(suggestions);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length > 2) {
      const suggestions = await fetchCoordinates(value);
      setDestinationSuggestions(suggestions);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion: any, type: 'origin' | 'destination') => {
    const [lon, lat] = suggestion.geometry.coordinates;
    if (type === 'origin') {
      setOrigin(suggestion.properties.label);
      setOriginCoords({ lat, lon });
      setOriginSuggestions([]);
    } else {
      setDestination(suggestion.properties.label);
      setDestinationCoords({ lat, lon });
      setDestinationSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to home
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Itinerary Planning</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                Origin
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="origin"
                  value={origin}
                  onChange={handleOriginChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter origin address"
                />
                {originSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {originSuggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-900"
                        onClick={() => handleSuggestionSelect(suggestion, 'origin')}
                      >
                        {suggestion.properties.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {originCoords && (
                <p className="mt-2 text-sm text-gray-500">
                  Coordinates: {originCoords.lat}, {originCoords.lon}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={handleDestinationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter destination address"
                />
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {destinationSuggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-900"
                        onClick={() => handleSuggestionSelect(suggestion, 'destination')}
                      >
                        {suggestion.properties.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {destinationCoords && (
                <p className="mt-2 text-sm text-gray-500">
                  Coordinates: {destinationCoords.lat}, {destinationCoords.lon}
                </p>
              )}
            </div>
          </div>

          {originCoords && destinationCoords && (
            <ItineraryPlanning 
              origin={originCoords} 
              dest={destinationCoords} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

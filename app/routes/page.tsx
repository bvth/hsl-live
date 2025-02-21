"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../globals.scss';
import './routes.scss';
import Link from 'next/link';

export default function Routes() {
	const router = useRouter();
	const [routeName, setRouteName] = useState<string>("");
	const [routeType, setRouteType] = useState<string>("");
	const [routes, setRoutes] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		fetchData();
	}, [routeName, routeType]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(process.env.NEXT_PUBLIC_DIGITRANSIT_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY,
				},
				body: JSON.stringify({
					query: `
						query {
							routes(name: "${routeName}"${routeType ? `, transportModes: [${routeType}]` : ''}) {
								gtfsId
								longName
								shortName
								mode
							}
						}
					`
				}),
			});

			const data = await response.json();
			if (data.data?.routes) {
				setRoutes(data.data.routes);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFilterChange = (type: 'name' | 'type', value: string) => {
		if (type === 'name') {
			setRouteName(value);
		} else {
			setRouteType(value);
		}
	};

	const handleRouteClick = (gtfsId: string) => {
		router.push(`/routes/${gtfsId}`);
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

				<div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
					<h1 className="text-3xl font-bold text-gray-900 mb-6">
						HSL Public Transport Routes
					</h1>
					<form className="flex flex-wrap gap-6">
						<div className="flex-1 min-w-[200px]">
							<label htmlFor="routeName" className="block text-sm font-medium text-gray-700 mb-2">
								Route Name
							</label>
							<input
								type="text"
								id="routeName"
								value={routeName}
								onChange={(e) => handleFilterChange('name', e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Filter by route name"
							/>
						</div>
						<div className="flex-1 min-w-[200px]">
							<label htmlFor="routeType" className="block text-sm font-medium text-gray-700 mb-2">
								Route Type
							</label>
							<select
								id="routeType"
								value={routeType}
								onChange={(e) => handleFilterChange('type', e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">All types</option>
								<option value="BUS">Bus</option>
								<option value="TRAM">Tram</option>
								<option value="RAIL">Rail</option>
								<option value="SUBWAY">Subway</option>
								<option value="FERRY">Ferry</option>
							</select>
						</div>
					</form>
					<div className="mt-6 text-sm text-gray-600">
						{routeType ? (
							<p>Showing {routes.length} {routeType.toLowerCase()} routes</p>
						) : (
							<div>
								<p className="font-medium">Total routes: {routes.length}</p>
								<div className="flex flex-wrap gap-4 mt-2">
									{['BUS', 'TRAM', 'RAIL', 'SUBWAY', 'FERRY'].map(mode => {
										const count = routes.filter(route => route.mode === mode).length;
										return count > 0 && (
											<span key={mode} className="px-3 py-1 bg-gray-100 rounded-full">
												{mode.charAt(0) + mode.slice(1).toLowerCase()}: {count}
											</span>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route number</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinations</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{isLoading ? (
								<tr>
									<td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading...</td>
								</tr>
							) : (
								routes.map((route, index) => (
									<tr
										key={index}
										onClick={() => handleRouteClick(route.gtfsId.replace('HSL:', ''))}
										className="hover:bg-gray-50 cursor-pointer transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.shortName}</td>
										<td className="px-6 py-4 text-sm text-gray-500">{route.longName}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.mode}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

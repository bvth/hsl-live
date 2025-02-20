"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.scss';
import './routes.scss';

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
		<div>
			<div className="mb-4 p-4 bg-gray-50 rounded">
				<h1 className="text-2xl font-bold mb-4">
					HSL Public Transport Routes
				</h1>
				<form className="flex gap-4">
					<div>
						<label htmlFor="routeName" className="block text-sm font-medium text-gray-700 mb-1">
							Route Name
						</label>
						<input
							type="text"
							id="routeName"
							value={routeName}
							onChange={(e) => handleFilterChange('name', e.target.value)}
							className="px-3 py-2 border rounded-md"
							placeholder="Filter by route name"
						/>
					</div>
					<div>
						<label htmlFor="routeType" className="block text-sm font-medium text-gray-700 mb-1">
							Route Type
						</label>
						<select
							id="routeType"
							value={routeType}
							onChange={(e) => handleFilterChange('type', e.target.value)}
							className="px-3 py-2 border rounded-md"
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
				<div className="mt-4">
					{routeType ? (
						<p className="text-sm text-gray-600">
							Showing {routes.length} {routeType.toLowerCase()} routes
						</p>
					) : (
						<div className="text-sm text-gray-600">
							<p>Total routes: {routes.length}</p>
							<div className="flex gap-4 mt-1">
								{['BUS', 'TRAM', 'RAIL', 'SUBWAY', 'FERRY'].map(mode => {
									const count = routes.filter(route => route.mode === mode).length;
									return count > 0 && (
										<span key={mode}>
											{mode.charAt(0) + mode.slice(1).toLowerCase()}: {count}
										</span>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto">
					<colgroup>
						<col style={{ width: "20%" }} />
						<col style={{ width: "60%" }} />
						<col style={{ width: "20%" }} />
					</colgroup>
					<thead>
						<tr className="bg-gray-100">
							<th className="px-4 py-2 w-1/5">Route number</th>
							<th className="px-4 py-2 w-3/5">Destinations</th>
							<th className="px-4 py-2 w-1/5">Type</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={3} className="text-center py-4">Loading...</td>
							</tr>
						) : (
							routes.map((route, index) => (
								<tr
									key={index}
									className="border-b cursor-pointer hover:bg-gray-100"
									onClick={() => handleRouteClick(route.gtfsId.replace('HSL:', ''))}
								>
									<td className="px-4 py-2 w-1/5">{route.shortName}</td>
									<td className="px-4 py-2 w-3/5">{route.longName}</td>
									<td className="px-4 py-2 w-1/5">{route.mode}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)

}

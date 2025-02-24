"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../globals.scss';
import Link from 'next/link';
import { fetchRoutes } from '@/utils/route';
export default function Routes() {
	const router = useRouter();
	const [routeName, setRouteName] = useState<string>("");
	const [routeType, setRouteType] = useState<string>("");
	const [routes, setRoutes] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const data = await fetchRoutes(routeName, routeType);
				setRoutes(data.data.routes);
			} catch (error) {
				console.error('Error fetching routes:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [routeName, routeType]);

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
						className="back-button"
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
								Route number
							</label>
							<input
								type="text"
								id="routeName"
								value={routeName}
								onChange={(e) => handleFilterChange('name', e.target.value)}
								className="focus:ring-blue-500 focus:border-blue-500"
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
								className="focus:ring-blue-500 focus:border-blue-500"
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
					<table>
						<thead>
							<tr>
								<th>Route number</th>
								<th>Destinations</th>
								<th>Type</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{isLoading ? (
								<tr>
									<td colSpan={3} className="text-center text-gray-500">Loading...</td>
								</tr>
							) : (
								routes.map((route, index) => (
									<tr
										key={index}
										onClick={() => handleRouteClick(route.gtfsId.replace('HSL:', ''))}
										className="hover:bg-gray-50 cursor-pointer transition-colors"
									>
										<td className="whitespace-nowrap text-sm font-medium text-gray-900">{route.shortName}</td>
										<td className="text-sm text-gray-500">{route.longName}</td>
										<td className="whitespace-nowrap text-sm text-gray-500">{route.mode}</td>
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

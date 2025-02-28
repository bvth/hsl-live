export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">HSL Live</h1>
					<div className="grid gap-4 md:grid-cols-2">
						<a
							href="/routes"
							data-testid="route-browser-link"
							className="block p-6 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
						>
							<h2 className="text-xl font-semibold text-blue-900 mb-2">Route Browser</h2>
							<p className="text-blue-700">Browse and search all HSL transit routes</p>
						</a>
						<a
							href="/itinerary"
							data-testid="itinerary-planner-link"
							className="block p-6 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
						>
							<h2 className="text-xl font-semibold text-green-900 mb-2">Itinerary Planner</h2>
							<p className="text-green-700">Plan your journey from point A to B</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

import { render, screen } from '@testing-library/react'
import RoutePage from '../app/routes/[routeId]/page'
import { fetchOneRoute } from '../utils/route'

jest.mock('../utils/route');

const dummyRoute = {
    gtfsId: `HSL:1122`,
    shortName: '999',
    longName: 'A-B',
    mode: 'BUS',
    patterns: [
      {
        name: 'From A to B',
        stops: [
          {
            name: 'Stop 1',
            code: 'E1234',
            lat: 60.2097,
            lon: 25.0823
          },
          {
            name: 'Stop 1a',
            code: 'E2345',
            lat: 60.2050,
            lon: 25.0800
          },
          {
            name: 'Stop 2',
            code: 'E3456',
            lat: 60.2000,
            lon: 25.0750
          },
          {
            name: 'Stop 2b',
            code: 'E4567',
            lat: 60.1950,
            lon: 25.0700
          },
          {
            name: 'Stop AA',
            code: 'E5678',
            lat: 60.1900,
            lon: 25.0650
          },
          {
            name: 'Stop BB',
            code: 'E6789',
            lat: 60.1850,
            lon: 25.0600
          },
          {
            name: 'Stop 3',
            code: 'E7890',
            lat: 60.1800,
            lon: 25.0550
          },
          {
            name: 'Stop 3c',
            code: 'E8901',
            lat: 60.1750,
            lon: 25.0500
          },
          {
            name: 'Stop CC',
            code: 'E9012',
            lat: 60.1700,
            lon: 25.0450
          },
          {
            name: 'Stop DD',
            code: 'E0123',
            lat: 60.1650,
            lon: 25.0400
          }
        ]
      }
    ]
  }

describe('BusRoute page', () => {
  it('displays all stops in correct order', async () => {
    fetchOneRoute.mockResolvedValue({
            data: {
              route: dummyRoute
            }
          });

    await render(await RoutePage({ params: { bus: '1122' } }))


    const table = screen.getAllByRole('table')[0]
    const rows = table.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(10);

    const expectedStops = dummyRoute.patterns[0].stops.map(stop => stop.name)

    rows.forEach((row, index) => {
      const stopNameCell = row.querySelector('td:first-child');
      expect(stopNameCell.textContent).toBe(expectedStops[index]);
    });
  });

  it('Error fallback', async () => {
    fetchOneRoute.mockResolvedValue({
      data: {
        route: null
      }
    });

    await render(await RoutePage({ params: { bus: '1122' } }))

    const errorMessage = screen.getByText('Route not found')
    expect(errorMessage).toBeInTheDocument()
  });
});

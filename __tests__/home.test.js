import { render, screen } from '@testing-library/react'
import Home from '../app/page'
 
describe('Home', () => {
  it('Render home page with links', () => {
    render(<Home />)
 
    const routeLink = screen.getAllByTestId('route-browser-link')
    const itineraryLink = screen.getAllByTestId('itinerary-planner-link')
 
    expect(routeLink).toHaveLength(1)
    expect(itineraryLink).toHaveLength(1)

    expect(routeLink[0]).toHaveTextContent('Route Browser')
    expect(routeLink[0]).toHaveStyle('background-color: rgb(239, 246, 255 / 1)')
    
    expect(itineraryLink[0]).toHaveTextContent('Itinerary Planner')
    expect(itineraryLink[0]).toHaveStyle('border-color: rgb(187,247,208 / 1)')
  })
})
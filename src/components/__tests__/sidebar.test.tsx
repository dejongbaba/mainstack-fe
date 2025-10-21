import { render, screen } from '@testing-library/react';
import { Sidebar } from '../sidebar';

// Mock the image imports used in the Sidebar component
jest.mock('../../assets/home.svg', () => 'home-icon');
jest.mock('../../assets/analytics.svg', () => 'analytics-icon');
jest.mock('../../assets/revenue.svg', () => 'revenue-icon');
jest.mock('../../assets/crm.svg', () => 'crm-icon');
jest.mock('../../assets/apps.svg', () => 'apps-icon');

describe('Sidebar Component', () => {
  it('renders correctly', () => {
    render(<Sidebar />);
    
    // The sidebar should be visible
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toBeInTheDocument();
    
    // It should have the correct position and styling
    expect(sidebar).toHaveClass('fixed');
    expect(sidebar).toHaveClass('left-0');
  });
  
  it('contains all navigation buttons', () => {
    render(<Sidebar />);
    
    // Check that all buttons are rendered
    const buttons = screen.getAllByRole('button');
    
    // The sidebar should have 5 navigation buttons
    expect(buttons).toHaveLength(5);
    
    // Each button should have the correct styling
    buttons.forEach(button => {
      expect(button).toHaveClass('grayscale');
      expect(button).toHaveClass('hover:grayscale-0');
    });
  });
});
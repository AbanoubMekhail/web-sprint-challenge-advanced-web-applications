import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Spinner from './Spinner';



// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
test('renders Spinner when "on" prop is true', () => {
  render(<Spinner on={true} />);

  const spinnerElement = screen.getByTestId('spinner');
  expect(spinnerElement).toBeInTheDocument()
  expect(spinnerElement).toHaveTextContent('Please wait...');
});

test('does not render Spinner when "on" prop is false', () => {
  render(<Spinner on={false} />);

  const spinnerElement = screen.queryByTestId('spinner');
  expect(spinnerElement).not.toBeInTheDocument();
});
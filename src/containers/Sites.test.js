import { render, screen } from '@testing-library/react';
import Sites from './Sites';

test('Check the text "Sites" present in the dom', () => {
  render(<Sites />);
  const linkElement = screen.getByText(/Sites/i);
  expect(linkElement).toBeInTheDocument();
});

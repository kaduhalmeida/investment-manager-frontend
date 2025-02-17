import { render } from '@testing-library/react'; // Mantém o render aqui
import { screen } from '@testing-library/react'; // Importa o screen do pacote correto
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

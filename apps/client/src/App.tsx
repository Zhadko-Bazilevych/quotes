import type { JSX } from 'react';
import { QuoteSection } from './components/quote/quote-section';

function App(): JSX.Element {
  return (
    <div className="flex justify-center">
      <div className="w-3/5">
        <QuoteSection />
      </div>
    </div>
  );
}

export default App;

import type { JSX } from 'react';
import { QuoteList } from './components/quote-list';

function App(): JSX.Element {
  return (
    <div className="flex justify-center">
      <div className="w-3/5">
        <QuoteList />
      </div>
    </div>
  );
}

export default App;

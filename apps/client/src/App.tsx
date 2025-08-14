import type { JSX } from 'react';
import { QuoteList } from './pages/quote-list';

function App(): JSX.Element {
  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-3/5 sm:min-w-160 px-2">
        <QuoteList />
      </div>
    </div>
  );
}

export default App;

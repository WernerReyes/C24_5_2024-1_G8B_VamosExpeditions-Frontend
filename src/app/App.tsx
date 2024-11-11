import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import { AppRouter } from "./routes";
import { store } from "./store";

import "./App.css";
import "primeicons/primeicons.css";
import { Suspense } from "react";

function App() {
  return (
    <>
      <Provider store={store}>
        <Suspense fallback={
          <div className="loader-container">
            <div className="loader">
              loading...
            </div>
          </div>
        }>
        <PrimeReactProvider>
          <AppRouter />
        </PrimeReactProvider>
        </Suspense>
      </Provider>
    </>
  );
}

export default App;

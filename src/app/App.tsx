import { Suspense } from "react";
import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import { AppRouter } from "./routes";
import { ProgressSpinner } from "@/presentation/components";
import { store } from "./store";
import "./App.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="flex h-full max-h-full min-h-screen w-full items-center justify-center">
            <ProgressSpinner />
          </div>
        }
      >
        <PrimeReactProvider>
          <AppRouter />
        </PrimeReactProvider>
      </Suspense>
    </Provider>
  );
}

export default App;

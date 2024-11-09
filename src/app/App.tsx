import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import { AppRouter } from "./routes";
import { store } from "./store";

import "./App.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <>
      <Provider store={store}>
        {/* <Suspense fallback={<ProgressSpinner darkColor="bg-[#111827]" lightColor="bg-white" />}> */}
        <PrimeReactProvider>
          <AppRouter />
        </PrimeReactProvider>
        {/* </Suspense> */}
      </Provider>
    </>
  );
}

export default App;

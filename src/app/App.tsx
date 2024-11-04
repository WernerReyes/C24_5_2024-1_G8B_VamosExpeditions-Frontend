import "./App.css";

import "primeicons/primeicons.css";

import { PrimeReactProvider } from "primereact/api";
import { AppRouter } from "./routes";

function App() {
  return (
    <>
      {/* <Provider store={store}> */}
      {/* <Suspense fallback={<ProgressSpinner darkColor="bg-[#111827]" lightColor="bg-white" />}> */}
      <PrimeReactProvider>
        <AppRouter />
      </PrimeReactProvider>
      {/* </Suspense> */}
      {/* </Provider> */}
    </>
  );
}

export default App;

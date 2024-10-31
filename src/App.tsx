import { useState } from "react";
import reactLogo from "./assets/react.svg";

import { Button } from "primereact/button";
import "./App.css";
import viteLogo from "/vite.svg";
import { Card } from "primereact/card";

function App() {
  const [count, setCount] = useState(0);
  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );
  const footer = (
    <>
      <Button label="Save" icon="pi pi-check" />
      <Button
        label="Cancel"
        className="bg-blue-400 dark:bg-red-400"
        icon="pi pi-times"
        style={{ marginLeft: "0.5em", backgroundColor: "blue" }}
      />
    </>
  );

  return (
    <div className="card flex bg-red-500 justify-content-center">
      <Card
        title="Advanced Card"
        subTitle="Card subtitle"
        
        footer={footer}
        header={header}
        className="md:w-25rem"
      >
        <p className="m-0 mt-5 bg-red-500">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          sed consequuntur error repudiandae numquam deserunt quisquam repellat
          libero asperiores earum nam nobis, culpa ratione quam perferendis
          esse, cupiditate neque quas!
        </p>
      </Card>
    </div>
  );
}

export default App;

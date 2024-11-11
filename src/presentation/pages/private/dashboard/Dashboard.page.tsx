import { Sidebar } from "../components/Sidebar";
import { StatisticsSummaryGraph } from "./components/StatisticsSummaryGraph";

const DashboardPage = () => {

  const {visible,setVisible}=useSidebar();
  return (
    <section className="w-screen min-h-screen flex">
      <Sidebar />

      <div className="w-4/5 h-full bg-secondary">
        <header className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
          Header
        </header>
        <main className="p-5 md:p-10">
          <h2 className="text-xl text-start font-bold text-primary">
            Dashboard
          </h2>
          <div className="grid grid-cols-4 grid-flow-row gap-x-4 gap-y-6  mt-4">
            <div className="w-full bg-white border col-span-4 h-full shadow-md rounded-md p-3">
              <StatisticsSummaryGraph />
            </div>
            <StatsOverview
              title="Cotizaciones Pendientes"
              icon="pi pi-file"
              extraInfo="+2% desde el mes pasado"
              value={12}
            />
            <StatsOverview
              title="Reservas Activas"
              icon="pi pi-calendar"
              extraInfo="+2% desde el mes pasado"
              value={24}
             />
            <StatsOverview
              title="Ingresos Totales"
              icon="pi pi-globe"
              extraInfo="+2% desde el mes pasado"
              value={45231}

             />
            <StatsOverview />
            {/*  */}
            <div className="w-full bg-white border col-span-4 lg:col-span-2 shadow-md h-40 rounded-md max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-4 lg:col-span-2 shadow-md h-40 rounded-md max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>

            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>

            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border col-span-2 shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            {/* <div className="w-full bg-white border shadow-md h-40 max-w-screen-lg">
              <StatisticsSummaryGraph />
            </div> */}
          </div>
        </main>
      </div>
    </section>
  );
};

export default DashboardPage;

{
  /* <section className="flex h-screen">
            <div className={`w-72 ${visible ? "sidebar-fixed" : "hidden"}`}>
                <BasicDemo visible={visible} setVisible={setVisible} />
            </div>


            <div className={`flex-1 bg-red-500 ${visible ? "" : "w-full "}`}>
                <div className="flex-1 ">
                    <Navar setVisible={setVisible} />
                </div>

              
            </div>
        </section> */
}

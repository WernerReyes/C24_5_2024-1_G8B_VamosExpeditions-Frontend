
import { Navar } from "./components/nanvar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import { useSidebar } from "./components/sidebar/useSidebar";
import { StatisticsSummaryGraph } from "./components/StatisticsSummaryGraph";
import './components/sidebar/index.css'


const DashboardPage = () => {

  const {visible,setVisible}=useSidebar();
  return (
    <section className="w-screen min-h-screen flex">

      <div className={`w-72 ${visible ? "sidebar-fixed" : "hidden"}`}>
           <Sidebar  visible={visible} setVisible={setVisible} />
      </div>
      

      <div className={`flex-1 h-full mt-5 bg-secondary ${visible ? "" : "w-full "} `}>
       
        <Navar setVisible={setVisible} />
       
        <main className="p-5 md:p-10">
          <h2 className="text-xl text-start font-bold text-primary">
            Dashboard
          </h2>
          <div className="grid grid-cols-4 grid-flow-row gap-x-4 gap-y-6  mt-4">
            <div className="w-full bg-white border col-span-4 h-full shadow-md p-3">
              <StatisticsSummaryGraph />
            </div>
            <div className="w-full bg-white border shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border shadow-md h-40 max-w-screen-lg">
              {/* <StatisticsSummaryGraph /> */}
            </div>
            <div className="w-full bg-white border shadow-md h-40 max-w-screen-lg">
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

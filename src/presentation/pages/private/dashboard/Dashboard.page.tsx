import type { AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";
import { useGetReservationsStatsQuery } from "@/infraestructure/store/services";
import {
  Card,
  DefaultFallBackComponent,
  ErrorBoundary,
} from "@/presentation/components";
import { useSelector } from "react-redux";
import { NewQuotationDialog } from "../components";
import {
  ActiveReserves,
  RecentQuotes,
  StatisticsSummaryGraph,
  StatsOverviewCard,
} from "./components";
import { useEffect, useState } from "react";



const FALLBACK_MESSAGES = [
  "No se pudieron cargar la cantidad de cotizaciones pendientes",
  "No se pudieron cargar las reservas activas",
  "No se pudieron cargar los ingresos totales",
  "No se pudó cargar el margen de utilidad",
];

const DashboardPage = () => {
  const { authUser } = useSelector((state: AppState) => state.auth);

  const {
    currentData: reservationsStatsData,
    isLoading: isLoadingReservationsStats,
    isFetching: isFetchingReservationsStats,
    refetch: refetchReservationsStats,
    isError: isErrorReservationsStats,
  } = useGetReservationsStatsQuery();

  const reservationsStats = reservationsStatsData?.data;
  

  return (
    <>
    <DetectInternet/>
      <div className="flex justify-between max-sm:gap-x-3 items-center">
        <h1 className="text-xl sm:text-3xl text-start font-bold text-primary">
          {getTimeOffDay()}, {authUser?.fullname} 👋
        </h1>
        <NewQuotationDialog />
      </div>

      

      <div className="grid grid-cols-4 grid-flow-row gap-x-4 gap-y-6 mt-4">
        <div className="w-full bg-white border col-span-4 h-full shadow-md rounded-md p-3">
          <StatisticsSummaryGraph />
        </div>
        <ErrorBoundary
          isLoader={isFetchingReservationsStats || isLoadingReservationsStats}
          fallBackComponent={
            <>
              {FALLBACK_MESSAGES.map((message, index) => (
                <Card
                  key={index}
                  className="shadow-md flex items-center justify-center col-span-4 md:col-span-2 lg:col-span-1"
                >
                  <DefaultFallBackComponent
                    refetch={refetchReservationsStats}
                    isFetching={isFetchingReservationsStats}
                    isLoading={isLoadingReservationsStats}
                    message={message}
                  />
                </Card>
              ))}
            </>
          }
          skeletonQuantity={4}
          skeleton={{
            className: "col-span-4 md:col-span-2 lg:col-span-1",
            height: "10rem",
          }}
          error={isErrorReservationsStats}
        >
          <StatsOverviewCard
            title="Cotizaciones Pendientes"
            icon="pi pi-file"
            extraInfo={reservationsStats?.totalPendingQuotations}
          />

          <StatsOverviewCard
            title="Reservas Activas"
            icon="pi pi-calendar"
            extraInfo={reservationsStats?.totalActive}
          />
          <StatsOverviewCard
            title="Ingresos Totales"
            icon="pi pi-dollar"
            extraInfo={reservationsStats?.totalIncome}
            type="currency"
          />
          <StatsOverviewCard
            title="Margen de Utilidad"
            icon="pi pi-percentage"
            extraInfo={reservationsStats?.totalMargin}
            type="percentage"
          />
        </ErrorBoundary>

        <div className="w-full p-6 bg-white border col-span-4 self-start lg:col-span-2 shadow-md rounded-md">
          <RecentQuotes />
        </div>
        <div className="w-full p-6 bg-white border col-span-4 self-start lg:col-span-2 shadow-md rounded-md   ">
          <ActiveReserves />
        </div>
      </div>
    </>
  );
};

const getTimeOffDay = () => {
  const hour = dateFnsAdapter.getHours();
  if (hour >= 0 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

export default DashboardPage;

function DetectInternet(){
  const [isOnline,setIsOnline] = useState(navigator.onLine)

  const handleCheck = () =>{
      setIsOnline(navigator.onLine)
  }

  useEffect(()=>{
      window.addEventListener('online',handleCheck)
      window.addEventListener('offline',handleCheck)
  },[])
  
  return(
      <>
          <div style={{textAlign:'center'}}>
             <h1>{isOnline?'Online':'Offline'}</h1>
          </div>
      </>
  )
}


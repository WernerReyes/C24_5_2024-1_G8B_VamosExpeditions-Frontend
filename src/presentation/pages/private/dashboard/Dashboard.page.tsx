import { useNavigate } from "react-router-dom";
import { Button } from "@/presentation/components";
import { MainLayout } from "../layouts";
import {
  ActiveReserves,
  RecentQuotes,
  StatisticsSummaryGraph,
  StatsOverviewCard,
} from "./components";
import { constantRoutes } from "@/core/constants";
import { useAuthStore } from "@/infraestructure/hooks";

const { NEW_QUOTE } = constantRoutes.private;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore()

  const handleNewQuote = () => navigate(NEW_QUOTE);

  return (
    <MainLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-3xl text-start font-bold text-primary">
          Bienvenido, {authUser?.fullname} 👋
        </h1>
        <Button
          label="Nueva cotización"
          icon="pi pi-plus-circle"
          onClick={() => handleNewQuote()}
        />
      </div>

      <div className="grid grid-cols-4 grid-flow-row gap-x-4 gap-y-6 mt-4">
        <div className="w-full bg-white border col-span-4 h-full shadow-md rounded-md p-3">
          <StatisticsSummaryGraph />
        </div>
        <StatsOverviewCard
          title="Cotizaciones Pendientes"
          icon="pi pi-file"
          extraInfo="+2% desde el mes pasado"
          value={"12"}
        />
        <StatsOverviewCard
          title="Reservas Activas"
          icon="pi pi-calendar"
          extraInfo="+2% desde el mes pasado"
          value={"24"}
        />
        <StatsOverviewCard
          title="Ingresos Totales"
          icon="pi pi-dollar"
          extraInfo="+2% desde el mes pasado"
          value={"$45231"}
        />
        <StatsOverviewCard
          title="Margen de Utilidad"
          icon="pi pi-percentage"
          extraInfo="+5% desde el mes pasado"
          value={"20%"}
        />

        <div className="w-full p-6 bg-white border col-span-4 xl:col-span-2 shadow-md rounded-md">
          <RecentQuotes />
        </div>
        <div className="w-full p-6 bg-white border col-span-4 xl:col-span-2 shadow-md rounded-md   ">
          <ActiveReserves />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;

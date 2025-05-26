import { useGetAllOfficialVersionQuotationsQuery } from "@/infraestructure/store/services";
import {
  DefaultFallBackComponent,
  ErrorBoundary,
} from "@/presentation/components";
import { ItemSkeleton } from "../ItemSkeleton";
import { ItemQuotation } from "./components";
import { EmptyQuotations } from "./components/EmptyQuotations";

export const RecentQuotes = () => {
  const { currentData, isLoading, isFetching, refetch, isError } =
    useGetAllOfficialVersionQuotationsQuery({
      page: 1,
      limit: 5,
      select: {
        name: true,
        version_number: true,
        quotation_id: true,
        completion_percentage: true,
        trip_details: {
          start_date: true,
          end_date: true,
          client: {
            fullName: true,
          },
        },
        final_price: true,
        status: true,
        created_at: true,
        updated_at: true,
        user: {
          fullname: true,
        },
      },
    });

  const quotes = currentData?.data.content;

  return (
    <>
      <h3 className="text-sm md:text-lg font-bold text-tertiary mb-4">
        Cotizaciones Recientes
      </h3>
      <ErrorBoundary
        isLoader={isLoading || isFetching}
        loadingComponent={
          <div className="space-y-4">
            {[...Array(6)].map((_, index: number) => (
              <ItemSkeleton key={index} />
            ))}
          </div>
        }
        fallBackComponent={
          <DefaultFallBackComponent
            refetch={refetch}
            isFetching={isFetching}
            isLoading={isLoading}
            message="No se pudieron cargar las cotizaciones recientes"
          />
        }
        error={isError}
      >
        <ul className="space-y-3">
          {quotes && quotes.length ? (
            quotes.map((quote, index) => (
              <ItemQuotation key={index} quotation={quote} />
            ))
          ) : (
            <EmptyQuotations />
          )}
        </ul>
      </ErrorBoundary>
    </>
  );
};

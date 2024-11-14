import { classNamesAdapter } from "@/core/adapters";
import { QuoteStatusEnum } from "@/domain/entities";
import { Avatar, Button } from "@/presentation/components";

//* Sample Data
const RECENT_QUOTES = [
  {
    id: 1,
    client: "Juan Perez",
    date: "2024-10-10",
    status: QuoteStatusEnum.Pending,
    total: 2500,
  },
  {
    id: 2,
    client: "Maria Gonzalez",
    date: "2024-07-30",
    status: QuoteStatusEnum.Accepted,
    total: 3800,
  },
  {
    id: 3,
    client: "Carlos Lopez",
    date: "2024-07-30",
    status: QuoteStatusEnum.Rejected,
    total: 1900,
  },
];

export const RecentQuotes = () => {
  //* Helper function to get status styles
  const getStatusClass = (status: QuoteStatusEnum) => {
    switch (status) {
      case QuoteStatusEnum.Pending:
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case QuoteStatusEnum.Accepted:
        return "bg-green-100 text-green-800 border border-green-300";
      case QuoteStatusEnum.Rejected:
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "";
    }
  };

  const handleViewDetails = (id: number) => {
    alert(`Viewing details for quote ID: ${id}`);
  };

  return (
    <>
      <h3 className="text-lg font-bold text-tertiary mb-4">
        Cotizaciones Recientes
      </h3>
      <ul className="space-y-3">
        {RECENT_QUOTES.map((quote) => (
          <li
            key={quote.id}
            className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition duration-200 group"
          >
            <div className="flex items-center">
              <Avatar
                size="large"
                shape="circle"
                label={quote.client.charAt(0)}
              />
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">
                  {quote.client}
                </p>
                <div className="flex items-center space-x-2">
                  <i className="pi pi-calendar text-sm text-gray-500"></i>
                  <p className="text-sm text-gray-500">{quote.date}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">
                ${quote.total.toLocaleString()}
              </p>
              <span
                className={classNamesAdapter(
                  "inline-block px-3 py-1 text-xs font-semibold rounded-full",
                  getStatusClass(quote.status)
                )}
              >
                {quote.status}
              </span>
            </div>
            <Button
              className="absolute right-4 bottom-4 px-3 py-1 text-sm font-medium text-primary bg-transparent border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
              onClick={() => handleViewDetails(quote.id)}
            >
              View Details
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};

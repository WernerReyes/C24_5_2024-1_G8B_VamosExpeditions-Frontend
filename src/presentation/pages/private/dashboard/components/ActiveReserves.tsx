import { Avatar, Button } from "@/presentation/components";
import { classNames } from "primereact/utils";

//* Sample Data
const ACTIVE_RESERVES = [
  {
    id: 1,
    client: "Juan Perez",
    date: "2024-10-10",
    place: "Cusco",
    people: 4,
  },
  {
    id: 2,
    client: "Maria Gonzalez",
    date: "2024-07-30",
    place: "Arequipa",
    people: 2,
  },
  {
    id: 3,
    client: "Carlos Lopez",
    date: "2024-07-30",
    place: "Lima",
    people: 1,
  },
];

export const ActiveReserves = () => {
  const handleViewDetails = (id: number) => {
    alert(`Viewing details for quote ID: ${id}`);
  };

  return (
    <>
      <h3 className="text-lg font-bold text-tertiary mb-4">Reservas activas</h3>
      <ul className="space-y-3">
        {ACTIVE_RESERVES.map((quote) => (
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
                {quote.place}
              </p>

              <span className="inline-block px-3 py-1 text-xs text-[#4051A7] font-semibold rounded-full bg-[#DBEAFE]">
                <i
                  className={classNames(
                    "text-[#4051A7] me-2 text-xs pi ",
                    quote.people === 1 ? "pi-user" : "pi-users"
                  )}
                ></i>
                {quote.people === 1 ? "1 persona" : `${quote.people} personas`}
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

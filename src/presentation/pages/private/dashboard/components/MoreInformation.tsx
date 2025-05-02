import { dateFnsAdapter } from "@/core/adapters";
import { Button } from "@/presentation/components";

type Props = {
  createdAt: Date;
  updatedAt: Date;
  userFullname: string;
  handleViewDetails: () => void;
};

export const MoreInformation = ({
  createdAt,
  updatedAt,
  userFullname,
  handleViewDetails,
}: Props) => {
 
  return (
    <div className="bg-gray-50 p-3 mt-4 border-gray-100 text-sm">
      <div className="grid grid-cols-1 gap-y-3 md:grid-cols-3">
        <div className="text-xs flex max-sm:justify-center items-center">
          <i className="pi pi-calendar h-4 w-4 text-gray-400 mr-2"></i>
          <div>
            <p className="text-gray-500 ">Fecha de creación</p>
            <p className="text-gray-700">
              {dateFnsAdapter.format(createdAt, "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        </div>
        <div className="text-xs flex items-center justify-center">
          <i className="pi pi-clock h-4 w-4 text-gray-400 mr-2"></i>
          <div>
            <p className="text-gray-500">Última actualización</p>
            <p className="text-gray-700">
              {dateFnsAdapter.format(updatedAt, "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        </div>
        <div className="text-xs flex items-center max-sm:justify-center justify-end">
          <i className="pi pi-user h-4 w-4 text-gray-400 mr-2"></i>
          <div>
            <p className="text-gray-500">Creado por</p>
            <p className="text-gray-700">
              {userFullname || "Usuario desconocido"}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex md:justify-end">
        <Button
          size="small"
          label="Ver detalles"
          className="mt-4 w-full md:max-w-48 text-sm"
          onClick={() => handleViewDetails()}
        />
      </div>
    </div>
  );
};

import { phoneNumberAdapter } from "@/core/adapters";
import type { ClientEntity } from "@/domain/entities";

type ClientInfoProps = {
  client: ClientEntity;
};
export const ClientInfo = ({ client }: ClientInfoProps) => {
  return (
    <div className="flex flex-col">
      <span>{client?.fullName}</span>
      <span className="text-xs text-muted-foreground">{client?.email}</span>
      <span className="text-xs flex items-center text-muted-foreground">
        <div className="flex items-center gap-1">
         {client?.country.image && (
          <img src={client?.country.image.png} alt="flag" className="w-4 h-4" /> )}
          <span>{client?.country.name}</span>
        </div>
        <span className="mx-1">|</span>
        <p className="text-xs text-muted-foreground">{
            phoneNumberAdapter.format(client?.phone)
            }</p>
      </span>
    </div>
  );
};

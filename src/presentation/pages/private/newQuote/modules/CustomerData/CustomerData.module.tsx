import { ClientFormt, ReservationFormt } from "./components"


export const CustomerDataModule = () => {
  return (
    <div className="
    flex flex-col xl:flex-row gap-4
    ">
       <ClientFormt/>
       <ReservationFormt/>
    </div>
  )
}

import type { AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";
import {
  orderTypeRender,
  reservationStatusRender,
  travelerStyleRender,
  type ReservationEntity,
} from "@/domain/entities";

import { useGetAllReservationsQuery } from "@/infraestructure/store/services";
import {
  Button,
  Column,
  DataTable,
  DataTableRef,
  Tag,
  type DataTableSelectionMultipleChangeEvent,
} from "@/presentation/components";
import { Toolbar } from "primereact/toolbar";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";

export const ReservationTable = () => {
  const dt = useRef<DataTableRef>(null);
  useGetAllReservationsQuery({});
  const { reservations } = useSelector((state: AppState) => state.reservation);

  const [selectedreservations, setSelectedreservations] = useState<
    ReservationEntity[]
  >([]);

  return (
    <div>
      <div className="card">
        {/* <Toolbar className="mb-4"></Toolbar> */}
        <Toolbar
          className="mb-4"
          start={
            <div className="flex gap-x-5">
              <Button
                type="button"
                label="Nuevo"
                icon="pi pi-plus"
                onClick={() => {
                  console.log("Nuevo");
                }}
              />
              <Button
                type="button"
                label="Eliminar"
                icon="pi pi-trash"
                outlined
                severity="danger"
                onClick={() => {
                  console.log("Eliminar");
                }}
              />
            </div>
          }
          end={
            <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
              <Button
                label="Exportar"
                className="bg-transparent text-black border-[#D0D5DD]"
                icon="pi pi-download"
              />
              <Button label="Importar" icon="pi pi-file-import" />
            </div>
          }
        />

        <DataTable
          ref={dt}
          value={reservations ?? []}
          selection={selectedreservations}
          onSelectionChange={(
            e: DataTableSelectionMultipleChangeEvent<ReservationEntity[]>
          ) => {
            if (Array.isArray(e.value)) {
              setSelectedreservations(e.value);
            }
          }}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} reservations"
          //   globalFilter={globalFilter}
          //   header={header}
          selectionMode="multiple"
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="code"
            header="Code"
            sortable
            align="center"
            // style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="numberOfPeople"
            header="Personas"
            align="center"
            sortable
            // style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="client.fullName"
            header="Client"
            sortable
            align="center"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="travelerStyle"
            header="Estilo de Viajero"
            sortable
            style={{ minWidth: "8rem" }}
            align="center"
            body={(reservation: ReservationEntity) => {
              const travelerStyle =
                travelerStyleRender[reservation.travelerStyle];
              return (
                <Tag
                  value={travelerStyle.label}
                  severity={travelerStyle.severity}
                ></Tag>
              );
            }}
          ></Column>
          <Column
            field="orderType"
            header="Tipo de pedido"
            sortable
            style={{ minWidth: "8rem" }}
            align="center"
            body={(reservation: ReservationEntity) => {
              const orderType = orderTypeRender[reservation.orderType];
              return (
                <Tag
                  value={orderType.label}
                  severity={orderType.severity}
                ></Tag>
              );
            }}
          ></Column>
          <Column
            field="startDate"
            header="Fecha de Inicio"
            sortable
            align="center"
            body={(reservation: ReservationEntity) =>
              dateFnsAdapter.format(reservation.startDate)
            }
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="endDate"
            header="Fecha de Fin"
            sortable
            align="center"
            body={(reservation: ReservationEntity) =>
              dateFnsAdapter.format(reservation.endDate)
            }
            style={{ minWidth: "8rem" }}
          ></Column>
          {/* <Column
            field="cities"
            header="Cities"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column> */}
          <Column
            field="specialSpecifications"
            header="Special Specifications"
            sortable
            align="center"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="status"
            header="Status"
            sortable
            align="center"
            body={(reservation: ReservationEntity) => {
              const status = reservationStatusRender[reservation.status];
              return (
                <Tag
                  value={status.label}
                  severity={status.severity}
                  icon={status.icon}
                ></Tag>
              );
            }}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      {/* <Dialog visible={reservationDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="reservation Details" modal className="p-fluid" footer={reservationDialogFooter} onHide={hideDialog}>
                {reservation.image && <img src={`https://primefaces.org/cdn/primereact/images/reservation/${reservation.image}`} alt={reservation.image} className="reservation-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={reservation.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !reservation.name })} />
                    {submitted && !reservation.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={reservation.description} onChange={(e:ChangeEvent<HTMLTextAreaElement>) => onInputTextAreaChange(e, 'description')} required rows={3} cols={20} />
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={reservation.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={reservation.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={reservation.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={reservation.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber id="price" value={reservation.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={reservation.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteReservationDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteReservationDialogFooter} onHide={hideDeleteReservationDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {reservation && (
                        <span>
                            Are you sure you want to delete <b>{reservation.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
{/*  */}
      {/* <Dialog visible={deleteReservationsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteReservationsDialogFooter} onHide={hideDeleteReservationsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {reservation && <span>Are you sure you want to delete the selected reservations?</span>}
                </div>
            </Dialog> */}
    </div>
  );
};

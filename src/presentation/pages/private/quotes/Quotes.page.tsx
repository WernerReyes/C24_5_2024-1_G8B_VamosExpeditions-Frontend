import { Button, InputText } from "@/presentation/components";
import { MainLayout } from "../layouts";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useState, version } from "react";
import { Nullable } from "primereact/ts-helpers";

type QuoteStatus = "Pendiente" | "Aceptado" | "Rechazado";

type Version = {
  id: number;
  date: string;
  status: QuoteStatus;
  representative: {
    id: number;
    name: string;
  };
  customer: {
    name: string;
    country: string;
  };
  total: number;
};

interface Quote {
  id: number;
  date: string;
  status: QuoteStatus;
  representative: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
    country: string;
  };
  versions: Version[];
  total: number;
}

const QUOTES: Quote[] = [
  {
    id: 1,
    date: "2021-10-10",
    status: "Aceptado",
    representative: {
      id: 1,
      name: "Pablo perez",
    },
    customer: {
      id: 1,
      name: "Juan Perez",
      country: "Argentina",
    },
    versions: [
      {
        id: 1,
        date: "2021-10-10",
        status: "Rechazado",
        representative: {
          id: 1,
          name: "Pablo",
        },
        customer: {
          name: "Juan Perez",
          country: "Argentina",
        },
        total: 1000,
      },
    ],
    total: 1000,
  },
  {
    id: 2,
    date: "2021-10-10",
    status: "Aceptado",
    representative: {
      id: 1,
      name: "Pablo primero",
    },
    customer: {
      id: 2,
      name: "Juan Perez",
      country: "Argentina",
    },
    versions: [
      {
        id: 3,
        date: "2021-10-10",
        status: "Rechazado",
        representative: {
          id: 2,
          name: "Pablo",
        },
        customer: {
          name: "Juan Perez",
          country: "Argentina",
        },
        total: 1000,
      },
    ],
    total: 1000,
  },
];

const QuotesPage = () => {
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  return (
    <MainLayout>
      <div className="max-h-full h-full bg-white">
        <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
          <div className="flex">
            <Calendar
              value={dates}
              onChange={(e) => setDates(e.value)}
              className="h-min rounded-r-none"
              inputClassName="rounded-r-none border-1 border-r-0 max-w-28 border-[#D0D5DD]"
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
              showIcon
              iconPos="left"
            />
            <InputText
              label={{}}
              iconField
              iconFieldProps={{
                iconPosition: "left",
                className: "h-min",
              }}
              iconProps={{
                className: "pi pi-search",
              }}
              className="border-1 rounded-l-none border-[#D0D5DD]"
              placeholder="Fecha"
            />
          </div>

          <Button
            label="Exportar"
            className="bg-transparent text-black border-[#D0D5DD]"
            icon="pi pi-download"
          />
          <Button label="Nueva cotización" icon="pi pi-plus-circle" />
        </div>

        <ExpandableRowGroupDemo />
      </div>
    </MainLayout>
  );
};

export default QuotesPage;

// import React, { useState, useEffect, useRef } from 'react';
import {
  DataTable,
  DataTableRowToggleEvent,
  DataTableExpandedRows,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
// import { CustomerService } from './service/CustomerService';

function ExpandableRowGroupDemo() {
  const [customers, setCustomers] = useState<Quote[]>([]);
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | Quote[]
  >([]);

  useEffect(() => {
    setCustomers(QUOTES);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const headerTemplate = (data: Quote) => {
    return (
      <React.Fragment>
        {/* <img
          alt={data.representative.name}
          // src={`https://primefaces.org/cdn/primereact/images/avatar/${data.representative.image}`}
          width="32"
          style={{ verticalAlign: "middle" }}
          className="ml-2"
        /> */}
        <tr className="bg-red-500 w-full">
          <td colSpan={5} className="font-bold">
            {data.representative.name}
          </td>
          <td colSpan={5} className="font-bold">
            {data.representative.name}
          </td>
          <td colSpan={5} className="font-bold">
            {data.representative.name}
          </td>
          <td colSpan={5} className="font-bold">
            {data.representative.name}
          </td>
          <td colSpan={5} className="font-bold">
            {data.representative.name}
          </td>
        </tr>
        {/* <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.representative.name}
        </span>
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.representative.name}
        </span>
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.representative.name}
        </span>
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.representative.name}
        </span> */}
      </React.Fragment>
    );
  };

  const footerTemplate = (data: Quote) => {
    return (
      <React.Fragment>
        <td colSpan={5}>
          <div className="flex justify-content-end font-bold w-full">
            Total Customers: {calculateCustomerTotal(data.representative.name)}
          </div>
        </td>
      </React.Fragment>
    );
  };

  const countryBodyTemplate = (rowData: Version) => {
    return (
      <div className="flex align-items-center gap-2">
        {/* <img
          alt={rowData.customer.country}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          // className={`flag flag-${rowData.country.code}`}
          style={{ width: "24px" }}
        /> */}
        <span>{rowData.customer.country}</span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData: Version) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const calculateCustomerTotal = (name: string) => {
    let total = 0;

    if (customers) {
      for (let customer of customers) {
        if (customer.representative.name === name) {
          total++;
        }
      }
    }

    return total;
  };

  const getSeverity = (status: string) => {
    switch (status) {
      case "Rechazado":
        return "danger";

      case "Aceptado":
        return "success";

      case "new":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;
    }
  };

  return (
    <div className="card">
      <DataTable
        value={customers}
        rowGroupMode="subheader"
        groupRowsBy="representative.name"
        sortMode="single"
        sortField="representative.name"
        sortOrder={1}
        expandableRowGroups
        expandedRows={expandedRows}
        onRowToggle={(e: DataTableRowToggleEvent) => setExpandedRows(e.data)}
        // headerColumnGroup={
        //   <thead>
        //     <tr>
        //       <th>Name</th>
        //       <th>Country</th>
        //       <th>Status</th>
        //       <th>Date</th>
        //     </tr>
        //   </thead>
        // }
        
        rowGroupHeaderTemplate={headerTemplate}
        rowGroupFooterTemplate={footerTemplate}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="name" header="Name" style={{ width: "20%" }}></Column>
        <Column
          field="country"
          header="Country"
          body={(data: Quote) =>
            data.versions.map((version) => countryBodyTemplate(version))
          }
          style={{ width: "20%" }}
        ></Column>
        {/* <Column
          field="company"
          header="Company"
          style={{ width: "20%" }}
        ></Column> */}
        <Column
          field="status"
          header="Status"
          body={(data: Quote) =>
            data.versions.map((version) => statusBodyTemplate(version))
          }
          style={{ width: "20%" }}
        ></Column>
        <Column field="date" header="Date" style={{ width: "20%" }}></Column>
      </DataTable>
    </div>
  );
}

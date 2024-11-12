import { Button, InputText } from "@/presentation/components";
import { MainLayout } from "../layouts";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import { Nullable } from "primereact/ts-helpers";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEvent,
  DataTableValueArray,
} from "primereact/datatable";
import { Rating } from "primereact/rating";
import {
  Column,
  ColumnFilterApplyTemplateOptions,
  ColumnFilterElementTemplateOptions,
} from "primereact/column";
import { Tag } from "primereact/tag";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { format, parseISO } from 'date-fns';

type QuoteStatus = "Pendiente" | "Aceptado" | "Rechazado";

type Version = {
  id: number;
  startDate: string;
  endDate: string;
  status: QuoteStatus;
  passengers: number;
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
  startDate: string;
  endDate: string;
  status: QuoteStatus;
  passengers: number;
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
    startDate: "2024-11-10",
    endDate: "2024-11-11",
    status: "Aceptado",
    passengers: 4,
    representative: {
      id: 2,
      name: "Pablo perez",
    },
    customer: {
      id: 1,
      name: "Werner Reyes",
      country: "Argentina",
    },
    versions: [
      {
        id: 1,
        startDate: "2021-10-10",
        endDate: "2021-12-10",
        passengers: 4,
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
  {
    id: 2,
    startDate: "2021-10-10",
    endDate: "2021-12-10",
    status: "Aceptado",
    passengers: 4,
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
        startDate: "2021-10-10",
        endDate: "2021-12-10",
        passengers: 4,
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
  {
    id: 3,
    startDate: "2021-10-10",
    endDate: "2021-12-10",
    passengers: 4,
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
      // {
      //   id: 3,
      //   date: "2021-10-10",
      //   status: "Rechazado",
      //   representative: {
      //     id: 2,
      //     name: "Pablo",
      //   },
      //   customer: {
      //     name: "Juan Perez",
      //     country: "Argentina",
      //   },
      //   total: 1000,
      // },
    ],
    total: 5000,
  },
];

const QuotesPage = () => {
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  return (
    <MainLayout>
      <div className="max-h-full h-full bg-white">
        <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
          
          {/* <div className="flex">
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
          </div> */}
        

          <Button
            label="Exportar"
            className="bg-transparent text-black border-[#D0D5DD]"
            icon="pi pi-download"
          />
          <Button label="Nueva cotización" icon="pi pi-plus-circle" />
        </div>

        <RowExpansionDemo />
      </div>
    </MainLayout>
  );
};

export default QuotesPage;

function RowExpansionDemo() {
  const [products, setProducts] = useState<Quote[]>([]);
  const [representatives, setRepresentatives] = useState<
    { id: number; name: string }[]
  >([]);
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);

  useEffect(() => {
    console.log({QUOTES});
    setProducts(getCustomers(QUOTES))
    const uniqueRepresentatives = Array.from(
      new Set(QUOTES.map((quote) => quote.representative.id))
    ).map((id) => {
      return QUOTES.find((quote) => quote.representative.id === id)!
        .representative;
    });
    setRepresentatives(uniqueRepresentatives);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const expandAll = () => {
    let _expandedRows: DataTableExpandedRows = {};

    products.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const getCustomers = (data: Quote[]) => {
    return [...(data || [])].map((d) => {
      console.log({ data: new Date(d.startDate),  dataString: d.startDate })
        d.startDate = new Date(d.startDate);
        d.endDate = new Date(d.endDate);

        return d;
    });
};

const formatDate = (value: string | Date) => {
  let date;
  if (typeof value === 'string') {
    date = parseISO(value);
  } else {
    date = value;
  }

  console.log({value})

  const formattedDate = format(date, 'dd/MM/yyyy');
  console.log({formattedDate});
  return formattedDate;
};


const dateBodyTemplate = (date: Date) => {
  return formatDate(date);
};

  const collapseAll = () => {
    setExpandedRows(undefined);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const amountBodyTemplate = (rowData: Quote) => {
    return formatCurrency(rowData.total);
  };

  const statusOrderBodyTemplate = (rowData: Quote) => {
    return (
      <Tag
        value={rowData.status.toLowerCase()}
        severity={getOrderSeverity(rowData)}
      ></Tag>
    );
  };

  const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />;
  };

  const imageBodyTemplate = (rowData: Quote) => {
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`}
        alt={rowData.image}
        width="64px"
        className="shadow-4"
      />
    );
  };

  const priceBodyTemplate = (rowData: Quote) => {
    return formatCurrency(rowData.total);
  };

  const ratingBodyTemplate = (rowData: Quote) => {
    return <Rating value={rowData.total} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData: Quote) => {
    return (
      <Tag value={rowData.status} severity={getProductSeverity(rowData)}></Tag>
    );
  };

  const getProductSeverity = (product: Quote) => {
    switch (product.status) {
      case "Aceptado":
        return "success";

      case "Pendiente":
        return "warning";

      case "Rechazado":
        return "danger";

      default:
        return null;
    }
  };

  const getOrderSeverity = (order: Quote) => {
    switch (order.status) {
      case "Aceptado":
        return "success";

      case "Pendiente":
        return "warning";

      case "Rechazado":
        return "danger";

      default:
        return null;
    }
  };

  const allowExpansion = (rowData: Quote) => {
    return rowData.versions.length > 0;
  };

  const rowExpansionTemplate = (data: Quote) => {
    return (
      <div className="p-3">
        <h5>Total de versiones: {data.versions.length}</h5>
        <DataTable value={data.versions}>
          <Column
            field="id"
            header="Version"
            body={(rowData: Version) => <label>v{rowData.id}</label>}
            sortable
          ></Column>
          {/* <Column field="customer" header="Customer" sortable></Column> */}
          <Column field="customer.name" header="Cliente" sortable></Column>
          <Column field="customer.country" header="País" sortable />
          <Column field="passengers" header="Pasajeros" sortable />
          <Column
            field="startDate"
            header="Fecha de inicio"
            className="min-w-32"
            sortable
          />
          <Column
            field="endDate"
            header="Fecha fin"
            className="min-w-32"
            sortable
          />
          <Column field="representative.name" header="Representante" sortable />
          {/* <Column header="Image" body={imageBodyTemplate} /> */}
          <Column
            field="amount"
            header="Precio"
            sortable
            body={priceBodyTemplate}
          />

          <Column
            field="inventoryStatus"
            header="Status"
            sortable
            body={statusBodyTemplate}
          />
          <Column
            body={(rowData) => actionBodyTemplate(rowData, "secondary")}
            exportable={false}
            style={{ minWidth: "16rem" }}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );

  const actionBodyTemplate = (
    rowData: Quote,
    type: "principal" | "secondary"
  ) => {
    return (
      <div className="space-x-2">
        <Button icon="pi pi-pencil" rounded outlined />
        <Button icon="pi pi-eye" rounded outlined />
        <Button icon="pi pi-file-pdf" rounded outlined />
        {type === "principal" && (
          <Button icon="pi pi-envelope" rounded outlined />
        )}
        <Button icon="pi pi-trash" rounded outlined severity="danger" />
      </div>
    );
  };
  // const representativeFilterTemplate = (
  //   options: ColumnFilterElementTemplateOptions
  // ) => {
  //   console.log(options.value);

  //   return (
  //     <React.Fragment>
  //       <div className="mb-3 font-bold">Agent Picker</div>
  //       <MultiSelect
  //         value={options.value || []}
  //         options={representatives}
  //         display="chip"
  //         // optionValue="id"
  //         itemTemplate={representativesItemTemplate}
  //         onChange={(e: MultiSelectChangeEvent) =>
  //           options.filterCallback(e.value)
  //         }
  //         optionLabel="name"
  //         // filterBy="name"
  //         placeholder="Any"
  //         className="p-column-filter"
  //       />
  //     </React.Fragment>
  //   );
  // };

  const representativeFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <React.Fragment>
        <div className="mb-3 font-bold">Agent Picker</div>
        <MultiSelect
          value={options.value || []}
          options={representatives}
          itemTemplate={representativesItemTemplate}
          onChange={(e: MultiSelectChangeEvent) =>
            options.filterCallback(e.value)
          }
          // filterMatchMode="startsWith"
          dataKey="id"
          optionLabel="name"
          placeholder="Any"
          filterBy="name"
          // maxSelectedLabels={1}
          onFilter={(e) => console.log(e)}
          className="p-column-filter"
        />
      </React.Fragment>
    );
  };

  // const representativeFilterTemplate = (
  //   options: ColumnFilterElementTemplateOptions
  // ) => {
  //   return (
  //     <React.Fragment>
  //       <div className="mb-3 font-bold">Agent Picker</div>
  //       <MultiSelect
  //         value={options.value}
  //         options={representatives}
  //         itemTemplate={representativesItemTemplate}
  //         onChange={(e: MultiSelectChangeEvent) =>
  //           options.filterCallback(e.value)
  //         }
  //         optionLabel="name"
  //         placeholder="Any"
  //         className="p-column-filter"
  //       />
  //     </React.Fragment>
  //   );
  // };
  const representativesItemTemplate = (option: {
    id: number;
    name: string;
  }) => {
    return (
      <div className="flex align-items-center gap-2">
        {/* <img alt={option.representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" /> */}
        <span>{option.name}</span>
      </div>
    );
  };

  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return <Calendar
        value={options.value}
        onChange={e => e.value && options.filterCallback(e.value, options.index)}
        // showTime
        dateFormat={"dd/mm/yy"}
      
    
        showButtonBar
        showIcon
        showOnFocus={false}
    />;
};

  return (
    <div className="card">
      {/* <Toast ref={toast} /> */}
      <DataTable
        value={products}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        // onRowExpand={onRowExpand}
        // onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        // selectionMode="checkbox"

        tableStyle={{ minWidth: "60rem" }}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        paginator
        rowsPerPageOptions={[10, 25, 50]}
        filterDisplay="menu"
        globalFilterFields={["customer.name", "representative.name"]}
        rows={10}
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} cotizaciones"
        emptyMessage="No encontrado"
      >
        <Column expander={allowExpansion} style={{ width: "5rem" }} />
        <Column field="customer.name" filter header="Cliente" sortable />
        <Column field="customer.country" header="País" sortable />
        <Column field="passengers" header="Pasajeros" sortable />
        <Column
          field="startDate"
          header="Fecha de inicio"
          className="min-w-32"
          dataType="date"
          sortable
          filter
          filterField="startDate"
          // filterMatchMode="custom"
          body={(e:Quote) => dateBodyTemplate(e.startDate)}
          onFilterApplyClick={(e) => console.log({e})}
          // filterFunction={(value, filter) => {

          //   console.log({value, filter})

          // }}
         
          filterElement={dateFilterTemplate}
        />

        {/* <Column
  field="date"
  header="Date"
  sortable
  filterField="date"
  dataType="date"
  style={{ minWidth: "12rem" }}
  filter
  filterElement={dateFilterTemplate}
/>; */}
        <Column
          field="endDate"
          header="Fecha fin"
          className="min-w-32"
          body={(e:Quote) => dateBodyTemplate(e.endDate)}
          sortable
        />
        <Column
          field="representative.name"
          header="Representante"
          showFilterMatchModes={false}
          showFilterOperator={false}
          filterMenuStyle={{ width: "14rem" }}
          filter
          onFilterApplyClick={(e) => console.log(e)}
          filterMatchMode="custom"
          sortField="representative.name"
          filterField="representative"
          filterFunction={(value, filter) => {
            if (Array.isArray(filter) && filter.length === 0) {
              return true;
            }

            return Array.isArray(filter)
              ? filter.some(
                  (item) =>
                    item?.name?.toLowerCase() === value?.name?.toLowerCase()
                )
              : false;
          }}
          sortable
          filterElement={representativeFilterTemplate}
        />
        {/* <Column header="Image" body={imageBodyTemplate} /> */}
        <Column
          field="amount"
          header="Precio"
          sortable
          body={priceBodyTemplate}
        />

        <Column
          field="inventoryStatus"
          header="Status"
          sortable
          body={statusBodyTemplate}
        />
        <Column
          header="Acciones"
          body={(rowData) => actionBodyTemplate(rowData, "principal")}
          exportable={false}
          style={{ minWidth: "20rem" }}
        ></Column>
      </DataTable>
    </div>
  );
}

{
  /* <Column
  field="date"
  header="Date"
  sortable
  filterField="date"
  dataType="date"
  style={{ minWidth: "12rem" }}
  filter
  filterElement={dateFilterTemplate}
/>; */
}

{
  /* <Column header="Agent" sortable sortField="representative.name" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}
                    style={{ minWidth: '14rem' }} body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} /> */
}
{
  /* <Column
  header="Agent"
  sortable
  sortField="representative.name"
  filterField="representative"
  showFilterMatchModes={false}
  filterMenuStyle={{ width: "14rem" }}
  style={{ minWidth: "14rem" }}
  body={representativeBodyTemplate}
  filter
  filterElement={representativeFilterTemplate}
/>; */
}

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { Column } from "primereact/column";

const NotificationsPage = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const emails = [
    { id: 1, sender: "Material UI", subject: "Lorem ipsum dolor sit amet", tag: "Important", date: "12:16 pm" },
    { id: 2, sender: "Wise", subject: "Lorem ipsum dolor sit amet", tag: "", date: "12:16 pm" },
    { id: 3, sender: "Search Console", subject: "Lorem ipsum dolor sit amet", tag: "Social", date: "Apr 24" },
    { id: 4, sender: "PayPal", subject: "Lorem ipsum dolor sit amet", tag: "", date: "Apr 20" },
    { id: 5, sender: "Google Meet", subject: "Lorem ipsum dolor sit amet", tag: "", date: "Apr 16" },
    { id: 6, sender: "Loom", subject: "Lorem ipsum dolor sit amet", tag: "", date: "Mar 10" },
    { id: 7, sender: "Airbnb", subject: "Lorem ipsum dolor sit amet", tag: "", date: "Mar 05" },
    { id: 8, sender: "Facebook", subject: "Lorem ipsum dolor sit amet", tag: "", date: "Feb 25" },
    { id: 9, sender: "Instagram", subject: "Lorem ipsum dolor sit amet", tag: "Promotional", date: "Feb 20" },
  ];

  const renderTag = (rowData: any) => {
    if (rowData.tag) {
      const tagColors = {
        Important: "red",
        Social: "green",
        Promotional: "blue",
      };
      return <Badge value={rowData.tag} severity={tagColors[rowData.tag]} />;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Sidebar */}
      <div className="col-span-3 bg-gray-100 p-4 rounded-lg shadow-md">
        <Button label="Compose" icon="pi pi-pencil" className="w-full mb-4 p-button-primary" />
        <h4 className="text-lg font-semibold mb-3">MAILBOX</h4>
        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <i className="pi pi-inbox" /> Inbox
            </span>
            <Badge value="3" severity="info" />
          </li>
          <li className="flex items-center gap-2">
            <i className="pi pi-send" /> Sent
          </li>
          <li className="flex items-center gap-2">
            <i className="pi pi-file" /> Drafts
          </li>
          <li className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <i className="pi pi-ban" /> Spam
            </span>
            <Badge value="2" severity="danger" />
          </li>
          <li className="flex items-center gap-2">
            <i className="pi pi-trash" /> Trash
          </li>
          <li className="flex items-center gap-2">
            <i className="pi pi-archive" /> Archive
          </li>
        </ul>

        <h4 className="text-lg font-semibold mt-6 mb-3">FILTER</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <i className="pi pi-star" /> Starred
          </li>
          <li className="flex items-center gap-2">
            <i className="pi pi-exclamation-circle" /> Important
          </li>
        </ul>

        <h4 className="text-lg font-semibold mt-6 mb-3">LABEL</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <i className="pi pi-circle-on text-green-500" /> Personal
          </li>
          <li className="flex items-center gap-2">
            <i className="pi pi-circle-on text-red-500" /> Work
          </li>
          <li className="flex items-center gap-2">
            <i className="pi pi-circle-on text-orange-500" /> Payments
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="col-span-9 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Inbox</h3>
          <span className="flex items-center gap-2">
            <InputText
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-inputtext-sm"
            />
          </span>
        </div>

        <DataTable value={emails} paginator rows={10} globalFilter={globalFilter} className="p-datatable-sm">
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
          <Column field="sender" header="Sender" sortable></Column>
          <Column field="subject" header="Subject" sortable></Column>
          <Column body={renderTag} header="Tag"></Column>
          <Column field="date" header="Date" sortable></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default NotificationsPage;
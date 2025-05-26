import { Button, SelectButton, Toolbar } from "@/presentation/components";
import { useState } from "react";
import { CreateUserDialog, RoleTable, UserTable } from "./components";

const SELECT_BUTTON_OPTIONS = [
  { label: "Usuarios", value: "users", icon: "pi pi-users" },
  { label: "Roles", value: "rols", icon: "pi pi-address-book" },
];

const UsersPage = () => {
  const [selectedOption, setSelectedOption] = useState(
    SELECT_BUTTON_OPTIONS[0].value
  );
  const [open, setOpen] = useState(false);

  const isUserSelected = selectedOption === SELECT_BUTTON_OPTIONS[0].value;
  const isRolSelected = selectedOption === SELECT_BUTTON_OPTIONS[1].value;

  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
      <CreateUserDialog open={open} onClose={() => setOpen(false)} />
      <Toolbar
        className="mb-6"
        start={
          <SelectButton
            options={SELECT_BUTTON_OPTIONS}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            itemTemplate={(option) => {
              return (
                <div className="flex items-center font-bold gap-2">
                  <i className={option.icon} />
                  <span>{option.label}</span>
                </div>
              );
            }}
          />
        }
        end={
          <Button
            label={isUserSelected ? "Nuevo Usuario" : "Nuevo Rol"}
            icon="pi pi-plus"
            disabled={isRolSelected}
            onClick={() => setOpen(true)}
          />
        }
      />
      {isUserSelected && <UserTable />}
      {isRolSelected && <RoleTable />}
    </div>
  );
};

export default UsersPage;

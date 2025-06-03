import type { AppState } from "@/app/store";
import { dateFnsAdapter, phoneNumberAdapter } from "@/core/adapters";
import { constantStorage } from "@/core/constants";
import { roleRender, UserEntity } from "@/domain/entities";
import { useGetUsersQuery } from "@/infraestructure/store/services";
import {
  Avatar,
  Badge,
  Button,
  Column,
  ColumnGroup,
  DataTable,
  DataTableRef,
  DefaultFallBackComponent,
  ErrorBoundary,
  Row,
  Skeleton,
  Tag,
} from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FieldNotAssigned } from "../../../components";
import {
  FilterApplyButton,
  FilterByDate,
  FilterClearButton,
} from "../../../filters";
import { FilterByStatus } from "../../filters";
import { filterByStatus, getUserTransformedFilters } from "../../utils/filters";
import { UserDevices } from "../UserDevices";
import { TrashUserDialog } from "./components/TrashUserDialog";
import { TrashUser } from "./components/TrashUser";
import type { UserTableFilters } from "../../types";

const { USERS_PAGINATION } = constantStorage;

const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const UserTable = () => {
  const { usersDevicesConnections } = useSelector(
    (state: AppState) => state.users
  );

  const {
    limit,
    handlePageChange,
    currentPage,
    first,
    filters,
    handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0], USERS_PAGINATION);

  const [
    { fullname, email, role, phoneNumber, createdAt, updatedAt },
    setFilters,
  ] = useState<UserTableFilters>({
    fullname: undefined,
    email: undefined,
    role: undefined,
    phoneNumber: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const {
    currentData: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    page: currentPage,
    limit,
    fullname,
    email,
    role,
    phoneNumber,
    createdAt,
    updatedAt,
    showDevices: true,
    select: {
      id_user: true,
      fullname: true,
      email: true,
      role: {
        name: true,
      },
      phone_number: true,
      description: true,
      created_at: true,
      updated_at: true,
    },
  });

  const [usersWithDevices, setUsersWithDevices] = useState<UserEntity[]>(
    usersData?.data.content || []
  );

  const [openTrashDialog, setOpenTrashDialog] = useState(false);

  const users = usersData?.data;
  const dt = useRef<DataTableRef>(null);

  useEffect(() => {
    if (!filters) return;
    setFilters(getUserTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!usersData) return;
    setUsersWithDevices(
      usersData.data.content.map((user) => {
        const userFound = usersDevicesConnections.find(
          (userConnection) => userConnection.userId === user.id
        );
        return {
          ...user,
          activeDevices: user.activeDevices?.map((device) => ({
            ...device,
            isOnline: userFound?.ids.includes(device.deviceId) ?? false,
          })),
        };
      })
    );
  }, [usersDevicesConnections, usersData]);

  useEffect(() => {
    if (!isErrorUsers) return;
    const tdEmpty = document.querySelector(
      "#fallback-users .p-datatable-emptymessage td"
    );

    if (tdEmpty) tdEmpty.setAttribute("colspan", "12");
  }, [isErrorUsers]);

  const header = (
    <div className="flex sm:justify-between gap-y-3 flex-wrap justify-center items-center">
      <div className="flex flex-wrap gap-2 p-2 items-center">
        <h4 className="m-0 text-sm md:text-lg">Usuarios</h4>
        <Badge
          value={
            (users?.total ?? 0) > 0 ? `Total: ${users?.total ?? 0}` : "Total: 0"
          }
        />
      </div>

      <Button
        onClick={() => setOpenTrashDialog(true)}
        icon="pi pi-trash"
        label="Papelera"
        outlined
        size="small"
      />
    </div>
  );

  return (
    <>
      <TrashUserDialog
        visible={openTrashDialog}
        onHide={() => setOpenTrashDialog(false)}
      />
      <ErrorBoundary
        loadingComponent={
          <DataTable
            pt={{
              header: {
                className: "!bg-secondary",
              },
            }}
            header={header}
            className="w-full md:text-sm"
            showGridlines
            headerColumnGroup={headerColumnGroup}
            value={Array.from({
              length: users?.content.length || 10,
            })}
            lazy
            size="small"
            emptyMessage={"No hay cotizaciones"}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <Column
                key={i}
                field={`loading-${i}`}
                header="Cargando..."
                body={() => <Skeleton shape="rectangle" height="1.5rem" />}
              />
            ))}
          </DataTable>
        }
        isLoader={isLoadingUsers || isFetchingUsers}
        fallBackComponent={
          <DataTable
            value={[]}
            pt={{
              header: { className: "bg-secondary" },
            }}
            id="fallback-users"
            header={header}
            headerColumnGroup={headerColumnGroup}
            emptyMessage={
              <DefaultFallBackComponent
                isLoading={isLoadingUsers}
                message="Ha ocurrido un error al cargar los usuarios"
                isFetching={isFetchingUsers}
                refetch={refetchUsers}
              />
            }
            className="w-full md:text-sm"
            dataKey="id"
            lazy
          />
        }
        error={isErrorUsers}
      >
        <DataTable
          value={
            usersWithDevices.length > 0
              ? usersWithDevices
              : users?.content ?? []
          }
          stateStorage="custom"
          stateKey={USERS_PAGINATION}
          customSaveState={(state: any) => {
            handleSaveState({
              first,
              rows: limit,
              filters: state.filters,
            });
          }}
          paginator
          rows={limit}
          rowsPerPageOptions={ROW_PER_PAGE}
          className="w-full md:text-sm"
          emptyMessage="No hay usuarios"
          dataKey="id"
          ref={dt}
          lazy
          showGridlines
          rowHover
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} usuarios"
          pt={{
            header: { className: "bg-secondary" },
          }}
          onPage={handlePageChange}
          onFilter={handlePageChange}
          filters={filters}
          first={first}
          totalRecords={users?.total ?? 0}
          header={header}
        >
          <Column
            headerClassName="min-w-16"
            body={(rowData) => (
              <Avatar
                badge={{
                  className: "size-2",
                  severity: rowData?.online ? "success" : "danger",
                }}
                shape="circle"
                label={rowData?.fullname}
                pt={{
                  label: { className: "text-md font-bold" },
                }}
                className="size-10 p-overlay-badge"
              />
            )}
          />
          <Column
            field="id"
            headerClassName="min-w-16"
            header="Código"
            align={"center"}
          />
          <Column
            headerClassName="min-w-24"
            field="fullname"
            header="Nombre"
            align={"center"}
            filter
            filterField="fullname"
            filterPlaceholder="Buscar Nombre"
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            filterMenuClassName="text-sm"
            filterApply={(options) => <FilterApplyButton {...options} />}
            filterClear={(options) => <FilterClearButton {...options} />}
          />
          <Column
            field="email"
            headerClassName="min-w-32"
            header="Correo Electrónico"
            align={"center"}
            filter
            filterField="email"
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            filterMenuClassName="text-sm"
            filterApply={(options) => <FilterApplyButton {...options} />}
            filterClear={(options) => <FilterClearButton {...options} />}
            filterPlaceholder="Buscar Email"
          />
          <Column
            header="Rol"
            headerClassName="min-w-24"
            align={"center"}
            body={(rowData: UserEntity) => {
              if (!rowData?.role) return null;
              const { label, severity, icon } = roleRender[rowData.role.name];
              return <Tag value={label} severity={severity} icon={icon} />;
            }}
            filterField="role.name"
            filterMatchMode="custom"
            filterFunction={filterByStatus}
            filterType="custom"
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            filter
            filterElement={(options) => <FilterByStatus options={options} />}
            filterApply={(options) => <FilterApplyButton {...options} />}
            filterClear={(options) => <FilterClearButton {...options} />}
          />

          <Column
            headerClassName="min-w-32"
            header="Dispositivos"
            align={"center"}
            body={(rowData: UserEntity) => (
              <UserDevices
                userId={rowData.id}
                activeDevices={rowData?.activeDevices}
              />
            )}
          />

          <Column
            headerClassName="min-w-40"
            header="Teléfono"
            align={"center"}
            body={(rowData: UserEntity) => {
              if (!rowData?.phoneNumber)
                return <FieldNotAssigned message="No asignado" />;
              return phoneNumberAdapter.format(rowData.phoneNumber);
            }}
          />

          <Column
            header="Descripción"
            headerClassName="min-w-40"
            align={"center"}
            body={(rowData: UserEntity) => {
              if (!rowData?.description)
                return <FieldNotAssigned message="No asignado" />;
              return rowData.description;
            }}
          />

          <Column
            header="Fecha de Creación"
            headerClassName="min-w-24"
            align={"center"}
            body={(rowData) => dateFnsAdapter.format(rowData.createdAt)}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            showApplyButton={false}
            filterField="createdAt"
            dataType="date"
            filterMatchMode="gte"
            filter
            filterClear={(options) => <FilterClearButton {...options} />}
            filterElement={(options) => (
              <FilterByDate
                options={options}
                placeholder="Selecciona una fecha"
              />
            )}
          />

          <Column
            header="Última Actualización"
            headerClassName="min-w-24"
            align={"center"}
            body={(rowData) => dateFnsAdapter.format(rowData.updatedAt)}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            showApplyButton={false}
            filterField="updatedAt"
            dataType="date"
            filterMatchMode="gte"
            filter
            filterClear={(options) => <FilterClearButton {...options} />}
            filterElement={(options) => (
              <FilterByDate
                options={options}
                placeholder="Selecciona una fecha"
              />
            )}
          />

          <Column
            header="Acciones"
            align="center"
            body={(user: UserEntity) => {
              return (
                <div className="flex justify-center gap-x-2">
                  <TrashUser user={user} />
                </div>
              );
            }}
          />
        </DataTable>
      </ErrorBoundary>
    </>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row className="w-full">
      <Column headerClassName="min-w-16" />
      <Column
        header="Código"
        field="id"
        headerClassName="min-w-16"
        align={"center"}
      />
      <Column
        headerClassName="min-w-24"
        header="Nombre"
        field="fullname"
        filter
        filterField="fullname"
        align={"center"}
        filterPlaceholder="Buscar Nombre"
      />
      <Column
        headerClassName="min-w-32"
        header="Correo Electrónico"
        field="email"
        align={"center"}
        filter
        filterPlaceholder="Buscar Email"
      />
      <Column
        header="Rol"
        headerClassName="min-w-24"
        align={"center"}
        filter
        filterPlaceholder="Buscar Rol"
      />

      <Column
        header="Dispositivos"
        headerClassName="min-w-32"
        align={"center"}
      />
      <Column header="Teléfono" align={"center"} headerClassName="min-w-40" />
      <Column
        header="Descripción"
        align={"center"}
        headerClassName="min-w-40"
      />
      <Column
        header="Fecha de Creación"
        align={"center"}
        filter
        headerClassName="min-w-24"
        filterPlaceholder="Buscar Fecha de Creación"
      />
      <Column
        header="Última Actualización"
        align={"center"}
        filter
        headerClassName="min-w-24"
        filterPlaceholder="Buscar Fecha de Actualización"
      />
    </Row>
  </ColumnGroup>
);

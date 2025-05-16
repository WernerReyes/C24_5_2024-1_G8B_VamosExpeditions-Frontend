import {
  Avatar,
  Badge,
  Menubar,
  Menu,
  type MenuItem,
  DataTable,
  Column,
  Button,
  TabView,
  InputTextarea,
  MultiSelect,
  MultiSelectChangeEvent,
} from "@/presentation/components";
import { useState } from "react";

import { cn } from "@/core/adapters";

import "./Navbar.css";

import { useSidebar } from "../../hooks";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { constantRoutes } from "@/core/constants";
import {
  notificationSocket,
  useGetAllNotificationsQuery,
  useLogoutMutation,
} from "@/infraestructure/store/services";
import { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";

import { messageTimestamp } from "@/core/utils";
import { NotificationMessageEntity, UserEntity } from "@/domain/entities";
import {
  useDeleteNotificationsMutation,
  useMarkNotificationsAsReadMutation,
} from "@/infraestructure/store/services";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendNotificationDto,
  SendNotificationDto,
} from "@/domain/dtos/notification";

const { PROFILE } = constantRoutes.private;

const ITEMS: MenuItem[] = [
  {
    id: "profile",
    label: "Perfil",
    icon: "pi pi-user",
  },
  {
    id: "logout",
    label: "Cerrar sesión",
    icon: "pi pi-sign-out",
  },
];

export const Navbar = () => {
  const [deleteNotifications, {}] = useDeleteNotificationsMutation();
  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();
  const { currentData: notifications } = useGetAllNotificationsQuery();

  const navigate = useNavigate();
  const { authUser } = useSelector((state: AppState) => state.auth);
  const [logout] = useLogoutMutation();
  const { toggleSidebar } = useSidebar();
  const { users } = useSelector((state: AppState) => state.users);

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  

  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    []
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, /* errors */ },
  } = useForm<SendNotificationDto>({
    resolver: zodResolver(sendNotificationDto.schema),
  });

  const onSubmitNotification = (data: SendNotificationDto) => {
    notificationSocket.sendNotification({
      from_user: authUser?.id as number,
      to_user: data.to_user,
      message: data.message,
    });

    setValue("message", "");
    setValue("to_user", []);
  };

  const itemsMessage: MenuItem[] = [
    {
      template: () => {
        return (
          <>
            <TabView
              className="my-0 mx-0"
              tabPanelContent={[
                {
                  header: `Notificaciones  ${notifications?.length} 🔔`,
                  className: "w-full h-full ",
                  children: (
                    <>
                      <div className="flex gap-2 mb-4 mt-0 ">
                        <Button
                          icon="pi pi-trash"
                          label="Eliminar"
                          size="small"
                          severity="danger"
                          disabled={selectedNotifications?.length === 0}
                          onClick={() => {
                            deleteNotifications({
                              id: selectedNotifications,
                            }).unwrap();
                            setSelectedNotifications([]);
                          }}
                        />
                        <Button
                          icon="pi pi-eye"
                          label="Marcar como leídas"
                          size="small"
                          disabled={
                            selectedNotifications?.length === 0 ||
                            notifications
                              ?.filter((p) =>
                                selectedNotifications.includes(p.id)
                              )
                              .every((p) => p.is_read)
                          }
                          onClick={() => {
                            markNotificationsAsRead({
                              id: selectedNotifications,
                            }).unwrap();
                            setSelectedNotifications([]);
                          }}
                        />
                      </div>

                      <DataTable
                        dataKey="id"
                        value={notifications || []}
                        paginator
                        rows={10}
                        scrollable
                        scrollHeight="500px"
                        selection={
                          selectedNotifications.length > 0
                            ? notifications?.filter((p) =>
                                selectedNotifications.includes(p.id)
                              ) ?? []
                            : []
                        }
                        selectionMode="multiple"
                        onSelectionChange={(
                          e: DataTableSelectionMultipleChangeEvent<
                            NotificationMessageEntity[]
                          >
                        ) =>
                          setSelectedNotifications(
                            e.value.map((item) => item.id)
                          )
                        }
                      >
                        <Column
                          selectionMode="multiple"
                          style={{ width: "5%" }}
                        ></Column>

                        <Column
                          field="message"
                          style={{ width: "auto", height: "auto" }}
                          header={
                            <span className="text-lg font-semibold text-gray-800">
                              🔔 Notificaciones
                            </span>
                          }
                          /* body */
                          body={(rowData: NotificationMessageEntity) => (
                            <>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    shape="circle"
                                    badge={{
                                      severity: authUser?.online
                                        ? "success"
                                        : "danger",
                                    }}
                                    label={authUser?.fullname
                                      ?.charAt(0)
                                      .toUpperCase()}
                                    className=" bg-tertiary text-white"
                                  />

                                  <div>
                                    <p className="text-md font-semibold text-gray-900">
                                      {rowData.user?.fullname}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                      {messageTimestamp(
                                        new Date(rowData.created_at)
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    icon={
                                      rowData.is_read
                                        ? "pi pi-eye"
                                        : "pi pi-eye-slash"
                                    }
                                    rounded
                                    text
                                    disabled={rowData.is_read}
                                    pt={{
                                      icon: {
                                        style: {
                                          fontSize: "1.5rem",
                                        },
                                      },
                                    }}
                                    onClick={() => {
                                      markNotificationsAsRead({
                                        id: [rowData.id],
                                      }).unwrap();
                                      setSelectedNotifications([]);
                                    }}
                                  />

                                  <Button
                                    icon="pi pi-trash"
                                    rounded
                                    text
                                    severity="danger"
                                    pt={{
                                      icon: {
                                        style: {
                                          fontSize: "1.5rem",
                                        },
                                      },
                                    }}
                                    disabled={
                                      (selectedNotifications?.length ?? 0) > 0
                                    }
                                    onClick={() => {
                                      deleteNotifications({
                                        id: [rowData.id],
                                      }).unwrap();
                                      setSelectedNotifications([]);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="mt-2">
                                <p
                                  className={`text-gray-700 text-sm text-justify   font-semibold`}
                                >
                                  {rowData.message}
                                </p>
                              </div>
                            </>
                          )}
                          /* body */
                        />
                      </DataTable>
                    </>
                  ),
                },
                {
                  header: "Enviar Notificaciones 🔔",
                  className: "w-full h-full",
                  children: (
                    <>
                      <form
                        className="text-tertiary text-[16px] font-bold mb-4
                        w-full
                        "
                        onSubmit={handleSubmit(onSubmitNotification)}
                      >
                        <div className=" w-full">
                          <Controller
                            name="to_user"
                            defaultValue={[]}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <MultiSelect
                                id="to_user"
                                label={{
                                  text: "Para",
                                  className: "text-lg font-semibold",
                                }}
                                options={
                                  users.filter(
                                    (user) => user.id !== authUser?.id
                                  ) || []
                                }
                                multiple
                                filter
                                className="w-full"
                                placeholder="Para"
                                optionValue="id"
                                invalid={!!error}
                                {...field}
                                onChange={(e: MultiSelectChangeEvent) => {
                                  field.onChange(e.value);
                                }}
                                small={{
                                  text: error?.message,
                                  className: "text-red-500",
                                }}

                                display="chip"
                                optionLabel="fullname"
                                itemTemplate={userTemplate}
                              />
                            )}
                          />
                        </div>

                        <Controller
                          name="message"
                          control={control}
                          defaultValue=""
                          render={({ field, fieldState: { error } }) =>{
                            
                            return(
                            <InputTextarea
                              
                              id="message"
                              rows={4}
                              cols={20}
                              label={{
                                text: "Mensaje",
                                className: "text-lg font-semibold",
                              }}
                              className="w-full mt-2"
                              placeholder="Escribe tu mensaje..."
                              invalid={!!error}
                              {...field}
                              /* onChange={(e) => {
                                field.onChange(e.target.value);
                              }} */
                              small={{
                                text: error?.message,
                                className: "text-red-500",
                              }}
                            />
                          )}}
                        />
                        

                        <div className="flex justify-end mt-2">
                          <Button
                            label="Enviar"
                            type="submit"
                            size="large"
                            icon="pi pi-send"
                            disabled={!isDirty}
                          />
                        </div>
                      </form>
                    </>
                  ),
                },
              ]}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Menubar
        menuIcon={null}
        start={() => (
          <i
            className="text-2xl pi pi-bars cursor-pointer"
            onClick={() => {
              toggleSidebar();
            }}
          />
        )}
        end={() => (
          <div className="flex items-center gap-7">
            <i
              className="pi pi-bell text-2xl cursor-pointer hover:text-slate-200 p-overlay-badge"
              style={{ fontSize: "2rem" }}
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
            >
              <Badge
                value={
                  Array.isArray(notifications)
                    ? notifications.filter((item) => !item.is_read).length
                    : 0
                }
                className="bg-red-600"
                onClick={() => {}}
              />
            </i>

            <div className="flex gap-x-2 items-center">
              <Avatar
                shape="circle"
                badge={{
                  severity: authUser?.online ? "success" : "danger",
                }}
                label={authUser?.fullname}
                className=" bg-tertiary"
                onClick={() => setShowMenu(!showMenu)}
              />
              <span className="text-white">{authUser?.fullname}</span>
              <i
                className="pi pi-angle-down text-white cursor-pointer hover:text-slate-200"
                onClick={() => setShowMenu(!showMenu)}
              />
            </div>
          </div>
        )}
        className="fixed-menubar z-[1000]"
      />

      <Menu
        id="popup_menu_left"
        model={ITEMS.map((item) => ({
          ...item,
          command: () => {
            if (item.id === "profile") {
              navigate(PROFILE);
            }

            if (item.id === "logout") {
              logout();
            }
          },
        }))}
        aria-controls="popup_menu_left"
        className={cn(
          !showMenu ? "hidden" : "fixed z-[1000]",
          "right-1 top-[60px]"
        )}
        popupAlignment="left"
      />

      <Menu
        model={itemsMessage}
        className={cn(
          !showNotifications ? "hidden" : "fixed z-[1000]",
          "sm:right-32 top-[70px] right-auto sm:w-[500px] w-auto"
        )}
      />
    </>
  );
};

const userTemplate = (option: UserEntity) => {
  return (
    <div
      className="
        flex
        items-center gap-x-3
      "
    >
      <Avatar
        badge={{
          severity: option.online ? "success" : "danger",
        }}
        icon="pi pi-user"
        shape="circle"
      />

      <p className="font-bold ">{option.fullname}</p>
    </div>
  );
};

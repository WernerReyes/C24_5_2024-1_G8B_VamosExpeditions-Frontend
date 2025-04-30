import { cn } from "@/core/adapters";
import { constantRoutes } from "@/core/constants";
import { messageTimestamp } from "@/core/utils";
import {
  useGetAllNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from "@/infraestructure/store/services";
import { Badge, Button, Link } from "@/presentation/components";
import { useClickOutside } from "primereact/hooks";
import { useRef, useState } from "react";

const { NOTIFICATIONS } = constantRoutes.private;

const TABS = [
  {
    id: "all",
    label: "Todos",
  },
  {
    id: "unread",
    label: "Sin leer",
  },
] as const;

type Tab = (typeof TABS)[number]["id"];

export const Notifications = () => {
 
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0].id);

  const { currentData: notifications } = useGetAllNotificationsQuery();

  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();

  const [showNotifications, setShowNotifications] = useState(false);

  const ref = useRef(null);
  const iconRef = useRef<HTMLElement>(null); // Referencia para el icono de la campana

  useClickOutside(ref, (event: MouseEvent) => {
    if (
      iconRef.current &&
      !(event.target instanceof Node && iconRef.current.contains(event.target))
    ) {
      setShowNotifications(false);
    }
  });

  return (
    <div className="relative">
      {/* Icono de la campana */}
      <i
        ref={iconRef} // Asignar la referencia al icono de la campana
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
        />
      </i>

      {/* Notifications Dropdown */}
      <div
        ref={ref}
        className={cn(
          "absolute top-10 sm:right-0 z-[1000]",
          showNotifications ? "animation-enter" : "animation-leave",
          "max-sm:left-1/2 transform  translate-x-1/4  max-[380px]:-translate-x-1/4 max-sm:-translate-x-1/2 sm:translate-x-0"
        )}
      >
        <div className="p-4 text-black bg-white rounded-lg shadow-md w-full sm:w-96">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notificaciones</h3>
            <div className="flex items-center gap-2">
              <Button
                icon="pi pi-plus"
                rounded
                text
                size="small"
                tooltip="Crear nueva"
                
              />
              <Button
                icon="pi pi-check"
                rounded
                text
                size="small"
                tooltip="Marcar todas como leídas"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={cn(
                "flex-1 text-center py-2",
                activeTab === TABS[0].id
                  ? "border-b-2 border-primary font-semibold"
                  : "text-gray-500"
              )}
              onClick={() => setActiveTab(TABS[0].id)}
            >
              {TABS[0].label}
            </button>
            <button
              className={cn(
                "flex-1 text-center py-2",
                activeTab === TABS[1].id
                  ? "border-b-2 border-primary font-semibold"
                  : "text-gray-500"
              )}
              onClick={() => setActiveTab(TABS[1].id)}
            >
              {TABS[1].label}
            </button>
          </div>

          {/* Content */}
          <div className="max-h-60 invisible-scrollbar overflow-y-auto">
            {(() => {
              const filteredNotifications =
                activeTab === TABS[1].id
                  ? notifications?.filter(
                      (notification) => !notification.is_read
                    )
                  : notifications;

              if (
                !filteredNotifications ||
                filteredNotifications.length === 0
              ) {
                return (
                  <div className="text-center bg-gray-100 p-4 rounded-md">
                    {activeTab === TABS[1].id
                      ? "No hay notificaciones sin leer"
                      : "No hay notificaciones"}
                  </div>
                );
              }

              return filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start max-w-400 gap-3 border-b-2 border-gray-200 mb-3 hover:bg-gray-100"
                >
                  <i className={`pi pi-envelope  text-primary text-lg`} />
                  <Link
                    to={`/notifications/${notification.id}`}
                    className="flex-grow line-clamp-1 hover:underline underline-offset-2"
                    onClick={() => {
                      if (!notification.is_read) {
                        markNotificationsAsRead({
                          id: [notification.id],
                        });
                      }
                    }}
                  >
                    <p
                      className={cn(
                        "text-sm text-clip",
                        notification.is_read ? "font-normal" : "font-semibold"
                      )}
                    >
                      Hola:
                      <span> {notification.message}</span>
                    </p>
                  </Link>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {messageTimestamp(new Date(notification.created_at))}
                    </span>
                    <div
                      className={cn(
                        "inline-block items-center gap-1 ml-2",
                        notification.is_read ? "text-primary" : "text-gray-400"
                      )}
                    >
                      <i
                        style={{ fontWeight: "900" }}
                        className="pi pi-check text-xs"
                      />
                      <i
                        style={{ fontWeight: "900" }}
                        className="pi pi-check text-xs"
                      />
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-4 mt-4">
            <Link 
             to={NOTIFICATIONS}
            className="text-primary text-sm hover:underline">
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

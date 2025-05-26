import React from "react";
import { Dialog, Dropdown, InputSwitch, Button } from "@/presentation/components";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const DEVICES_LIMIT = [3, 5, 10, Infinity]; //* Infinity = no limit

const CLEANUP_INTERVAL = [7, 15, 30, 60]; //* Days

export const AdvancedSettingDialog: React.FC<Props> = ({
  showModal,
  setShowModal,
}) => {
  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Guardar Cambios"
        icon="pi pi-check"
        onClick={() => setShowModal(false)}
        className="p-button-primary"
        autoFocus
      />
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setShowModal(false)}
        className="p-button-secondary"
      />
    </div>
  );

  return (
    <Dialog
      header="Configuración del Sistema"
      visible={showModal}
      className="w-full max-w-2xl"
      footer={footer}
      onHide={() => setShowModal(false)}
    >
      <p className="text-gray-600 mb-6">
        Administra la configuración avanzada de tu cuenta y dispositivos.
      </p>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <i className="pi pi-wifi text-blue-500"></i>
          <h2 className="text-lg font-semibold">Dispositivos Conectados</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="mb-4">
            <h3 className="mb-1 font-semibold">Límite de dispositivos</h3>
            <p className="text-gray-600 text-sm mb-2">
              Máximo número de dispositivos permitidos
            </p>
            <div className="flex items-center md:justify-between gap-y-3 flex-wrap">
              <Dropdown
                options={DEVICES_LIMIT}
                value={DEVICES_LIMIT[0]}
                valueTemplate={(item) =>
                  item !== Infinity
                    ? <>Máximo {item} dispositivos</>
                    : "Ilimitado"
                }
                itemTemplate={(item) =>
                  item!== Infinity
                   ? <>Máximo {item} dispositivos</>
                    : "Ilimitado"
                }
                checkmark
                placeholder="Selecciona un límite"
              />
              <p className="text-gray-500 text-sm">
                Actualmente: 3 de 3 dispositivos utilizados
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded">
              <div className="flex items-center gap-3">
                <i className="pi pi-desktop text-gray-600"></i>
                <div>
                  <p className="font-medium">MacBook Pro</p>
                  <p className="text-gray-500 text-sm">
                    Chrome • IP: 192.168.1.10
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                  Activo
                </span>
                <i className="pi pi-ellipsis-h text-gray-400 cursor-pointer"></i>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded">
              <div className="flex items-center gap-3">
                <i className="pi pi-mobile text-gray-600"></i>
                <div>
                  <p className="font-medium">iPhone 15</p>
                  <p className="text-gray-500 text-sm">
                    Safari • IP: 192.168.1.15
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                  Inactivo
                </span>
                <i className="pi pi-ellipsis-h text-gray-400 cursor-pointer"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <i className="pi pi-database text-orange-500"></i>
          <h2 className="text-lg font-semibold">Gestión de Almacenamiento</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Limpieza automática</p>
              <p className="text-gray-600 text-sm">
                Eliminar archivos temporales cada 60 días
              </p>
            </div>

            <InputSwitch
              checked={true}
              onChange={(e) => console.log(e.checked)}
            />

           
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-3">
          <Dropdown
            className="w-full"
            value={30}
            valueTemplate={(item) => <>Cada {item} días</>}
            options={CLEANUP_INTERVAL}
            itemTemplate={(item) => <>Cada {item} días</>}
            checkmark
            placeholder="Selecciona un límite"
          />
        </div>
      </div>
    </Dialog>
  );
};

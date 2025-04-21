import { useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { roleRender } from "@/domain/entities";
import { Avatar, Button, Card, Divider, Tag } from "@/presentation/components";
import { EditModalProfile } from "./components";
import { phoneNumberAdapter } from "@/core/adapters";
import { EditModalPassword } from "./components/EditModalPassword";

export const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const { authUser } = useSelector((state: AppState) => state.auth);

  const { label, severity } = roleRender[authUser!.role!.name];

  return (
    <>
      <EditModalProfile
        showModal={isEditModalOpen}
        setShowModal={setIsEditModalOpen}
      />
      <EditModalPassword
        showModal={isChangePasswordModalOpen}
        setShowModal={setIsChangePasswordModalOpen}
      />
      <div className="flex justify-center h-full items-center">
        <Card className="w-full shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Sidebar */}
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center  text-center">
              <Avatar
                badge={{
                  className: "w-6 h-6 mt-2 me-4",
                  severity: authUser?.online ? "success" : "danger",
                }}
                shape="circle"
                label={authUser?.fullname}
                pt={{
                  label: { className: "text-6xl font-bold" },
                }}
                className="mb-3 w-40 h-40 p-overlay-badge"
              />

              <h4 className="text-xl font-semibold">{authUser?.fullname}</h4>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  label="Editar Perfil"
                  icon="pi pi-pencil"
                  outlined
                  onClick={() => setIsEditModalOpen(true)}
                />
                <Button
                  label="Cambiar Contraseña"
                  icon="pi pi-lock"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                />
              </div>
            </div>

            <Divider layout="vertical" />

            {/* Profile Details */}
            <div className="w-full md:w-2/3">
              <h3 className="text-lg font-semibold border-b pb-2">
                Información personal
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <p>
                  <label className="block text-slate-400">
                    Nombres completos:
                  </label>{" "}
                  {authUser?.fullname}
                </p>

                <p>
                  <label className="block text-slate-400">Email:</label>{" "}
                  {authUser?.email}
                </p>
                <p>
                  <label className="block text-slate-400">Phone:</label>
                  {phoneNumberAdapter
                    .parse(authUser?.phoneNumber || "")
                    ?.formatInternational()}
                </p>
              </div>
              <h3 className="text-lg font-semibold border-b pb-2 mt-6">
                Estado de la cuenta
              </h3>
              <div className="grid grid-cols-2 w-full xl:w-1/2 mx-auto gap-4 mt-4">
                <Card className="bg-slate-50">
                  <div className="flex items-center gap-x-1">
                    <i className="pi pi-user me-2 text-primary" />
                    <h3 className="text-lg font-semibold">Cuenta</h3>
                  </div>

                  <Tag value="Activo" severity="success" />
                </Card>

                <Card className="bg-slate-50">
                  <div className="flex items-center gap-x-1">
                    <i className="pi pi-shield me-2 text-primary" />
                    <h3 className="text-lg font-semibold">Role</h3>
                  </div>

                  <Tag value={label} severity={severity} />
                </Card>
              </div>
              <h3 className="text-lg font-semibold border-b pb-2 mt-6">
                Sobre mí
              </h3>
              <p className="mt-4 text-gray-600">
                {authUser?.description || "Sin descripción"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;

import { onOnline } from "@/infraestructure/store";
import { Button, Dialog, Offline } from "@/presentation/components";
import { useDispatch } from "react-redux";

export const OfflineDialog = () => {
  const dispatch = useDispatch();
  return (
    <Offline
      onChange={(online) => {
        dispatch(onOnline(online));
      }}
    >
      <Dialog
        style={{
          maxWidth: "30vw",
        }}
        closable={false}
        className="bg-white rounded-2xl shadow-lg p-8 mx-4 text-center"
        visible
        onHide={() => {}}
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="pi pi-wifi text-4xl text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Whoops! No hay señal</h3>
        <p className="text-gray-500 mb-6">
          Parece que estás en una zona sin conexión a internet. ¡No te
          preocupes, estamos trabajando para reconectar!
        </p>

        <Button className="w-full rounded-full" label="Reconectando" loading />
      </Dialog>
    </Offline>
  );
};

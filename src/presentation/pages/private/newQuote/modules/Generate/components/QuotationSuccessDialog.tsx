import type { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import { useCleanStore } from "@/infraestructure/hooks";
import { onSetOperationType } from "@/infraestructure/store";
import { Button, Dialog } from "@/presentation/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const { QUOTES, EDIT_QUOTE } = constantRoutes.private;

export const QuotationSuccessDialog = ({ visible, setVisible }: Props) => {
  const { quoteId, version } = useParams<{
    quoteId: string;
    version: string;
  }>();
  const { cleanGenerateNewQuotation } = useCleanStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const handleAccept = () => {
    if (visible) {
      setVisible(false);
      if (!quoteId && !version) {
        dispatch(onSetOperationType("edit"));
        navigate(
          `${EDIT_QUOTE}/${currentVersionQuotation?.id.quotationId}/${currentVersionQuotation?.id.versionNumber}`
        );
        cleanGenerateNewQuotation();
        return;
      }
    }
  };

  const handleWatchQuotes = () => {
    if (visible) {
      if (!quoteId && !version) {
        cleanGenerateNewQuotation();
      } else {
        navigate(QUOTES);
      }
      setVisible(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      style={{
        width: "500px",
      }}
      onHide={() => {
        if (visible) {
          setVisible(false);
        }
      }}
      contentClassName="flex items-center overflow-x-hidden"
    >
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className="rounded-full bg-[#00A7B5]/10 p-3">
          <i className="pi pi-check-circle text-[#00A7B5] text-5xl"></i>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">
            ¡Cotización {currentVersionQuotation?.name} creada!
          </h3>
          <p className="text-[#00A7B5] font-medium"></p>
          <p className="text-gray-500 text-sm">
            La cotización ha sido creada exitosamente y está lista para ser
            enviada al cliente.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            label="Aceptar"
            icon="pi pi-check"
            className="bg-[#00A7B5] text-white hover:bg-[#008A95]"
            onClick={handleAccept}
          />
          <Button
            label="Ver cotizaciones"
            icon="pi pi-eye"
            className="p-button-outlined border-[#00A7B5] text-[#00A7B5] hover:bg-[#00A7B5]/10"
            onClick={handleWatchQuotes}
          />
        </div>
      </div>
    </Dialog>
  );
};

import { useVerify2FAEmailQuery } from "@/infraestructure/store/services";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const TwoFAConfirmEmailPage = () => {
  const { tempToken } = useParams<{
    tempToken: string;
  }>();
  const { isError, isSuccess } = useVerify2FAEmailQuery(tempToken!, {
    skip: !tempToken,
  });


  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        window.close();
      }, 5000);
    }
  }, [isSuccess, isError]);

  return (
    <div>
      {isSuccess && "Email confirmado correctamente"}
      {isError && "Error al confirmar el email"}
    </div>
  );
};

export default TwoFAConfirmEmailPage;

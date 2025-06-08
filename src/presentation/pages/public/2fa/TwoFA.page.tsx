import { useEffect, useState } from "react";

import { TabView, Button, InputOtp, Image } from "@/presentation/components";
import {
  useConnectSocketQuery,
  useGenerateTwoFactorAuthenticationQuery,
  useSendEmailToVerify2FAMutation,
  useSetTokenFrom2FAEmailMutation,
  useVerify2FAAnfAuthenticateUserMutation,
} from "@/infraestructure/store/services";
import { useNavigate, useParams } from "react-router-dom";
import { constantRoutes } from "@/core/constants";
import { useCookieExpirationStore } from "@/infraestructure/hooks";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/app/store";
import { onSetemail2FAsuccess } from "@/infraestructure/store";

const { LOGIN } = constantRoutes.public;
const { DASHBOARD } = constantRoutes.private;

const TwoFAPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tempToken } = useParams<{
    tempToken: string;
  }>();
  const { isError, data } = useGenerateTwoFactorAuthenticationQuery(
    tempToken!,

    {
      skip: !tempToken,
    }
  );

  const [
    verify2FAAnfAuthenticateUser,
    {
      isLoading: isLoadingVerify2FAAnfAuthenticateUser,
      isError: isErrorVerify2FAAnfAuthenticateUser,
    },
  ] = useVerify2FAAnfAuthenticateUserMutation();

  const [
    sendEmailToVerify2FA,
    {
      isLoading: isLoadingSendEmailToVerify2FA,
      // isError: isErrorSendEmailToVerify2FA,
      isSuccess: isSuccessVerify2FAAnfAuthenticateUser,
      isUninitialized: isUninitializedSendEmailToVerify2FA,
    },
  ] = useSendEmailToVerify2FAMutation();

  const [
    setTokenFrom2FAEmail,
    { isLoading: isLoadingSetTokenFrom2FA, isSuccess },
  ] = useSetTokenFrom2FAEmailMutation();

  const { email2FAsuccess } = useSelector((state: AppState) => state.auth);

  const { init } = useCookieExpirationStore();

  useConnectSocketQuery(tempToken);

  const handleVerify2FAAnfAuthenticateUser = () => {
    verify2FAAnfAuthenticateUser({
      code,
      userId: data!.data.userId,
    })
      .unwrap()
      .then(({ data }) => {
        init(data.expiresAt);
        // navigate(DASHBOARD);
        window.location.href = DASHBOARD;
      });
  };

  const handleSendEmailToVerify2FA = () => {
    if (!tempToken) return;
    sendEmailToVerify2FA(tempToken);
  };

  useEffect(() => {
    if (isError) {
      navigate(LOGIN);
    }
  }, [isError]);

  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (!code) return;
    if (code.length === 6) {
      handleVerify2FAAnfAuthenticateUser();
    }
  }, [code]);

  useEffect(() => {
    if (email2FAsuccess) {
      setTokenFrom2FAEmail(tempToken!)
        .unwrap()
        .then(({ data }) => {
          init(data.expiresAt);
          setTimeout(() => {
            window.location.href = DASHBOARD;
          }, 5000);
        })
        .finally(() => {
          dispatch(onSetemail2FAsuccess(false));
        });
    }
  }, [email2FAsuccess]);

  return (
    <section className="bg-login bg-no-repeat bg-cover bg-center min-h-screen  flex justify-center items-center">
      <div className="mx-10 w-80 bg-secondary px-8 py-10 my-5 rounded-lg  shadow-lg sm:w-[30rem]">
        <div className="text-center mb-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="pi pi-shield text-primary text-2xl"></i>
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-2">
            Autentificación de dos factores
          </h4>
        </div>

        <TabView
          pt={{
            root: {
              className: "!bg-transparent",
            },

            panelContainer: {
              className: "!bg-transparent",
            },
          }}
          tabPanelContent={[
            {
              pt: {
                root: {
                  className: "!bg-transparent",
                },

                headerAction: {
                  className: "!bg-transparent",
                },
              },
              header: "Authenticator",
              leftIcon: "pi pi-mobile mr-2",

              children: (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Authenticator App</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Usa Google Authenticator, Authy, o apps similares
                    </p>

                    <div className="flex justify-center mb-4">
                      <Image
                        preview
                        src={data?.data.qrCodeImageUrl}
                        className="size-40 bg-gray-200 rounded-lg flex justify-center items-center text-xl font-bold cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      <InputOtp
                        disabled={isLoadingVerify2FAAnfAuthenticateUser}
                        value={code}
                        invalid={isErrorVerify2FAAnfAuthenticateUser}
                        length={6}
                        onChange={(e) => {
                          setCode(e.value as string);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              header: "Email",
              leftIcon: "pi pi-envelope mr-2",
              pt: {
                root: {
                  className: "!bg-transparent",
                },

                headerAction: {
                  className: "!bg-transparent",
                },
              },
              children: (
                <div className="text-center space-y-3 mb-3">
                  <div className="text-sm text-gray-600">
                    Enviaremos un mensaje de confirmación a:
                    <strong>{data?.data.email}</strong>
                  </div>
                  {/* <ProgressSpinner /> */}
                  {!isUninitializedSendEmailToVerify2FA && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-primary/20">
                      {/* <Loader className="w-8 h-8 animate-spin text-blue-600" /> */}
                      <i className="pi pi-envelope animate-bounce text-3xl duration-1000 text-primary"></i>
                      <div className="text-center">
                        <p className="text-primary font-medium mb-2">
                          Verifica tu correo...
                        </p>
                        <p className="text-sm text-primary italic animate-pulse">
                          {isLoadingSendEmailToVerify2FA &&
                            "Enviando correo..."}
                          {isSuccessVerify2FAAnfAuthenticateUser &&
                            !isSuccess &&
                            "Esperando confirmación..."}

                          {isSuccess && "Email confirmado correctamente"}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    label="Enviar confirmación"
                    icon="pi pi-envelope"
                    onClick={handleSendEmailToVerify2FA}
                    loading={
                      isLoadingSendEmailToVerify2FA || isLoadingSetTokenFrom2FA
                    }
                    disabled={isLoadingSendEmailToVerify2FA || isSuccess}
                    className="p-button-outlined w-full mt-auto"
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
};

export default TwoFAPage;

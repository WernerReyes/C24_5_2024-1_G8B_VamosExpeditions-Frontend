import { PartnerEntity } from "@/domain/entities";
import { Button, Dialog, InputText } from "@/presentation/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerDto, PartnerDto } from "@/domain/dtos/partner/partnet.dto";
import { useUpsertPartnerMutation } from "@/infraestructure/store/services";

type Props = {
  rowData?: PartnerEntity;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const PartnerRegisterEditModal = ({
  rowData,
  showModal,
  setShowModal,
}: Props) => {
  const [upsertPartnerMutation, { isLoading: isLoadingUpsertPartnerMutation }] =
     useUpsertPartnerMutation();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<PartnerDto>({
    resolver: zodResolver(partnerDto.getSchema),
    defaultValues: rowData?.id
      ? {
          id: rowData.id,
          name: rowData.name,
        }
      : {
          id: 0,
          name: "",
        },
  });
  const onSubmitNewPartner = async (data: PartnerDto) => {
    await upsertPartnerMutation(data)
      .unwrap()
      .then(() => {
        reset();
      });
  };

  return (
    <Dialog
      header={
        <div className="text-primary">
          <i className="pi pi-briefcase  mr-2 " />
          {`${rowData?.id ? "Editar" : "Registrar"} Partner`}
        </div>
      }
      breakpoints={{
        "960px": "75vw",
        "640px": "100vw",
      }}
      visible={showModal}
      onHide={() => setShowModal(false)}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmitNewPartner)}
        noValidate
      >
        <div>
          <Controller
            control={control}
            name="name"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                id="countryName"
                type="text"
                placeholder="Nombre del Partner"
                className="w-full"
                label={{
                  text: "Nombre del Partner",
                  className: "text-primary text-[18px] font-bold mb-2",
                }}
                invalid={!!error}
                {...field}
                small={{
                  text: error?.message,
                  className: "text-red-500 font-bold ",
                }}
              />
            )}
          />
          <div className="flex justify-end mt-3">
            <Button
              icon={
                isLoadingUpsertPartnerMutation
                  ? "pi pi-spin pi-spinner"
                  : "pi pi-save"
              }
              disabled={!isDirty || isLoadingUpsertPartnerMutation}
              label={`${rowData?.id ? "Editar" : "Registrar"} `}
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

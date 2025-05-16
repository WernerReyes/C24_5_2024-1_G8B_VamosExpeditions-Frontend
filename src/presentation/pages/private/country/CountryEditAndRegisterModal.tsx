import { countryDto, CountryDto } from "@/domain/dtos/country";
import { CountryEntity } from "@/domain/entities";
import { useUpsertCountryMutation } from "@/infraestructure/store/services";
import { Button, Dialog, InputText } from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
type Props = {
  rowData: CountryEntity;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const CountryEditAndRegisterModal = ({
  rowData,
  showModal,
  setShowModal,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<CountryDto>({
    resolver: zodResolver(countryDto.getSchema),
    defaultValues: rowData.id
      ? {
          countryId: rowData.id,
          countryName: rowData.name,
          countryCode: rowData.code,
        }
      : {
          countryId: 0,
          countryName: "",
          countryCode: "",
        },
  });

  const [upsertCountry, { isLoading: isLoadingUpsertCountry }] =
    useUpsertCountryMutation();

  const onSubmitNewCity = async (data: CountryDto) => {
    upsertCountry(data)
      .unwrap()
      .then(() => {
        reset();
      });
  };

  return (
    <Dialog
      header={
        <div className="text-emerald-500">
          <i className="pi pi-globe text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-2 mr-3" />
          {`${rowData.id ? "Editar" : "Registrar"} País`}
        </div>
      }
      visible={showModal}
      onHide={() => setShowModal(false)}
      style={{ height: "auto" }}
      breakpoints={{
        "960px": "75vw",
        "640px": "100vw",
      }}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmitNewCity)}
        noValidate
      >
        <div>
          <Controller
            control={control}
            name="countryName"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                id="countryName"
                type="text"
                placeholder="Nombre del país"
                className="w-full"
                label={{
                  text: "Nombre del país",
                  className: "text-emerald-500 text-[18px] font-bold mb-2",
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
        </div>

        <div>
          <Controller
            control={control}
            name="countryCode"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                id="code"
                type="text"
                placeholder="Código del país"
                className="w-full"
                label={{
                  text: "Código del país",
                  className: "text-emerald-500 text-[18px] font-bold mb-2",
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
        </div>
        <div className="flex justify-end mt-3">
          <Button
            icon={
              isLoadingUpsertCountry ? "pi pi-spin pi-spinner" : "pi pi-save"
            }
            disabled={!isDirty || isLoadingUpsertCountry}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            label={`${rowData.id ? "Editar" : "Registrar"} `}
          />
        </div>
      </form>
    </Dialog>
  );
};

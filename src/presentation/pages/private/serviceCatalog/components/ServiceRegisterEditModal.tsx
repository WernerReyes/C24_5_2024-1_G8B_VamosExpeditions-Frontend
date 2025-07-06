import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  InputText,
  Dropdown,
  Button,
  ErrorBoundary,
  DefaultFallBackComponent,
  InputNumber,
  TreeSelectSelectionKeysType,
  TreeSelectChangeEvent,
  TreeSelect,
} from "@/presentation/components";
import {
  useGetCitiAndDistrilAllQuery,
  useGetServiceTypesQuery /* useUpsertServiceMutation  */,
  useUpsertServiceMutation,
} from "@/infraestructure/store/services";
import { serviceDto, ServiceDto } from "@/domain/dtos/service";
import { ServiceEntity } from "@/domain/entities";
import Styles from "./Style.module.css";

type Props = {
  rowData?: ServiceEntity;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const numericFields: Record<string, string> = {
  passengersMin: "Pasajeros Mínimos",
  passengersMax: "Pasajeros Máximos",
  priceUsd: "Precio USD",
  taxIgvUsd: "IGV USD",
  rateUsd: "Tarifa USD",
  pricePen: "Precio PEN",
  taxIgvPen: "IGV PEN",
  ratePen: "Tarifa PEN",
};

export const ServiceEditAndRegisterModal = ({
  rowData,
  showModal,
  setShowModal,
}: Props) => {


  const {
    data: cityAndDistrit,
    refetch: isRefetchDistritsAndCity,
    isLoading: isLoadingDistritsAndCity,
    isFetching: isFetchingDistritsAndCity,
    isError: isErrorDistritAndCity,
  } = useGetCitiAndDistrilAllQuery();

  const {
    data: serviceTypes,
    isLoading: isLoadingServiceTypes,
    isFetching: isFetchingServiceTypes,
    isError: isErrorServiceTypes,
    refetch: refetchServiceTypes,
  } = useGetServiceTypesQuery({
    page: 1,
    limit: 100,
    select: {
      id: true,
      name: true,
    },
  });

  const [upsertService, { isLoading }] = useUpsertServiceMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ServiceDto>({
    resolver: zodResolver(serviceDto.getSchema),
    defaultValues: rowData?.id
      ? {
          id: rowData.id,
          description: rowData.description,
          duration: rowData.duration ?? "",
          passengersMin: rowData.passengersMin,
          passengersMax: rowData.passengersMax,
          priceUsd: rowData.priceUsd,
          taxIgvUsd: rowData.taxIgvUsd,
          rateUsd: rowData.rateUsd,
          pricePen: rowData.pricePen,
          taxIgvPen: rowData.taxIgvPen,
          ratePen: rowData.ratePen,
          districtId: rowData.district?.id.toString(),
          serviceTypeId: rowData.serviceType?.id,
        }
      : {
          description: "",
          duration: "",
          passengersMin: 0,
          passengersMax: 0,
          priceUsd: 0,
          taxIgvUsd: 0,
          rateUsd: 0,
          pricePen: 0,
          taxIgvPen: 0,
          ratePen: 0,
          districtId: "",
          serviceTypeId: 0,
        },
  });

  const onSubmit = async (data: ServiceDto) => {
    upsertService(data)
      .unwrap()
      .then(() => {
        reset();
        setShowModal(false);
      });
  };

  return (
    <Dialog
      header={`${rowData?.id ? "Editar" : "Registrar"} Servicio`}
      visible={showModal}
      onHide={() => setShowModal(false)}
      style={{ height: "auto" }}
      className="sm:w-[60vw] w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={Styles.form}>
        {/* <div className={Styles.iconContainer}>
          <i className="pi pi-truck text-2xl text-primary" />
          <h2 className="text-lg font-bold text-primary">
            Información del Servicio
          </h2>
        </div> */}

        <div className={Styles.containerGrid}>
          <div>
            <Controller
              control={control}
              name="description"
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <InputText
                  {...field}
                  label={{ text: "Descripción" }}
                  placeholder="Descripción del servicio"
                  className="w-full"
                  id="description"
                  invalid={!!error}
                  small={{
                    text: error?.message,
                    className: "text-red-500 font-bold",
                  }}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="duration"
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <InputText
                  {...field}
                  label={{ text: "Duración" }}
                  placeholder="Ej: 1h 30min"
                  className="w-full"
                  id="duration"
                  invalid={!!error}
                  small={{
                    text: error?.message,
                    className: "text-red-500 font-bold",
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className={Styles.containerGrid}>
          {Object.entries(numericFields).map(([fieldName, label], index) => (
            <div key={index}>
              <Controller
                control={control}
                name={fieldName as keyof ServiceDto}
                defaultValue={0}
                render={({ field, fieldState: { error } }) => (
                  <InputNumber
                    {...field}
                    value={
                      typeof field.value === "string"
                        ? field.value === ""
                          ? null
                          : Number(field.value)
                        : field.value ?? null
                    }
                    onChange={(e) => {
                      const value = e.value;
                      field.onChange(value === null ? undefined : value);
                    }}
                    label={{ text: label }}
                    inputId={fieldName}
                    className="w-full"
                    useGrouping={false}
                    invalid={!!error}
                    small={{
                      text: error?.message,
                      className: "text-red-500 font-bold",
                    }}
                  />
                )}
              />
            </div>
          ))}
        </div>

        {/* <ErrorBoundary
          isLoader={isLoadingDistrits || isFetchingDistrits}
          error={isErrorDistrits}
          fallBackComponent={
            <DefaultFallBackComponent
              isLoading={isLoadingDistrits}
              isFetching={isFetchingDistrits}
              refetch={refetchDistrits}
              message="No se pudieron cargar los distritos"
            />
          }
        >
          <Controller
            control={control}
            name="districtId"
            defaultValue={0}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                {...field}
                filter
                options={distrits?.data || []}
                optionLabel="name"
                optionValue="id"
                label={{ text: "Distrito" }}
                placeholder="Selecciona un distrito"
                className="w-full"
                invalid={!!error}
                small={{
                  text: error?.message,
                  className: "text-red-500 font-bold",
                }}
              />
            )}
          />
        </ErrorBoundary> */}
        <ErrorBoundary
          isLoader={isFetchingDistritsAndCity || isLoadingDistritsAndCity}
          fallBackComponent={
            <>
              <Controller
                control={control}
                name="districtId"
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TreeSelect
                      options={[]}
                      className="w-full"
                      label={{
                        text: "Distrit",
                        htmlFor: "Distrit",
                      }}
                      invalid={!!error}
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? String(field.value)
                          : undefined
                      }
                      onChange={(e: TreeSelectChangeEvent) => {
                        field.onChange(e.value);
                      }}
                      emptyMessage={
                        <DefaultFallBackComponent
                          refetch={isRefetchDistritsAndCity}
                          isFetching={isFetchingDistritsAndCity}
                          isLoading={isLoadingDistritsAndCity}
                          message="No se pudieron cargar los distritos"
                        />
                      }
                    />
                  );
                }}
              />
            </>
          }
          error={isErrorDistritAndCity}
        >
          <Controller
            control={control}
            name="districtId"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TreeSelect
                className="w-full"
                options={
                  cityAndDistrit?.data.map((country) => ({
                    key: country.id.toString(),
                    label: country.name,
                    selectable: false,
                    children: country.distrits?.map((distrit) => ({
                      key: distrit?.id.toString(),
                      label: distrit.name,
                      selectable: true,
                    })),
                  })) || []
                }
                showClear
                filter
                pt={{
                  labelContainer: { className: "w-10" },
                }}
                placeholder="Seleccione una ciudad"
                label={{
                  text: "Destino",
                  htmlFor: "destino",
                }}
                invalid={!!error}
                value={field.value as unknown as TreeSelectSelectionKeysType}
                onChange={(e: TreeSelectChangeEvent) => {
                  field.onChange(e.value);
                }}
                small={{
                  text: error?.message,
                  className: "text-red-500 font-bold",
                }}
              />
            )}
          />
        </ErrorBoundary>

        <div>
          <ErrorBoundary
            isLoader={isLoadingServiceTypes || isFetchingServiceTypes}
            error={isErrorServiceTypes}
            fallBackComponent={
              <DefaultFallBackComponent
                isLoading={isLoadingServiceTypes}
                isFetching={isFetchingServiceTypes}
                refetch={refetchServiceTypes}
                message="No se pudieron cargar los tipos de servicio"
              />
            }
          >
            <Controller
              control={control}
              defaultValue={0}
              name="serviceTypeId"
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  {...field}
                  filter
                  options={serviceTypes?.data.content || []}
                  optionLabel="name"
                  optionValue="id"
                  label={{ text: "Tipo de Servicio" }}
                  placeholder="Selecciona un tipo"
                  className="w-full"
                  invalid={!!error}
                  small={{
                    text: error?.message,
                    className: "text-red-500 font-bold",
                  }}
                />
              )}
            />
          </ErrorBoundary>
        </div>

        <div className="flex justify-end mt-3">
          <Button
            icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}
            disabled={!isDirty}
            label={`${rowData?.id ? "Editar" : "Registrar"}`}
          />
        </div>
      </form>
    </Dialog>
  );
};

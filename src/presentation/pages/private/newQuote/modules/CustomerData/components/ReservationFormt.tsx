
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form"
import { RadioButtonChangeEvent } from "primereact/radiobutton";;
import { DropdownChangeEvent } from 'primereact/dropdown';
import { TreeSelectChangeEvent, TreeSelectSelectionKeysType } from 'primereact/treeselect';

import {
    Button,
    Calendar,
    Dropdown,
    InputText,
    InputTextarea,
    RadioButton,
    TreeSelect
} from "@/presentation/components"
import { useClientStore } from "@/infraestructure/hooks/useClientStore";
import { useEffect } from "react";
import { reservationDtoSchema, ReservationDto } from "@/domain/dtos/reservation";
import { useReservationStore } from "@/infraestructure/hooks";


const travelClasses = [
    { key: 'comfort', label: 'Confort' },
    { key: 'economy', label: 'Económica' },
    { key: 'firstClass', label: 'Primera Clase' }
];




const codigo = [
    { name: 'EtzyYYgS' },
    { name: '4I3ot8Vq' },
    { name: 'BACYr45u' },
    { name: 'pqPZc0FZ' },
    { name: 'nMv4ZcdT' }
]


export const ReservationFormt = () => {
    const {
        control,
        handleSubmit,
        /* reset, */
        /* formState: { errors }, */
    } = useForm<ReservationDto>({
        resolver: zodResolver(reservationDtoSchema),
    });

    const { clients, startGetClients } = useClientStore();
    const { registerReservation } = useReservationStore()

    useEffect(() => {
        startGetClients();
    }, [])


    const handleReservation = (data: ReservationDto) => {
        registerReservation(
            data.clientId,
            data.numberOfPeople,
            data.travelDates,
            data.code,
            data.comfortClass,
            data.destination,
            data.specialSpecifications
        )


    }

    const cities =[
  {
    id_country: 1,
    name: 'Colombia',
    code: 'CO',
    city: [
      { id_city: 1, name: 'Bogota', country_id: 1 },
      { id_city: 2, name: 'Medellin', country_id: 1 }
    ]
  },
  {
    id_country: 2,
    name: 'Argentina',
    code: 'AR',
    city: [ { id_city: 3, name: 'Buenos Aires', country_id: 2 } ]
  },
  { id_country: 3, name: 'Brasil', code: 'BR', city: [] },
  {
    id_country: 4,
    name: 'Peru',
    code: 'PE',
    city: [
      { id_city: 7, name: 'Lima', country_id: 4 },
      { id_city: 8, name: 'Arequipa', country_id: 4 }
    ]
  },
  { id_country: 5, name: 'Chile', code: 'CL', city: [] }
]

const transformData = (cities: any) => {
    return cities.map((country: any) => ({
      key: country.code,
      label: country.name,
      disabled: true, // Deshabilita los nodos padre (países)
      children: country.city.map((city: any) => ({
        key: city.id_city.toString(),
        label: city.name,
        data: city
      }))
    }));
  };


    return (
        <form className="
        px-4 py-4 md:px-12 md:py-12
        flex-1
        shadow-xl bg-white rounded-lg
        border-2 border-secondary"

            onSubmit={handleSubmit(handleReservation)}

        >
            <div className="flex flex-col md:flex-row  ">

                <div className="flex flex-col w-full md:w-1/2">
                    <Controller
                        control={control}
                        name="clientId"


                        render={({ field, fieldState: { error } }) => {

                            console.log(error)

                            return (
                                <Dropdown
                                    filter
                                    options={
                                        clients.map((client) => ({
                                            name: client.fullName,
                                            id: client.id
                                        }))
                                    }


                                    label={{
                                        text: 'Nombre del cliente',
                                        className: 'text-tertiary font-bold mb-2',
                                        htmlFor: 'client'

                                    }}
                                    placeholder="Nombre del cliente"
                                    small={
                                        {
                                            text: error?.message,
                                            className: "text-red-500",
                                        }
                                    }
                                    invalid={!!error}
                                    {...field}
                                    value={field.value}
                                    optionLabel="name"
                                    optionValue="id"
                                    onChange={(e: DropdownChangeEvent) => {
                                        field.onChange(e.value);
                                        console.log(e.value)
                                    }}


                                />
                            )
                        }}
                    />

                </div>
                <div className="flex flex-col w-full md:w-1/2  md:pl-5">
                    <Controller
                        control={control}
                        name="numberOfPeople"

                        defaultValue=""

                        render={({ field, fieldState: { error } }) => (
                            <InputText

                                label={{
                                    htmlFor: "Número de Personas",
                                    text: "Número de Personas",
                                    className: "text-tertiary font-bold  mb-2 ",
                                }}
                                type="number"
                                small={{
                                    text: error?.message,
                                    className: "text-red-500",
                                }}
                                id="numberOfPeople"

                                className="block w-full mb-4 "
                                invalid={!!error}
                                {...field}
                            />



                        )}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row  ">

                <div className="flex flex-col w-full md:w-1/2">
                    <Controller
                        control={control}
                        name="travelDates"


                        render={({ field, fieldState: { error } }) => (
                            <Calendar numberOfMonths={2}
                                label={{
                                    text: 'Fecha',
                                    className: 'text-tertiary font-bold mb-2 mt-2"',
                                    htmlFor: 'calendar'
                                }}

                                onChange={(e) => {
                                    field.onChange(e.value);
                                }}
                                value={field.value as Date[]}
                                small={
                                    {
                                        text: error?.message,
                                        className: "text-red-500",
                                    }
                                }
                                selectionMode="range"
                                readOnlyInput
                                hideOnRangeSelection

                            />


                        )}


                    />

                </div>
                <div className="flex flex-col w-full md:w-1/2  md:pl-5">

                    <Controller
                        control={control}
                        name="code"


                        render={({ field, fieldState: { error } }) => (


                            <Dropdown
                                filter
                                options={
                                    codigo
                                }
                                label={{
                                    text: 'Código',
                                    className: 'text-tertiary font-bold mb-2',
                                    htmlFor: 'codigo'

                                }}
                                small={
                                    {
                                        text: error?.message,
                                        className: "text-red-500",
                                    }
                                }
                                invalid={!!error}
                                {...field}
                                value={field.value}
                                optionLabel="name"
                                optionValue="name"
                                onChange={(e: DropdownChangeEvent) => {
                                    field.onChange(e.value);
                                    console.log(e.value)
                                }}


                            />

                        )}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-content-center mt-4 mb-4">
                <label className="text-tertiary font-bold mb-2">
                    Clase de Confort
                </label>
                <div className="flex flex-wrap   gap-3 ">
                    <Controller


                        control={control}
                        name="comfortClass"
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (

                            <>
                                {travelClasses.map((travelClass) => (
                                    <RadioButton

                                        key={travelClass.key}
                                        label={{
                                            text: travelClass.label,
                                            htmlFor: travelClass.label,
                                            className: "text-tertiary font-bold mb-2 ml-2  text-xs md:text-sm",
                                        }}

                                        invalid={!!error}
                                        {...field}
                                        onChange={(e: RadioButtonChangeEvent) => {
                                            field.onChange(e.value);
                                        }}
                                        value={travelClass.key}
                                        name="comfortClass"
                                        checked={field.value === travelClass.key}


                                    />
                                ))}
                                {error && (
                                    <small className="text-red-500  text-xs md:text-sm">
                                        {error.message}
                                    </small>
                                )}
                            </>
                        )}
                    />

                </div>

            </div>
            <div className="flex flex-col ">
                <div className="flex flex-col w-full ">
                    <Controller
                        control={control}
                        name="destination"

                        render={({ field, fieldState: { error } }) => (

                            <TreeSelect
                                className="w-full"
                                
                                options={transformData(cities)}
                               
                               selectionMode="multiple"
                               showClear
                              
                                
                                filter
                                placeholder="Seleccione una ciudad"
                                label={{
                                    text: 'Destino',
                                    className: 'text-tertiary font-bold mb-2',
                                    htmlFor: 'destino'
                                }}
                                
                                {...field}
                                value={field.value as unknown as TreeSelectSelectionKeysType}
                                onChange={(e: TreeSelectChangeEvent) => {
                                    console.log(e.value);
                                    field.onChange(e.value);
                                }}

                                small={{
                                    text: error?.message,
                                    className: "text-red-500",
                                }}
                            />




                        )}
                    />



                </div>

            </div>

            <div className="card flex flex-col mt-4">
                <Controller
                    control={control}
                    name="specialSpecifications"
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                        <InputTextarea rows={5} cols={30}

                            label={{
                                text: 'Comentarios',
                                className: 'text-tertiary font-bold mb-2',
                                htmlFor: 'comentarios'
                            }}
                            className=" w-full"
                            small={{
                                text: error?.message,
                                className: "text-red-500",
                            }}
                            id="specialSpecifications"
                            invalid={!!error}
                            {...field}

                        />
                    )}
                />

            </div>

            <Button
                className="mt-4"
                label="Guardar"
            />



        </form >
    )
}


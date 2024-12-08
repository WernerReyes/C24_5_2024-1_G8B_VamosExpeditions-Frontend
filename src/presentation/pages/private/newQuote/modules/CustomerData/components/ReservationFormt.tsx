

import { Controller, useForm } from "react-hook-form"
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import {DropdownChangeEvent} from 'primereact/dropdown';

import { 
         Calendar,
         Dropdown,
         InputText, 
         InputTextarea, 
         MultiSelect,
         RadioButton } from "@/presentation/components"


const travelClasses = [
    { key: 'comfort', label: 'Confort' },
    { key: 'economy', label: 'Económica' },
    { key: 'firstClass', label: 'Primera Clase' }
];


const cities = [
    { name: 'Lima', code: 'LIM' },
    { name: 'Cusco', code: 'CUS' },
    { name: 'Arequipa', code: 'ARE' },
    { name: 'Piura', code: 'PIU' },
    { name: 'Trujillo', code: 'TRU' }
];


const codigo = [
    {

        name: 'codigo 1',

    },
    {
        name: 'codigo 2',

    }
]


export const ReservationFormt = () => {
    const { control } = useForm();
    return (
        <form className="
        px-4 py-4 md:px-12 md:py-12
        flex-1
        shadow-xl bg-white rounded-lg
        border-2 border-secondary
    
         ">
            <div className="flex flex-col md:flex-row  ">

                <div className="flex flex-col w-full md:w-1/2">
                    <Controller
                        control={control}
                        name="name"

                        defaultValue=""

                        render={({ field, fieldState: { error } }) => (
                            <InputText
                                label={{
                                    htmlFor: "Nombre completo ",
                                    text: "Nombre completo",
                                    className: "text-tertiary font-bold text-xl ",
                                }}
                                type="text"

                                small={{
                                    text: error?.message,
                                    className: "text-red-500",
                                }}
                                id="name"
                                className="block w-full mb-4 "
                                invalid={!!error}
                                {...field}
                            />



                        )}
                    />

                </div>
                <div className="flex flex-col w-full md:w-1/2  md:pl-5">
                    <Controller
                        control={control}
                        name="email"

                        defaultValue=""

                        render={({ field, fieldState: { error } }) => (
                            <InputText

                                label={{
                                    htmlFor: "Correo electronico",
                                    text: "Correo electronico",
                                    className: "text-tertiary font-bold text-xl  ",
                                }}
                                type="email"
                                small={{
                                    text: error?.message,
                                    className: "text-red-500",
                                }}
                                id="email"

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
                           

                            render={({ field, fieldState: { error } }) => {

                                console.log(error)
                                
                                return(
                                <Dropdown 
                                filter
                                options={codigo}
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
                                value={field.value } 
                                optionLabel="name"
                                onChange={(e:DropdownChangeEvent) => {
                                    field.onChange(e.value);
                                    console.log(e.value)
                                }}
                                
    
                            />
                            )}}
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

                        <MultiSelect
                            className="w-full" 
                            options={cities} 
                            display="chip"
                            optionLabel="name" 
                            optionValue="name" 
                            filter
                            placeholder="Seleccione una ciudad"
                            label={{
                                text: 'Destino',
                                className: 'text-tertiary font-bold mb-2',
                                htmlFor: 'destino'
                            }}
                            {...field}
                            value={field.value as unknown as string[]}
                            onChange={(e:MultiSelectChangeEvent) => {
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

            



        </form >
    )
}


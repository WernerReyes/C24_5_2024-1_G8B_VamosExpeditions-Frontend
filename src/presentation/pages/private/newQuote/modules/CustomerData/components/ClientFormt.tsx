import { InputText } from "@/presentation/components"
import { Controller, useForm } from "react-hook-form"


export const ClientFormt = () => {
    const { control } = useForm();

    return (
        <form className="
        px-4 py-4 md:px-12 md:py-12
        flex-1
        shadow-xl bg-white rounded-lg
        border-2 border-secondary
    
      ">

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

                        className="block w-full mb-4"
                        invalid={!!error}
                        {...field}
                    />



                )}
            />
            <Controller
                control={control}
                name="country"

                defaultValue=""

                render={({ field, fieldState: { error } }) => (
                    <InputText

                        label={{
                            htmlFor: "País de origen",
                            text: "Pais de origen",
                            className: "text-tertiary font-bold text-xl",
                        }}
                        type="text"
                        small={{
                            text: error?.message,
                            className: "text-red-500",
                        }}
                        id="country"

                        className="block w-full mb-4"
                        invalid={!!error}
                        {...field}
                    />



                )}
            />

            <Controller
                control={control}
                name="phone"

                defaultValue=""

                render={({ field, fieldState: { error } }) => (
                    <InputText

                        label={{
                            htmlFor: "Telefono",
                            text: "Telefono",
                            className: "text-tertiary font-bold  text-xl ",
                        }}
                        type="number"
                        small={{
                            text: error?.message,
                            className: "text-red-500",
                        }}
                        id="phone"

                        className="block w-full"
                        invalid={!!error}
                        {...field}
                    />



                )}
            />



        </form>
    )
}



import { z } from "zod";
import { requestValidator } from "@/core/utils";
import { regex } from "@/core/constants";

const { EMAIL } = regex;

export type NewClientDto = {
    readonly fullName: string;
    readonly email: string;
    readonly phone: string;
    readonly country: string;
}


export const newClientDto = (fullName: string, email: string, phone: string, country: string) => {

    return {
        create: (): [NewClientDto?, string[]?] => {
            const errors = requestValidator(
                {
                    fullName,
                    email,
                    phone,
                    country
                },
                newClientDtoSchema
            );
            if (errors) {
                return [undefined, errors];
            }
            return [{ fullName, email, phone, country }, undefined];
        },
    }

}


export const newClientDtoSchema = z.object({
    fullName: z
        .string()
        .min(1, {
            message: "El campo nombre es requerido",
        }),
    email: z
        .string()
        .min(1, {
            message: "El campo email es requerido",
        })
        .refine((value) => EMAIL.test(value), {
            message: "Email invalid, debe ser un email valido",
        }),
    phone: z
        .string()
        .min(1, {
            message: "El campo telefono es requerido",
        }),
    country: z
        .string()
        .min(1, {
            message: "El campo pais es requerido",
        }),
});

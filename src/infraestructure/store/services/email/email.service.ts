import { emailDto, EmailDto } from "@/domain/dtos/email";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { ApiResponse } from "../response";

const PREFIX = "/quotation";
export const EmailService = createApi({
  reducerPath: "emailApi",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    sendMessageEmail: builder.mutation<ApiResponse<void>, EmailDto>({
      query: (clientDto) => ({
        url: `/send-email-pdf`,
        method: "POST",
        body: { ...clientDto, to: clientDto.to.map((item) => item.email) },
      }),
      async onQueryStarted(body, { queryFulfilled }) {
        const [_, errors] = emailDto.create(body);
        if (errors) return console.error(errors[0]);
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),
  }),
});

export const { useSendMessageEmailMutation } = EmailService;

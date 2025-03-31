import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";

const PREFIX = "/trip-details";

export const reportService = createApi({
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getHotelPdf: builder.query<Blob, { id: number; name?: string }>({
      query: ({ id }) => ({
        url: `/pdf/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        
      }),
      async onQueryStarted({  name  }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          
          const blobURL = URL.createObjectURL(data);
          const hiddenElement = document.createElement("a");
          hiddenElement.href = blobURL;
          hiddenElement.download = `${name}.pdf`;
          document.body.appendChild(hiddenElement);
          hiddenElement.click();
          document.body.removeChild(hiddenElement);
          setTimeout(() => {
            window.URL.revokeObjectURL(blobURL);
          }, 1000); 
          
        } catch (error) {
        
        }
      },
    }),
  }),
});

export const { useGetHotelPdfQuery } = reportService;

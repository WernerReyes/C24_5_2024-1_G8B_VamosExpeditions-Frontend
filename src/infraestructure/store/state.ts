
import type { AccommodationQuoteSliceState } from './slices/accommodationQuote.slice';
import type { AccommodationRoomSliceState } from './slices/accommodationRoom.slice';
import type { AuthSliceState } from "./slices/auth.slice";
import type { ClientSliceState } from './slices/client.slice';
import type { QuotationSliceState } from './slices/quotation.slice';
import type { QuoteSliceState } from "./slices/quote.slice";

export type AppState = {
    auth: AuthSliceState;
    accommodationRoom: AccommodationRoomSliceState
    quote: QuoteSliceState;
    client: ClientSliceState;
    accommodationQuote: AccommodationQuoteSliceState;
    quotation: QuotationSliceState;

}
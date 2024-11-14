import {
  type QuoteEntity,
  QuoteStatusEnum,
  type VersionEntity,
} from "@/domain/entities";

export const getQuoteSeverity = (quote: QuoteEntity | VersionEntity) => {
  switch (quote.status) {
    case QuoteStatusEnum.Accepted:
      return "success";

    case QuoteStatusEnum.Pending:
      return "warning";

    case QuoteStatusEnum.Rejected:
      return "danger";

    default:
      return null;
  }
};

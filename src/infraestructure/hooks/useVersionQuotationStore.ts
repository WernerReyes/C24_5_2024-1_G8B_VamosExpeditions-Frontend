import { useDispatch, useSelector } from "react-redux";

import type { AppState } from "@/app/store";
import { useAlert } from "../../presentation/hooks/useAlert";
import { useUpdateVersionQuotationMutation } from "../store/services";
import {
  versionQuotationDto,
  type VersionQuotationDto,
} from "@/domain/dtos/versionQuotation";
import { onSetCurrentVersionQuotation } from "../store";
import { VersionQuotationEntity } from "@/domain/entities";

export const useVersionQuotationStore = () => {
  const dispatch = useDispatch();
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const { startShowError } = useAlert();
  const [
    updateVersionQuotation,
    { isLoading: isUpdatingVersionQuotation, ...updateVersionQuotationResult },
  ] = useUpdateVersionQuotationMutation();

  const startUpdateVersionQuotation = async (dto: VersionQuotationDto) => {
    const [versionQuotationDtoValidated, errors] = versionQuotationDto(
      dto.id,
      dto.status,
      dto.official,
      dto.reservationId,
      dto.indirectCostMargin,
      dto.profitMargin,
      dto.totalCost,
      dto.finalPrice
    ).create();
    if (errors) return startShowError(errors[0]);
    await updateVersionQuotation(versionQuotationDtoValidated!)
      .unwrap()
      .then(({ data }) => {
        dispatch(onSetCurrentVersionQuotation(data));
      })
      .catch((error) => {
        console.log({ error });
        throw error;
      });
  };

  const startSetCurrentVersionQuotation = (versionQuotation: VersionQuotationEntity) => {
    dispatch(onSetCurrentVersionQuotation(versionQuotation));
  }

  return {
    //* Atributtes
    currentVersionQuotation,
    updateVersionQuotationResult: {
      ...updateVersionQuotationResult,
      isUpdatingVersionQuotation,
    },

    //* Actions
    startUpdateVersionQuotation,
    startSetCurrentVersionQuotation,
  };
};

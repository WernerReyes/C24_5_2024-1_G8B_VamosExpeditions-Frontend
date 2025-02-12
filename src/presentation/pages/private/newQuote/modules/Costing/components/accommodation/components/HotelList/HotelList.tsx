import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import type { HotelEntity } from "@/domain/entities";
import {
  DataView,
  Dialog,
  InputText,
  Rating,
  SelectButton,
} from "@/presentation/components";
import { useEffect, useMemo, useState } from "react";
import { HotelContent } from "./components";
import { classNamesAdapter } from "@/core/adapters";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const HotelList = ({ visible, setVisible }: Props) => {
  const { hotels } = useSelector((state: AppState) => state.hotel);

  const [hotelsFiltered, setHotelsFiltered] = useState<HotelEntity[]>([]);
  const [hotelFilter, setHotelFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [hotelCategoryFilter, setHotelCategoryFilter] = useState<string>("");
  const [dialogMaximized, setDialogMaximized] = useState(false);

  const applyFilters = () => {
    let filtered = hotels;

    if (hotelFilter) {
      filtered = filtered.filter((hotel) =>
        hotel.name.toLowerCase().includes(hotelFilter.toLowerCase())
      );
    }

    if (ratingFilter > 0 || hotelCategoryFilter.length > 0) {
      filtered = filtered.filter((hotel) => {
        const category = isNaN(Number(hotel.category));
        if (!category) {
          return +hotel.category === ratingFilter;
        }
        return hotel.category === hotelCategoryFilter;
      });
    }

    setHotelsFiltered(filtered);
  };

  const handleFilterByHotel = (value: string) => {
    setHotelFilter(value);
  };

  const handleFilterByRating = (value: number) => {
    setRatingFilter(value);
  };

  const handleFilterByCategory = (value: string) => {
    setHotelCategoryFilter(value);
  };

  const categories: string[] = useMemo(
    () =>
      hotels
        .map((hotel) => hotel.category)
        .filter((category, index, self) => self.indexOf(category) === index),
    [hotels]
  );

  useEffect(() => {
    setHotelsFiltered(hotels);
  }, [hotels]);

  useEffect(() => {
    applyFilters();
  }, [hotelFilter, ratingFilter, hotelCategoryFilter]);

  return (
    <Dialog
      header="Hoteles"
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      maximized={dialogMaximized}
      onMaximize={() =>
        setDialogMaximized((prevDialogMaximized) => !prevDialogMaximized)
      }
      maximizable
    >
      <div className="card">
        <DataView
          header={
            <>
              <div className="w-full md:max-w-sm mx-auto px-3">
                <InputText
                  label={{
                    text: "",
                    htmlFor: "search",
                  }}
                  iconField
                  iconFieldProps={{
                    iconPosition: "left",
                  }}
                  iconProps={{
                    className: "pi pi-search",
                  }}
                  placeholder="Buscar hotel..."
                  className="w-full"
                  type="search"
                  variant="filled"
                  onChange={(e) => handleFilterByHotel(e.target.value)}
                />
              </div>
              <div className="flex justify-center gap-x-4 mt-5">
                {categories.filter((category) => !isNaN(Number(category)))
                  .length > 0 && (
                  <Rating
                    value={ratingFilter}
                    onChange={(e) => {
                      const value = e.value ? (e.value > 2 ? e.value : 2) : 0;
                      handleFilterByRating(value);
                    }}
                    stars={5}
                  />
                )}

                {categories.filter((category) => isNaN(Number(category)))
                  .length > 0 && (
                  <SelectButton
                    value={hotelCategoryFilter}
                    options={categories
                      .filter((category) => isNaN(Number(category)))
                      .map((category) => ({
                        label: category,
                        value: category,
                      }))}
                    onChange={(e) => handleFilterByCategory(e.value ?? "")}
                  />
                )}
              </div>

              <div className="card flex justify-content-center"></div>

              {/* Filters */}
            </>
          }
          value={hotelsFiltered}
          listTemplate={(hotels: HotelEntity[]) => (
            <div
              className={classNamesAdapter(
                "grid grid-cols-1 gap-6 items-start mt-3",
                dialogMaximized ? "md:grid-cols-3" : "md:grid-cols-2"
              )}
            >
              {hotels.map((hotel) => (
                <HotelContent
                  key={hotel.id}
                  hotel={hotel}
                  setVisible={setVisible}
                />
              ))}
            </div>
          )}
          paginator
          paginatorClassName=""
          paginatorPosition="both"
          paginatorTemplate={
            "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          }
          rowsPerPageOptions={[5, 10, 15]}
          rows={5}
        />
      </div>
    </Dialog>
  );
};

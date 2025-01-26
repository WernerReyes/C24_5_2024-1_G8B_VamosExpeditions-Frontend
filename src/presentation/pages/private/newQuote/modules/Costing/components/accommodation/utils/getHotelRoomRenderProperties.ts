import { HotelRoomEntity } from "@/domain/entities";

type HotelRoomRenderProperties = "icon";

export const getHotelRoomRenderProperties = (
  room: HotelRoomEntity,
  property: HotelRoomRenderProperties
) => {
  switch (property) {
    case "icon":
      return getHotelRoomIcon(room);
    default:
      return null;
  }
};

const getHotelRoomIcon = (room: HotelRoomEntity) => {
  switch (room.roomType.toLowerCase()) {
    case "single":
      return "pi pi-user";
    case "double":
      return "pi pi-users";
    case "triple":
      return "pi pi-users";
    case "Suite":
      return "pi pi-home";
    default:
      return "pi pi-home";
  }
};

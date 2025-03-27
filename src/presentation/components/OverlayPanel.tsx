import  {forwardRef}  from "react";

import {
  OverlayPanel as OverlayPanelPrimeReact,
  OverlayPanelProps,
} from "primereact/overlaypanel";



interface Props extends OverlayPanelProps {}

export const OverlayPanel = forwardRef<OverlayPanelPrimeReact, Props>(({ ...overlayPanelProps }, ref) => {
  return (
    <OverlayPanelPrimeReact ref={ref} {...overlayPanelProps}></OverlayPanelPrimeReact>
  );
});

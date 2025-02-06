import { Chip as ChipPrimeReact,ChipProps } from 'primereact/chip';


interface Props extends  ChipProps {}

export const Chip = ({ ...props }: Props) => {
  return (
    <ChipPrimeReact {...props} />
  )
}



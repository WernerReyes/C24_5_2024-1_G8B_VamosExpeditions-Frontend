type Props = {
  message?: string;
};
export const FieldNotAssigned = ({ message }: Props) => {
  return (
    <span className="text-xs md:text-sm text-gray-400">
      <i className="pi pi-ban"></i> {message}
    </span>
  );
};

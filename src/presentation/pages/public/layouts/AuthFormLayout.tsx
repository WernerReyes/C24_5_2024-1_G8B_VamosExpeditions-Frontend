import { Button } from "@/presentation/components";

type Props = {
  children: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  loading: boolean;
  buttonLabel: string;
  title: string;
  description: string;
  disabled?: boolean;
};

export const AuthFormLayout = ({
  children,
  handleSubmit,
  loading,
  disabled,
  buttonLabel,
  title,
  description,
}: Props) => {
  return (
    <section className="bg-login bg-no-repeat bg-cover bg-center w-screen min-h-screen flex justify-center items-center">
      <div className="mx-10 w-80 bg-secondary px-8 py-10 rounded-lg shadow-lg sm:w-[25rem]">
        <img src="/images/logo.webp" alt="Logo" className="mx-auto" />
        <h3 className="text-2xl mt-7 font-bold text-center mb-1 text-tertiary">
          {title}
        </h3>
        <p className="text-center font-light text-sm mb-6">{description}</p>
        <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
          {children}

          <Button
            type="submit"
            label={loading ? "Validando..." : buttonLabel}
            disabled={disabled || loading}
            className="w-full mt-8"
          />
        </form>
      </div>
    </section>
  );
};

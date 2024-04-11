import { useFormContext } from 'react-hook-form';

export default function AgreementInput({
  name,
  agreement,
  formOptions,
}: {
  name: string;
  agreement: {
    detail: JSX.Element;
    content: string;
  };
  formOptions: object;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div className="mb-4">
      {agreement.detail}
      <div>
        <input
          type="checkbox"
          {...register(name, { ...formOptions })}
          className="mr-2 align-middle"
        />
        <label
          className={`align-middle ${error ? 'text-red-500' : 'text-black'}`}
        >
          {agreement.content}
        </label>
      </div>
      {error && (
        <p className="text-red-500 mt-1 text-[80%] w-full pl-5">
          {error as string}
        </p>
      )}
    </div>
  );
}

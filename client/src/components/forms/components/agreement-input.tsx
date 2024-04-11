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
        <label className="align-middle">{agreement.content}</label>
      </div>
      {error && <p>{error as string}</p>}
    </div>
  );
}

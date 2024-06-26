import { useFormContext } from 'react-hook-form';

export default function Input({
  id,
  label,
  name,
  type,
  advice,
  formOption,
  inputOption,
  ...restProps
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  advice?: JSX.Element;
  formOption?: object;
  inputOption?: object;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;
  return (
    <div className="mb-4">
      {label && (
        <label className="inline-block mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={`block w-full px-3 py-2 text-base font-normal leading-normal text-gray-700 bg-white border rounded transition duration-150 ease-in-out focus:outline-0 bg-clip-padding 
          ${
            !error
              ? ' border-gray-300 focus:border-blue-400 focus:box-border focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(0,123,255,.25)]'
              : ' border-red-500 focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(220,53,69,.25)] bg-[right_calc(0.375em+0.1875rem)_center] bg-[length:calc(0.75em+0.375rem)_calc(0.75em+0.375rem)]'
          } disabled:bg-gray-200`}
        id={id}
        type={type}
        {...register(name, {
          ...formOption,
        })}
        {...inputOption}
        {...restProps}
      />
      <div className="w-full mt-1 text-sm text-red-600">{error as string}</div>
      {advice && <div className="mt-1">{advice}</div>}
    </div>
  );
}

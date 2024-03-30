import { useFormContext } from 'react-hook-form';

export default function CompetitionForm({
  label,
  name,
  id,
  ...restProps
}: {
  label: string;
  name: string;
  id: string;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const value = watch(name);
  const error = errors[name]?.message;
  return (
    <div className="mb-4">
      <label className="inline-block mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        className={
          'block w-full px-1 py-2 text-base font-normal leading-normal text-gray-700 bg-white border rounded transition duration-150 ease-in-out focus:outline-0 bg-clip-padding' +
          (!errors[name]
            ? ' border-gray-300 focus:border-blue-400 focus:box-border focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(0,123,255,.25)]'
            : ' border-red-500 focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(220,53,69,.25)] bg-is-invalid bg-no-repeat bg-[right_calc(0.375em+0.1875rem)_center] bg-[length:calc(0.75em+0.375rem)_calc(0.75em+0.375rem)]')
        }
        id={id}
        {...restProps}
        {...register(name, {
          minLength: 1,
        })}
      />
      <div className="w-full mt-1 text-sm text-red-600">{error as string}</div>
    </div>
  );
}

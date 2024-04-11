import { CompetitionItem } from 'core/model';
import { useFormContext } from 'react-hook-form';

export default function EventSelect({
  id,
  label,
  name,
  competition,
  advice,
  formOption,
  ...restProps
}: {
  id: string;
  label: string;
  name: string;
  competition: CompetitionItem;
  advice?: JSX.Element;
  formOption?: object;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div>
      {label && (
        <label className="inline-block mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        className={
          'block w-full px-3 py-2 text-base font-normal leading-normal text-gray-700 bg-white border rounded transition duration-150 ease-in-out focus:outline-0 bg-clip-padding' +
          (!error
            ? ' border-gray-300 focus:border-blue-400 focus:box-border focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(0,123,255,.25)]'
            : ' border-red-500 focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(220,53,69,.25)] bg-[right_calc(0.375em+0.1875rem)_center] bg-[length:calc(0.75em+0.375rem)_calc(0.75em+0.375rem)]')
        }
        id={id}
        {...register(name, {
          ...formOption,
        })}
        {...restProps}
      >
        <option value="" key="">
          선택
        </option>
        {competition &&
          competition.events.map((event) => (
            <option value={event.id} key={event.id}>
              {`${event.name} (${event.limit})`}
            </option>
          ))}
      </select>
      {error && (
        <p className="text-red-500 mt-1 text-[80%] w-full">{error as string}</p>
      )}
    </div>
  );
}

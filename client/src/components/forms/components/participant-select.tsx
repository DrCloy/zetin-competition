import { CompetitionEvent } from 'core/model';
import { useFormContext } from 'react-hook-form';

export default function ParticipantSelect({
  event,
  participant,
  id,
  name,
  formOption,
  ...restProps
}: {
  event: CompetitionEvent;
  participant: string;
  id: string;
  name: string;
  formOption?: object;
}) {
  const form = useFormContext();
  const { setValue, watch } = form;
  const value = watch(name);
  return (
    <div className="px-3 py-1.5 border border-gray-300 flex flex-row flex-wrap overflow-y-scroll h-64">
      {event.participants.slice(1, 501).map((p, index) => (
        <div
          key={index}
          className={`${
            value === index + 1
              ? 'bg-blue-500 text-white'
              : p && p !== participant
              ? 'bg-gray-500 text-white'
              : 'hover:bg-gray-300'
          } align-center justify-center flex rounded-[50%] w-10 h-10 m-0.5 pt-2 cursor-pointer text-sm leading-normal 
          `}
          onClick={() => {
            if (p && p !== participant) {
              return;
            } else {
              setValue(name, index + 1);
            }
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

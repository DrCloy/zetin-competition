import { ParticipantItem } from 'core/model';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap -mx-4">
      <div className="text-right flex-[0_0_calc(1/3)%] max-w-1/3 relative w-full px-4">
        {label}
      </div>
      <div className="flex-2/3 max-w-2/3 relative w-full px-4">{value}</div>
    </div>
  );
}

export default function ParticipantView({
  participant,
}: {
  participant: ParticipantItem;
}) {
  return (
    <div className="relative flex-auto p-4">
      <h5 className="text-2xl">인적 사항</h5>
      <Field label="이름" value={participant.name} />
      {participant.email && <Field label="이메일" value={participant.email} />}
      <Field label="소속" value={participant.team} />
      <hr className="my-4 " />
      <h5 className="text-2xl">로봇 정보</h5>
      <Field label="로봇 이름" value={participant.robotName} />
      <Field label="CPU" value={participant.robotCPU} />
      <Field label="ROM" value={participant.robotROM} />
      <Field label="RAM" value={participant.robotRAM} />
      <Field label="Motor Driver" value={participant.robotMotorDriver} />
      <Field label="ADC" value={participant.robotADC} />
      <Field label="Sensor" value={participant.robotSensor} />
      <hr className="my-4 " />
      <h5 className="text-2xl">참가 정보</h5>
      <Field label="참가 부문" value={participant.eventName} />
      <Field label="참가 순번" value={participant.entryOrder.toString()} />
      <Field label="실제 순번" value={participant.realOrder.toString()} />
      <Field label="하고 싶은 말" value={participant.comment} />
      <hr className="my-4 " />
    </div>
  );
}

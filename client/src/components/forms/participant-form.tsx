import { Form, FormProvider, useForm } from 'react-hook-form';
import AgreementInput from './components/agreement-input';

import privacy from './Agreement/privacy_20220714';
import {
  CompetitionEvent,
  CompetitionItem,
  ParticipantInput,
  ParticipantItem,
} from 'core/model';
import FieldStack from './components/field-stack';
import Input from './components/input';
import EventSelect from './components/event-select';
import { useEffect, useState } from 'react';
import { repo } from 'di';
import ParticipantSelect from './components/participant-select';

export default function ParticipantForm({
  competition,
  participant,
  onSubmitted,
}: {
  competition: CompetitionItem;
  participant: ParticipantItem | null;
  onSubmitted?: (response: ParticipantItem) => void;
}) {
  const form = useForm<ParticipantInput>();
  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: ParticipantInput) => {
    let response: ParticipantItem | null = null;
    try {
      data.competitionId = competition.id;
      if (!data.password) delete data.password;

      if (participant) {
        response = await repo.participantManager.updateParticipant(data);
      } else {
        response = await repo.participantManager.createParticipant(data);
      }

      setErrorMessage('');
      onSubmitted && onSubmitted(response);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (participant) {
      reset(participant);
    }
  }, [participant, reset]);

  const [freshEvents, setFreshEvents] = useState<CompetitionEvent[]>([]);
  useEffect(() => {
    async function getFreshEvents() {
      const response = await repo.participantManager.getParticipants(
        competition.id,
      );
      setFreshEvents(response);
    }

    if (freshEvents.length === 0) {
      getFreshEvents();
    }
  }, [competition, freshEvents]);

  const eventId = watch('eventId');
  const [selectedEvent, setSelectedEvent] = useState<CompetitionEvent | null>(
    null,
  );

  useEffect(() => {
    if (eventId) {
      const event = freshEvents.find((event) => event.id === eventId);
      setSelectedEvent(event || null);
    }

    if (participant && eventId === participant.eventId) {
      setValue('entryOrder', participant.entryOrder);
    }
  }, [eventId, freshEvents, participant, setValue]);

  return (
    <FormProvider {...form}>
      <Form>
        <div className="p-4 divide-y divide-gray-300">
          <AgreementInput
            name="privacy"
            agreement={privacy}
            formOptions={{
              validate: {
                agreed: (value: boolean) => {
                  if (!value) {
                    return '개인정보 수집 및 이용에 대한 동의가 필요합니다.';
                  }
                  return true;
                },
              },
            }}
          />
          <div className="py-4">
            <h3 className="text-3xl mb-2">인적 사항</h3>
            <p className="text-gray-500 mb-4">참가자의 정보를 입력해주세요.</p>
            <FieldStack>
              <Input
                id="name"
                type="text"
                name="name"
                label="이름"
                formOption={{
                  required: '이름을 입력해주세요.',
                }}
              />
              <Input
                id="email"
                type="text"
                name="email"
                label="이메일"
                formOption={{ required: '이메일을 입력해주세요.' }}
              />
            </FieldStack>
            <Input id="team" type="text" name="team" label="소속" />
          </div>
          <div className="py-4">
            <h3 className="text-3xl mb-2">로봇 정보</h3>
            <p className="text-gray-500 mb-4">
              로봇에 대한 정보를 입력해주세요.
            </p>
            <Input
              id="robotName"
              type="text"
              name="robotName"
              label="로봇 이름"
              formOption={{
                required: '로봇의 이름을 입력해주세요.',
              }}
            />
            <FieldStack>
              <Input id="robotCPU" type="text" name="robotCPU" label="CPU" />
              <Input id="robotROM" type="text" name="robotROM" label="ROM" />
              <Input id="robotRAM" type="text" name="robotRAM" label="RAM" />
            </FieldStack>
            <FieldStack>
              <Input
                id="robotMotorDriver"
                type="text"
                name="robotMotorDriver"
                label="Motor Driver"
              />
              <Input
                id="robotMotor"
                type="text"
                name="robotMotor"
                label="Motor"
              />
            </FieldStack>
            <FieldStack>
              <Input id="robotADC" type="text" name="ADC" label="ADC" />
              <Input
                id="robotSensor"
                type="text"
                name="sensor"
                label="Sensor"
              />
            </FieldStack>
          </div>
          <div className="py-4">
            <h3 className="text-3xl mb-2">참가 정보</h3>
            <p className="text-gray-500 mb-4">
              대회에 참가할 방식을 선택해주세요.
            </p>
            <FieldStack>
              <EventSelect
                id="eventId"
                label="참가 부문"
                name="eventId"
                competition={competition}
                formOption={{
                  required: '참가 부문을 선택해주세요.',
                }}
              />
              <Input
                id="entryOrder"
                type="number"
                name="entryOrder"
                label="참가 순번"
                formOption={{
                  required: '참가 순번을 입력해주세요.',
                }}
                inputOption={{
                  disabled: !selectedEvent,
                }}
              />
            </FieldStack>
            {selectedEvent && <ParticipantSelect />}
          </div>
        </div>
      </Form>
    </FormProvider>
  );
}

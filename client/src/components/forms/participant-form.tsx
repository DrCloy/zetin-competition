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
      <Form noValidate>
        <div className="p-4 divide-y divide-gray-200">
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
          <div className="py-2">
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
                  onchange: (e: any) => console.log(e),
                }}
              />
              <Input
                id="entryOrder"
                type="number"
                name="entryOrder"
                label="참가 순번"
                formOption={{
                  required: '참가 순번을 입력해주세요.',
                  validate: {
                    isZero: (value: number) => {
                      if (value === 0) {
                        return '참가 순번을 선택해주세요.';
                      }
                      return true;
                    },
                    isDuplicate: (value: number) => {
                      if (
                        selectedEvent &&
                        selectedEvent.participants[value] &&
                        selectedEvent.participants[value] !==
                          participant?.participantId
                      ) {
                        return '이미 참가한 순번입니다.';
                      } else {
                        return true;
                      }
                    },
                  },
                }}
                inputOption={{
                  disabled: !selectedEvent,
                }}
              />
            </FieldStack>
            {selectedEvent && (
              <div className="mb-10 after:content-end">
                <small className="text-gray-500">
                  아래에서 참가 순번을 선택할 수 있습니다.
                </small>
                <ParticipantSelect
                  event={selectedEvent}
                  participant={participant ? participant.participantId : ''}
                  id="entryOrder"
                  name="entryOrder"
                  formOption={{
                    required: '참가 순번을 입력해주세요.',
                    validate: {
                      isZero: (value: number) => {
                        if (value === 0) {
                          return '참가 순번을 선택해주세요.';
                        }
                        return true;
                      },
                    },
                  }}
                />
                <div className="float-right mt-2">
                  <button
                    className="cursor-pointer px-2 py-1 text-sm leading-normal rounded text-white bg-gray-500 border-gray-500 text-center align-middle border transition duration-150 ease-in-out active:bg-gray-700 active:border-gray-700 hover:bg-gray-700 hover:border-gray-700 hover:no-underline focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(130,138,145,.5)]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setValue('entryOrder', 0);
                    }}
                  >
                    새로고침
                  </button>
                </div>
              </div>
            )}
            <Input
              id="comment"
              type="text"
              name="comment"
              label="하고 싶은 말"
            />
          </div>
          <div className="py-2">
            <h3 className="text-3xl mb-2">참가자 인증 수단</h3>
            <p className="text-gray-500 mb-4">
              참가자 본인을 식별할 비밀번호를 입력해주세요.
            </p>
            <FieldStack>
              <Input
                id="password"
                type="password"
                name="password"
                label={participant ? '새 비밀번호' : '비밀번호'}
                formOption={{
                  validate: {
                    required: (value: string) => {
                      if (!participant && !value) {
                        return '비밀번호를 입력해주세요';
                      }
                      return true;
                    },
                  },
                }}
              />
              <Input
                id="passwordCheck"
                type="password"
                name="passwordCheck"
                label={participant ? '새 비밀번호 확인' : '비밀번호 확인'}
                formOption={{
                  validate: {
                    isMatch: (value: string) => {
                      if (value !== watch('password')) {
                        return '비밀번호가 일치하지 않습니다.';
                      }
                      return true;
                    },
                    required: (value: string) => {
                      if (!participant && !value) {
                        return '비밀번호를 입력해주세요';
                      }
                      return true;
                    },
                  },
                }}
              />
            </FieldStack>
          </div>
          <div className="py-2">
            <button
              className="cursor_pointer text-white bg-blue-500 border-blue-500 no-underline border px-3 py-1.5 rounded transition duration-150 ease-in-out
            active:bg-blue-600 active:border-blue-600 hover:bg-blue-600 hover:border-blue-600 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(28,143,255,.5)]"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              참가 신청
            </button>
            <div className="text-red-500 ml-2 inline ">{errorMessage}</div>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
}

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import FieldStack from './components/FieldStack';
import Input from './components/Input';
import OrderSelector from './components/OrderSelector';
import MarkdownTextArea from './components/MarkdownTextArea';

import AgreementInput from './components/AgreementInput';
import privacy from './agreements/privacy_20220714';

const schema = yup.object({
  eventId: yup.string().required('참가 부문을 선택해주세요.'),
  name: yup.string().required('이름을 입력해주세요.'),
  email: yup
    .string()
    .required('이메일을 입력해주세요.')
    .email('이메일 형식이 올바르지 않습니다.'),
  robotName: yup.string().required('로봇의 이름을 입력해주세요.'),
  entryOrder: yup.string().required('참가 순번을 입력해주세요.'),
  passwordCheck: yup
    .string()
    .test(
      'isEqualToPassword',
      '입력한 비밀번호가 서로 일치하지 않습니다.',
      (value, context) => value === context.parent.password,
    ),
  privacyAgreed: yup
    .boolean()
    .test('agreed', '동의가 필요합니다.', (value) => value),
});

export default function EntryForm(props) {
  const { competition, data, auth, onSubmitted } = props;
  const form = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });
  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (values) => {
    let response = null;

    try {
      // restruct to fit the backend server
      values.competitionId = competition._id;
      if (!values.password) delete values.password;

      if (data) {
        response = await axios.patch(`/api/participants/${data._id}`, values, {
          headers: { authorization: auth },
        });
      } else {
        response = await axios.post(`/api/participants`, values);
      }

      setErrorMessage(null);
      onSubmitted(response);
    } catch (err) {
      setErrorMessage(err.response.data);
    }
  };

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const [freshEvents, setFreshEvents] = useState();
  useEffect(() => {
    async function getFreshEvents() {
      const res = await axios.get(`/api/competitions/${competition._id}`, {
        params: { projection: 'events' },
      });
      setFreshEvents(res.data.events);
    }

    if (!freshEvents) {
      getFreshEvents();
    }
  }, [competition, freshEvents]);

  const watchEventId = watch('eventId');
  const [selectedEvent, setSelectedEvent] = useState();
  useEffect(() => {
    // update selectedEvent
    if (freshEvents) {
      setSelectedEvent(freshEvents.find((event) => event._id === watchEventId));
    }

    // change entryOrder field
    setValue('entryOrder', '');
    if (data && watchEventId === data.eventId) {
      setValue('entryOrder', data.entryOrder);
    }
  }, [freshEvents, watchEventId, data, setValue]);

  const watchEntryOrder = watch('entryOrder');

  return (
    <FormProvider {...form}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <AgreementInput
          id="entryPrivacyAgreed"
          name="privacyAgreed"
          agreement={privacy}
        />
        <hr />

        <h3>인적 사항</h3>
        <p className="text-muted">참가자의 정보를 입력해주세요.</p>
        <FieldStack>
          <Input type="text" label="이름" name="name" id="entryName" />
          <Input type="email" label="이메일" name="email" id="entryEmail" />
        </FieldStack>
        <Input type="text" label="소속" name="team" id="entryTeam" />
        <hr />
        <h3>로봇 정보</h3>
        <p className="text-muted">로봇에 대한 정보를 입력해주세요.</p>
        <Input
          type="text"
          label="로봇 이름"
          name="robotName"
          id="entryRobotName"
        />
        <FieldStack>
          <Input type="text" label="CPU" name="robotCPU" id="entryRobotCPU" />
          <Input type="text" label="ROM" name="robotROM" id="entryRobotROM" />
          <Input type="text" label="RAM" name="robotRAM" id="entryRobotRAM" />
        </FieldStack>
        <FieldStack>
          <Input
            type="text"
            label="Motor Driver"
            name="robotMotorDriver"
            id="entryRobotMotorDriver"
          />
          <Input
            type="text"
            label="Motor"
            name="robotMotor"
            id="entryRobotMotor"
          />
        </FieldStack>
        <FieldStack>
          <Input type="text" label="ADC" name="robotADC" id="entryRobotADC" />
          <Input
            type="text"
            label="Sensor"
            name="robotSensor"
            id="entryRobotSensor"
          />
        </FieldStack>
        <hr />
        <h3>참가 정보</h3>
        <p className="text-muted">대회에 참가할 방식을 선택해주세요.</p>
        <FieldStack>
          <Input as="select" label="참가 부문" name="eventId" id="entryEventId">
            <option key="" value="">
              선택
            </option>
            {competition &&
              competition.events.map((event) => (
                <option
                  key={event._id}
                  value={event._id}
                >{`${event.name} (${event.numb})`}</option>
              ))}
          </Input>
          <Input
            type="number"
            label="참가 순번"
            name="entryOrder"
            id="entryEntryOrder"
            disabled={!selectedEvent}
          />
        </FieldStack>
        {selectedEvent && (
          <div className="clearfix mb-4">
            <Form.Text className="text-muted mb-2">
              아래에서 참가 순번을 선택할 수 있습니다.
            </Form.Text>
            <OrderSelector
              style={{ height: '16rem' }}
              count={selectedEvent.numb}
              occupiedOrders={selectedEvent.participants.slice()}
              value={watchEntryOrder}
              onClick={(value) =>
                setValue('entryOrder', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
            <div className="float-right mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFreshEvents()}
              >
                새로고침
              </Button>
            </div>
          </div>
        )}
        <MarkdownTextArea
          label="하고 싶은 말"
          name="comment"
          id="entryComment"
          rows={5}
        />
        <hr />
        <h3>참가자 인증 수단</h3>
        <p className="text-muted">
          참가자 본인을 식별할 비밀번호를 입력해주세요.
        </p>
        <FieldStack>
          <Input
            type="password"
            label={data ? '새 비밀번호' : '비밀번호'}
            name="password"
            id="entryPassword"
          />
          <Input
            type="password"
            label={data ? '새 비밀번호 확인' : '비밀번호 확인'}
            name="passwordCheck"
            id="entryPasswordCheck"
          />
        </FieldStack>
        <hr />
        <Button type="submit" disabled={isSubmitting}>
          참가 신청
        </Button>
        <div className="d-inline text-danger ml-2">{errorMessage}</div>
      </Form>
    </FormProvider>
  );
}

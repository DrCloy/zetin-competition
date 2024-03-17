/* Dependencies */
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import axios from 'axios';

/* Bootstrap Components */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

/* Input Components */
import Input from './components/Input';
import EventInput from './components/EventInput';
import DateInput from './components/DateInput';
import MarkdownTextArea from './components/MarkdownTextArea';
import FieldStack from './components/FieldStack';

const defaultValues = {
  name: '',
  desc: '',
  events: [],
  regDateStart: '',
  regDateEnd: '',
  date: '',
  place: '',
  googleMap: '',
  organizer: '',
  sponser: '',
  prize: '',
  rule: '',
  moreInfo: '',
  posterId: '',
};

const schema = yup.object({
  name: yup.string().required('대회 이름을 입력해주세요.'),
  events: yup
    .array()
    .default([])
    .min(1, '하나 이상의 경연 대회를 추가해주세요.'),
  regDateStart: yup.string().required('참가 신청 접수 시작일을 입력해주세요.'),
  regDateEnd: yup
    .string()
    .test(
      'minDateTime',
      '참가 신청 접수 시작일보다 빠를 수 없습니다.',
      (value, context) =>
        moment(context.parent.regDateStart).diff(moment(value)) <= 0,
    ),
  date: yup
    .string()
    .required('대회 실시 날짜를 입력해주세요.')
    .test(
      'minDateTime',
      '참가 신청 접수 종료일보다 빠를 수 없습니다.',
      (value, context) =>
        moment(context.parent.regDateEnd).diff(moment(value)) <= 0,
    ),
  googleMap: yup.string().url('URL 형식이 올바르지 않습니다.'),
});

export default function CompetitionForm(props) {
  const { data, onSubmitted } = props;

  const form = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { handleSubmit, reset } = form;

  const onSubmit = async (values) => {
    try {
      let response;

      if (!data) {
        response = await axios.post('/api/competitions', values);
      } else {
        response = await axios.patch(`/api/competitions/${data._id}`, values);
      }

      onSubmitted && onSubmitted(response);
    } catch (err) {
      window.alert(err.response?.data);
    }
  };

  useEffect(() => {
    if (data) reset(data);
  }, [reset, data]);

  return (
    <FormProvider {...form}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" label="이름" name="name" id="cmpName" />
        <MarkdownTextArea label="설명" name="desc" id="cmpDesc" rows={12} />
        <EventInput label="경연 부문" name="events" id="cmpEvents" />
        <FieldStack>
          <DateInput
            label="참가 신청 접수 시작"
            name="regDateStart"
            id="cmpRegDateStart"
          />
          <DateInput
            label="참가 신청 접수 종료"
            name="regDateEnd"
            id="cmpRegDateEnd"
          />
          <DateInput label="대회 개최일" name="date" id="cmpDate" />
        </FieldStack>
        <FieldStack>
          <Input type="text" label="장소" name="place" id="cmpPlace" />
          <Input
            type="text"
            label="구글 지도"
            name="googleMap"
            id="cmpGoogleMap"
            advice={
              <>
                <a
                  href="https://www.google.com/maps/"
                  target="_blank"
                  rel="noreferrer"
                >
                  구글 지도
                </a>
                의 "공유 &gt; 지도 퍼가기"에서 iframe의 src 속성을 입력해주세요.
              </>
            }
          />
        </FieldStack>
        <FieldStack>
          <Input
            type="text"
            label="주최 및 주관"
            name="organizer"
            id="cmpOrganizer"
          />
          <Input type="text" label="후원" name="sponser" id="cmpSponser" />
        </FieldStack>
        <MarkdownTextArea
          label="시상 내역"
          name="prize"
          id="cmpPrize"
          rows={4}
        />
        <FieldStack>
          <Input
            type="text"
            label="대회 규정"
            name="rule"
            id="cmpRule"
            advice="대회 규정 파일 ID를 입력해주세요."
          />
          <Input
            type="text"
            label="대회 포스터"
            name="posterId"
            id="cmpPosterId"
            advice="대회 포스터 파일 ID를 입력해주세요."
          />
        </FieldStack>
        <MarkdownTextArea
          label="추가 정보"
          name="moreInfo"
          id="cmpMoreInfo"
          rows={8}
        />
        <Button type="submit">제출</Button>
      </Form>
    </FormProvider>
  );
}

import { CompetitionItem } from 'core/model';
import { repo } from 'di';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';
import Input from './components/input';
import MarkdownTextArea from './components/markdown-text-area';
import EventInput from './components/event-input';
import FieldStack from './components/field-stack';

export default function CompetitionForm({
  competition,
  onSubmitted,
}: {
  competition: CompetitionItem | null;
  onSubmitted: (response: CompetitionItem) => void;
}) {
  const form = useForm<CompetitionItem>({
    defaultValues: {
      id: competition?.id || '',
      name: competition?.name || '',
      description: competition?.description || '',
      events: competition?.events || [],
      regDateStart: competition?.regDateStart || new Date(),
      regDateEnd: competition?.regDateEnd || new Date(),
      date: competition?.date || new Date(),
      place: competition?.place || '',
      googleMap: competition?.googleMap || '',
      organizer: competition?.organizer || '',
      sponser: competition?.sponser || '',
      prize: competition?.prize || '',
      rule: competition?.rule || '',
      moreInfo: competition?.moreInfo || '',
      posterId: competition?.posterId || '',
    },
  });
  const { handleSubmit } = form;
  const checkRegDateEnd = {
    input: {
      max: '9999-12-31',
    },
    form: {
      validate: {
        minDateTime: (value: Date) =>
          !competition || value < competition.regDateStart
            ? '참가 신청 접수 시작일보다 빠를 수 없습니다'
            : true,
      },
    },
  };

  const onSubmit = async (data: CompetitionItem) => {
    try {
      let response: CompetitionItem;
      console.log(data);
      if (!data) {
        response = await repo.competitionDetail.createCompetition(data);
      } else {
        data.id = competition?.id || '';
        response = await repo.competitionDetail.updateCompetition(data);
      }

      onSubmitted && onSubmitted(response);
    } catch (error: any) {
      window.alert(error.response?.data);
    }
  };

  return (
    <FormProvider {...form}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          name="name"
          label="이름"
          id="cmpName"
          advice="대회 이름을 입력해주세요."
        />
        <MarkdownTextArea
          name="description"
          label="설명"
          id="cmpDesc"
          rows={12}
        />
        <EventInput name="events" label="경연 부문" id="cmpEvents" />
        <FieldStack>
          <Input
            type="datetime-local"
            name="regDateStart"
            label="참가 신청 접수 시작"
            id="regDateStart"
            advice="참가 신청 접수 시작일을 입력해주세요."
          />
          <Input
            type="datetime-local"
            name="regDateEnd"
            label="참가 신청 접수 종료"
            id="regDateEnd"
            advice="참가 신청 접수 마감일을 입력해주세요."
            otherOption={checkRegDateEnd}
          />
        </FieldStack>
      </Form>
      <button
        type="submit"
        className="cursor-pointer text-white bg-blue-500 border-blue-500 inline-block text-center align-middle border px-3 py-1 rounded transition duration-150 ease-in-out active:bg-blue-600 active:border-blue-600 hover:bg-blue-600 hover:border-blue-600 no-underline focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(38,143,255,.5)] focus:bg-blue-600 focus:border-blue-600"
      >
        제출
      </button>
    </FormProvider>
  );
}

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

  const option_regDateStart = {
    input: {},
    form: {
      valueAsDate: true,
    },
  };
  const option_regDateEnd = {
    input: {},
    form: {
      valueAsDate: true,
      validate: {
        minDate: (value: string) => {
          if (new Date(value) < new Date(form.getValues().regDateStart)) {
            return '참가 신청 마감일은 시작일보다 빠를 수 없습니다.';
          }
          return true;
        },
      },
    },
  };
  const option_date = {
    input: {},
    form: {
      valueAsDate: true,
      validate: {
        minDate: (value: string) => {
          if (new Date(value) < new Date(form.getValues().regDateEnd)) {
            return '참가 신청 접수 종료일보다 빠를 수 없습니다.';
          }
          return true;
        },
      },
    },
  };

  const onSubmit = async (data: CompetitionItem) => {
    console.log(data);
    try {
      let response: CompetitionItem;
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
            otherOption={option_regDateStart}
          />
          <Input
            type="datetime-local"
            name="regDateEnd"
            label="참가 신청 접수 종료"
            id="regDateEnd"
            advice="참가 신청 접수 마감일을 입력해주세요."
            otherOption={option_regDateEnd}
          />
          <Input
            type="datetime-local"
            name="date"
            label="대회 개최일"
            id="date"
            advice="대회 실시 날짜를 입력해주세요."
            otherOption={option_date}
          />
        </FieldStack>
        <FieldStack>
          <Input
            type="text"
            name="place"
            label="장소"
            id="place"
            advice="대회가 열리는 장소를 입력해주세요."
          />
          <Input
            type="text"
            name="googleMap"
            label="구글맵 URL"
            id="googleMap"
            advice="구글맵 URL을 입력해주세요."
          />
        </FieldStack>
      </Form>
      <button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        className="cursor-pointer text-white bg-blue-500 border-blue-500 inline-block text-center align-middle border px-3 py-1 rounded transition duration-150 ease-in-out active:bg-blue-600 active:border-blue-600 hover:bg-blue-600 hover:border-blue-600 no-underline focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(38,143,255,.5)] focus:bg-blue-600 focus:border-blue-600"
      >
        제출
      </button>
    </FormProvider>
  );
}

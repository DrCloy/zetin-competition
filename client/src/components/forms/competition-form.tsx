import { CompetitionItem } from 'core/model';
import { repo } from 'di';
import { FormProvider, useForm } from 'react-hook-form';
import { Form, Link } from 'react-router-dom';
import Input from './components/input';
import MarkdownTextArea from './components/markdown-text-area';
import EventInput from './components/event-input';
import FieldStack from './components/field-stack';
import { useEffect } from 'react';

export default function CompetitionForm({
  isOpen,
  competition,
  onSubmitted,
}: {
  isOpen: boolean;
  competition: CompetitionItem | null;
  onSubmitted: (response: CompetitionItem) => void;
}) {
  const form = useForm({
    defaultValues: {
      id: competition?.id || '',
      name: competition?.name || '',
      description: competition?.description || '',
      events: competition?.events || [],
      regDateStart: (competition?.regDateStart || new Date())
        .toLocaleString('sv-SE', {})
        .slice(0, 16),
      regDateEnd: (competition?.regDateEnd || new Date())
        .toLocaleString('sv-SE', {})
        .slice(0, 16),
      date: (competition?.date || new Date())
        .toLocaleString('sv-SE', {})
        .slice(0, 16),
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
    form: {
      required: '참가 신청 접수 시작일을 입력해주세요.',
      valueAsDate: true,
    },
  };
  const option_regDateEnd = {
    form: {
      required: '참가 신청 접수 마감일을 입력해주세요.',
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
    form: {
      required: '대회 실시 날짜를 입력해주세요.',
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
  const option_googleMap = {
    form: {
      pattern: {
        value: /https:\/\/www.google.com\/maps\/embed/,
        message: '올바른 구글맵 URL을 입력해주세요.',
      },
    },
  };

  const onSubmit = async (data: any) => {
    try {
      let response: CompetitionItem;
      if (!competition) {
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

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <FormProvider {...form}>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        <Input
          type="text"
          name="name"
          label="이름"
          id="cmpName"
          formOption={{ required: '대회 이름을 입력해주세요.' }}
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
            formOption={option_regDateStart.form}
          />
          <Input
            type="datetime-local"
            name="regDateEnd"
            label="참가 신청 접수 종료"
            id="regDateEnd"
            formOption={option_regDateEnd.form}
          />
          <Input
            type="datetime-local"
            name="date"
            label="대회 개최일"
            id="date"
            formOption={option_date.form}
          />
        </FieldStack>
        <FieldStack>
          <Input type="text" name="place" label="장소" id="place" />
          <div>
            <Input
              type="text"
              name="googleMap"
              label="구글맵 URL"
              id="googleMap"
              footer={
                <small className="text-gray-400 block text-[80%] box-border">
                  <Link
                    to="https://www.google.com/maps"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 no-underline hover:text-blue-700 hover:underline"
                  >
                    구글 지도
                  </Link>
                  의 "공유 &gt; 지도 퍼가기"에서 iframe의 src 속성을
                  입력해주세요.
                </small>
              }
              formOption={option_googleMap.form}
            />
          </div>
        </FieldStack>
        <FieldStack>
          <Input
            type="text"
            name="organizer"
            label="주최 및 주관"
            id="organizer"
          />
          <Input type="text" name="sponser" label="후원" id="sponser" />
        </FieldStack>
        <MarkdownTextArea name="prize" label="시상 내역" id="prize" rows={4} />
        <FieldStack>
          <Input
            type="text"
            name="rule"
            label="대회 규정"
            id="rule"
            footer={<small>대회 규정 파일 ID를 입력해주세요.</small>}
          />
          <Input
            type="text"
            name="posterId"
            label="대회 포스터"
            id="posterId"
            footer={<small>대회 포스터 파일 ID를 입력해주세요.</small>}
          />
        </FieldStack>
        <MarkdownTextArea
          name="moreInfo"
          label="추가 정보"
          id="moreInfo"
          rows={8}
        />
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

import { CompetitionItem } from 'core/model';
import { repo } from 'di';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';
import Input from './components/input';
import MarkdownTextArea from './components/markdown-text-area';
import EventInput from './components/event-input';

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

  const onSubmit = async (data: CompetitionItem) => {
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
      </Form>
      <button type="submit">제출</button>
    </FormProvider>
  );
}

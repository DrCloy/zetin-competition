import { useState } from 'react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import Input from './components/input';

export default function ParticipantAuthForm({
  onSucceed,
  onFailed,
  onCancelled,
}: {
  onSucceed: (data: { password: string }) => Promise<void>;
  onFailed?: (data: { password: string }) => Promise<void>;
  onCancelled?: () => void;
}) {
  const form = useForm({
    defaultValues: {
      password: '',
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (data: { password: string }) => {
    try {
      onSucceed(data);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.response?.data || '인증에 실패했습니다.');
      onFailed && onFailed(data);
    }
  };

  return (
    <FormProvider {...form}>
      <Form noValidate onSubmit={() => handleSubmit(onSubmit)()}>
        <div className="mb-4">
          <Input
            type="password"
            name="password"
            id="password"
            label="비밀번호"
          />
        </div>
        <button
          className="cursor-pointer px-3 py-1.5 text-base rounded text-white bg-blue-500 border-blue-500 inline-block text-center align-middle border transition duratio-150 ease-in-out active:bg-blue-700 active:border-blue-700 hover:bg-blue-600 hover:border-blue-600 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(38,143,255,.5)] mr-1"
          type="submit"
          disabled={isSubmitting}
        >
          인증
        </button>
        <button
          className="cursor-pointer px-3 py-1.5 text-base rounded text-white bg-gray-400 border-gray-400 inline-block text-center align-middle border transition duratio-150 ease-in-out active:bg-gray-600 active:border-gray-600 hover:bg-gray-500 hover:border-gray-500 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(130,138,145,.5)]"
          type="button"
          onClick={onCancelled}
        >
          취소
        </button>
        {errorMessage && <small>{errorMessage}</small>}
      </Form>
    </FormProvider>
  );
}

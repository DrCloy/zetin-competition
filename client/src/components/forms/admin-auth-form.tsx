import Input from 'components/input';
import { AuthInput, AuthPayload } from 'core/model';
import { repo } from 'di';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';

export default function AdminAuthForm({
  onAuthChange,
}: {
  onAuthChange: (p: AuthPayload | null) => void;
}) {
  const form = useForm<AuthInput>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const [payload, setPayload] = useState<AuthPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSucceed = useCallback(
    (payload: AuthPayload | null) => {
      setPayload(payload);
      setErrorMessage('');
      onAuthChange && onAuthChange(payload);
    },
    [onAuthChange],
  );

  const onFailed = useCallback(
    (error: { response: { data: string } }) => {
      setPayload(null);
      setErrorMessage(error.response.data);
      onAuthChange && onAuthChange(null);
    },
    [onAuthChange],
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await repo.auth.getStatus();
        onSucceed(response);
      } catch (error: any) {
        onFailed(error);
      }
    })();
  }, [onSucceed, onFailed]);

  const onSignIn = async (data: AuthInput) => {
    try {
      const response = await repo.auth.signin(data);
      onSucceed(response);
    } catch (error: any) {
      onFailed(error);
    }
  };

  const onSignOut = async () => {
    try {
      await repo.auth.signout();
      onSucceed(null);
    } catch (error: any) {
      onFailed(error);
    }
  };
  return payload ? (
    <div>
      <p className="mb-4">{payload.username}님 환영합니다.</p>
      <p className="mb-4">
        발급된 인증 토큰은
        <br />
        {payload.expiredAt.toLocaleString('sv-SE')}
        까지
        <br />
        사용할 수 있습니다. 재발급받길 원한다면 인증 해제 후 다시 인증하시길
        바랍니다.
      </p>
      <button
        className=" m-0 box-border leading-normal inline-block text-center align-middle border border-transparent py-[0.375rem] px-3 text-base rounded transition duration-150 ease-in-out text-white bg-gray-500 border-gray-500 cursor-pointer 
          active:bg-gray-600 active:border-gray-600
          hover:bg-gray-600 hover:border-gray-600 
          focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(107,114,128,.5)]"
        onClick={() => onSignOut()}
      >
        인증 해제
      </button>
    </div>
  ) : (
    <FormProvider {...form}>
      <Form onSubmit={handleSubmit(onSignIn)} noValidate>
        <div className="mb-4">
          <Input
            type="text"
            id="id"
            label="아이디"
            name="id"
            advice="ZETIN 서비스 아이디를 입력해주세요."
          />
        </div>
        <div>
          <Input
            type="password"
            id="pw"
            label="비밀번호"
            name="pw"
            advice="비밀번호를 입력해주세요."
          />
        </div>
        <button
          className=" m-0 box-border leading-normal inline-block text-center align-middle border border-transparent py-[0.375rem] px-3 text-base rounded transition duration-150 ease-in-out text-white bg-blue-600 border-blue-600 cursor-pointer 
          active:bg-[#0062cc] active:border-[#005cbf]
          hover:bg-[#0069d9] hover:border-[#0062cc] 
          focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(38,143,255,.5)"
          type="submit"
          disabled={isSubmitting}
        >
          인증
        </button>
        <small className="text-red-600 block mt-1 text-sm font-normal">
          {errorMessage}
        </small>
      </Form>
    </FormProvider>
  );
}

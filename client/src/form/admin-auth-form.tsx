import Input from 'components/input';
import { AuthInput } from 'core/model';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';

export default function AdminAuthForm({
  onAuthChange,
}: {
  onAuthChange: (p: any) => void;
}) {
  const form = useForm<AuthInput>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const [payload, setPayload] = useState(null);

  const onSubmit = async (data: AuthInput) => {
    console.log(data);
  };
  return payload ? (
    <div>
      <p>{payload}님 환영합니다.</p>
      <p>
        발급된 인증 토큰은
        <br />
        {Date.now()}
        까지
        <br />
        사용할 수 있습니다. 재발급받길 원한다면 인증 해제 후 다시 인증하시길
        바랍니다.
      </p>
      <button onClick={() => setPayload(null)}>인증 해제</button>
    </div>
  ) : (
    <FormProvider {...form}>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
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
        <button type="submit" disabled={isSubmitting}>
          인증
        </button>
        <small></small>
      </Form>
    </FormProvider>
  );
}

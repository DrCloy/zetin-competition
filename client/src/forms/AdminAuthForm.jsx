import { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import moment from 'moment';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Input from './components/Input';

const schema = yup.object({
  id: yup.string().required('ZETIN 서비스 아이디를 입력해주세요.'),
  pw: yup.string().required('비밀번호를 입력해주세요.'),
});

export default function AdminAuthForm(props) {
  const { onAuthChange } = props;
  const form = useForm({ resolver: yupResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const [payload, setPayload] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onSucceed = useCallback(
    (payload) => {
      setPayload(payload);
      setErrorMessage('');
      onAuthChange && onAuthChange(payload);
    },
    [onAuthChange],
  );

  const onFailed = useCallback(
    (errorMessage) => {
      setPayload(null);
      setErrorMessage(errorMessage);
      onAuthChange && onAuthChange(null);
    },
    [onAuthChange],
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/admin/status');
        onSucceed(res.data);
      } catch (err) {
        onFailed(err.response.data);
      }
    })();
  }, [onSucceed, onFailed]);

  const signIn = async ({ id, pw }) => {
    try {
      const res = await axios.post('/api/admin/signin', { id, pw });
      onSucceed(res.data);
    } catch (err) {
      onFailed(err.response.data);
    }
  };

  const signOut = async () => {
    try {
      await axios.post('/api/admin/signout');
      onSucceed(null);
    } catch (err) {
      onFailed(err.response.data);
    }
  };

  return payload ? (
    <div>
      <p>{payload.username}님 환영합니다.</p>
      <p>
        발급된 인증 토큰은
        <br />
        {moment.unix(payload.exp).format('YYYY년 MM월 DD일 HH시 mm분 ss초')}
        까지
        <br />
        사용할 수 있습니다. 재발급받길 원한다면 인증 해제 후 다시 인증하시길
        바랍니다.
      </p>
      <Button variant="secondary" onClick={() => signOut()}>
        인증 해제
      </Button>
    </div>
  ) : (
    <FormProvider {...form}>
      <Form noValidate onSubmit={handleSubmit(signIn)}>
        <Input type="text" label="아이디" name="id" id="adminID" />
        <Input type="password" label="비밀번호" name="pw" id="adminPW" />
        <Button type="submit" disabled={isSubmitting}>
          인증
        </Button>
        <Form.Text className="text-danger">{errorMessage}</Form.Text>
      </Form>
    </FormProvider>
  );
}

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Input from './components/Input';

export default function ParticipantAuthForm(props) {
  const { participant, onSucceed, onFailed, onCancelled } = props;
  const form = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (data) => {
    try {
      await axios.get(`/api/participants/${participant._id}/password`, {
        headers: { Authorization: data.password },
      });
      onSucceed && onSucceed(data);
      setErrorMessage(null);
    } catch (err) {
      onFailed && onFailed();
      setErrorMessage('인증에 실패했습니다.');
    }
  };

  return (
    <FormProvider {...form}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input type="password" label="비밀번호" name="password" id="password" />
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          인증
        </Button>{' '}
        <Button variant="secondary" onClick={onCancelled}>
          취소
        </Button>
        <small className="d-block text-danger mt-2">{errorMessage}</small>
      </Form>
    </FormProvider>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function ParticipantAuthForm(props) {
  const { participant, method, onSucceed, onFailed, onCancelled } = props;
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (data) => {
    const { password } = data;

    const res = await axios.options(`/api/participants/${participant._id}`, {
      headers: { Authorization: password },
    });

    const { allow } = res.headers;
    if (allow) {
      const match = allow.search(new RegExp(method, 'gi'));
      if (match > -1) {
        onSucceed && onSucceed(data);
        setErrorMessage(null);
      } else {
        onFailed && onFailed();
        setErrorMessage('인증에 실패했습니다.');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="password">
        <Form.Label>비밀번호</Form.Label>
        <Form.Control type="password" {...register('password')} />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={isSubmitting}>
        인증
      </Button>{' '}
      <Button variant="secondary" onClick={onCancelled}>
        취소
      </Button>
      <small className="d-block text-danger mt-2">{errorMessage}</small>
    </Form>
  );
}

export default ParticipantAuthForm;

/* Packages */
import React from 'react';
import { useForm } from 'react-hook-form';

/* Bootstrap */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function AdminLoginForm(props) {
  const { register, handleSubmit, formState } = useForm();

  // Component: Login Button
  const LoginButton = () => {
    const { isSubmitting, isValid } = formState;

    // login function with zetin auth api
    const login = async (user) => {
      const token = await getZetinJwt(user);

      console.log(token);
    };

    return (
      <>
        {}
        <Button variant="primary" onClick={handleSubmit(login)}>
          로그인
        </Button>
      </>
    );
  };

  return (
    <Form>
      {/* ID Input */}
      <Form.Group controlId="userID">
        <Form.Label>ID</Form.Label>
        <Form.Control type="id" {...register('id', { required: true })} />
      </Form.Group>

      {/* Password Input */}
      <Form.Group controlId="userPW">
        <Form.Label>PW</Form.Label>
        <Form.Control type="password" {...register('pw', { required: true })} />
      </Form.Group>

      <LoginButton />
    </Form>
  );
}

async function getZetinJwt(user) {
  const resToken = await axios.post('https://auth.zetin.uos.ac.kr/auth', user);
  const { status, token } = resToken.data;

  if (status === 'success') {
    return token;
  } else {
    throw new Error('로그인에 실패했습니다. ID 및 PW를 확인해주세요.');
  }
}

export default AdminLoginForm;

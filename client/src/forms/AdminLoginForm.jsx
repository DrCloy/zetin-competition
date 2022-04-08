/* Packages */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

/* Bootstrap */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function AdminLoginForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // for storing and printing error message
  const [errorMessage, setErrorMessage] = useState('');

  // form submit handler
  const handleAuth = handleSubmit(async (user) => {
    try {
      const resToken = await axios.post('/api/auth/admin', user);
      const token = resToken.data;

      props.onAdminLogin && props.onAdminLogin(token); // lifting up token information
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.response.data);
    }
  });

  return (
    <Form onSubmit={handleAuth}>
      <Form.Group controlId="userID">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="id"
          {...register('id', { required: true })}
          isInvalid={errors.id}
        />
        <Form.Control.Feedback type="invalid">
          Please enter your username of ZETIN service.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="userPW">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          {...register('pw', { required: true })}
          isInvalid={errors.pw}
        />
        <Form.Control.Feedback type="invalid">
          Please enter the password.
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in ...' : 'Sign in'}
      </Button>
      <small className="d-block text-danger mt-2">{errorMessage}</small>
    </Form>
  );
}

export default AdminLoginForm;

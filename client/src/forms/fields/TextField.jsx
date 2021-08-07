import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField } from 'formik';

const TextField = (props) => {
  const { label, controlId } = props;

  const [field, meta] = useField(props.name);
  const { touched, error } = meta;

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control type="text" isInvalid={touched && error} {...field} />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      {props.children}
    </Form.Group>
  );
};

export default TextField;

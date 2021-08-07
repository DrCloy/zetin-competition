import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField } from 'formik';

const TextField = (props) => {
  const { label, controlId, multiLine, rows, advice } = props;

  const [field, meta] = useField(props.name);
  const { touched, error } = meta;

  field.isInvalid = touched && error;

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      {multiLine ? (
        <Form.Control as="textarea" rows={rows || 4} {...field} />
      ) : (
        <Form.Control type="text" {...field} />
      )}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      <Form.Text className="text-muted">{advice}</Form.Text>
    </Form.Group>
  );
};

export default TextField;

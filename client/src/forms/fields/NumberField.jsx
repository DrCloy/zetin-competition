import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField } from 'formik';

const NumberField = (props) => {
  const { label, max, min, step, controlId } = props;

  const [field, meta] = useField(props.name);
  const { touched, error } = meta;

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="number"
        isInvalid={touched && error}
        max={max}
        min={min}
        step={step}
        {...field}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default NumberField;

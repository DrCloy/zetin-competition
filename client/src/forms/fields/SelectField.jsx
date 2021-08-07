import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField } from 'formik';

const SelectField = (props) => {
  const { label, name, options, controlId } = props;

  const [field, meta] = useField(name);

  // options := [[value, label], [value, label], ... , [value, label]]
  //            (value: is sent to the server, label: is shown to user)
  const optionElements = options.map((option) => (
    <option key={option[0]} value={option[0]}>
      {option[1]}
    </option>
  ));

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        isInvalid={meta.touched && meta.error}
        {...field}
      >
        {optionElements}
      </Form.Control>
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default SelectField;

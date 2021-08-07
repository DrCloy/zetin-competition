import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField } from 'formik';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

const DateField = (props) => {
  const { label, controlId, disabled, enableTime } = props;

  const [field, meta, helpers] = useField(props.name);
  const { name, value } = field;
  const { touched, error } = meta;
  const { setValue, setTouched } = helpers;

  let options = {
    enableTime: false,
    allowInput: true,
    dateFormat: 'Y-m-d',
  };
  if (enableTime)
    options = { ...options, enableTime: true, dateFormat: 'Y-m-d\\TH:i' };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Flatpickr
        className={'form-control' + (touched && error ? ' is-invalid' : '')}
        options={options}
        name={name}
        value={value}
        onChange={(selectedDates, dateStr) => setValue(dateStr)}
        onClose={() => setTouched(true)}
        disabled={disabled}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default DateField;

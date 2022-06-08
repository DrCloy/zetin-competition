import { useFormContext, Controller } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

export default function DateInput(props) {
  const { id, label, name, className, options, ...restProps } = props;

  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;

  const defaultOptions = {
    enableTime: true,
    allowInput: true,
    dateFormat: 'Y-m-d\\TH:i',
    disableMobile: true,
  };

  return (
    <Controller
      render={({ field: { onChange, ref, ...otherFields } }) => (
        <Form.Group controlId={id} ref={ref} tabIndex={-1}>
          {label && <Form.Label>{label}</Form.Label>}
          <Flatpickr
            className={
              'form-control' +
              (error ? ' is-invalid' : '') +
              (className ? ` ${className}` : '')
            }
            options={{ ...defaultOptions, ...options }}
            onChange={([date]) => onChange(date)}
            {...otherFields}
            {...restProps}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>
      )}
      control={control}
      name={name}
    />
  );
}

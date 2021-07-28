import React from 'react';
import Flatpickr from 'react-flatpickr';

import 'flatpickr/dist/themes/light.css';

function _baseDateField(customOptions) {
  return (props) => {
    const { isInvalid, value, onChange, onBlur, disabled } = props;
    const options = {
      enableTime: false,
      allowInput: true,
      dateFormat: 'Y-m-d',
      defaultDate: value,
      ...customOptions,
    };

    return (
      <Flatpickr
        className={'form-control ' + (isInvalid ? 'is-invalid' : '')}
        options={options}
        onChange={(selectedDates, dateStr) => onChange(dateStr)}
        onClose={onBlur}
        disabled={disabled}
      />
    );
  };
}

const DateField = _baseDateField();

const DateTimeField = _baseDateField({
  enableTime: true,
  dateFormat: 'Y-m-d\\TH:i',
});

export { DateField, DateTimeField };

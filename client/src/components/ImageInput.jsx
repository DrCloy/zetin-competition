import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import IamgeThumbnail from './ImageThumbnail';

/* ImageInput Component
 *  - Just for serving `frame' of file input for image.
 *  - Unlike any other field, it does NOT hook up input to Formik
 */
const ImageInput = (props) => {
  const { label, value, onChange, width, controlId } = props;

  const fileInput = useRef();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    if (!!e) {
      const image = e.target.files[0];
      const regex = new RegExp(`^(image\\/)`, 'gi');
      // match only image file
      if (image.type.match(regex)) {
        onChange(image);
        setError('');
        return;
      } else {
        setError('이미지 파일 형식이 아닙니다.');
      }
    }
    onChange(null);
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <IamgeThumbnail file={value} width={width || 400} />
      <div className="mt-2">
        <Button
          variant="secondary"
          onClick={() => fileInput.current.click()}
          size="sm"
        >
          파일 선택
        </Button>{' '}
        <Button
          variant="danger"
          className={value ? '' : 'd-none'}
          onClick={() => handleChange(null)}
          size="sm"
        >
          파일 삭제
        </Button>
      </div>
      <Form.Control
        type="file"
        className="d-none"
        accept="image/*"
        onChange={handleChange}
        ref={fileInput}
        isInvalid={error}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default ImageInput;

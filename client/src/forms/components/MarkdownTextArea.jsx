import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { markdown as md } from '../../utils';

export default function MarkdownTextArea(props) {
  const { id, label, name, ...restProps } = props;
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState();
  const { register, getValues } = useFormContext();

  useEffect(() => {
    if (preview) {
      const value = getValues(name);
      if (value) {
        setContent(md.render(value));
      } else {
        setContent('<span>미리 볼 내용이 없습니다.</span>');
      }
    }
  }, [preview, name, getValues]);

  return (
    <Form.Group className="clearfix" controlId={id}>
      {label && <Form.Label>{label}</Form.Label>}
      <div className={preview ? 'd-none' : ''}>
        <Form.Control {...restProps} {...register(name)} as="textarea" />
      </div>
      <div
        className={
          'border border-success rounded px-3 py-2 ' + (preview ? '' : 'd-none')
        }
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="float-right mt-2">
        <small className="text-muted mr-3">Markdown 문법을 지원합니다.</small>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setPreview(!preview)}
        >
          {preview ? '수정' : '미리 보기'}
        </Button>
      </div>
    </Form.Group>
  );
}

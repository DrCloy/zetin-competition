import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import bsCustomFileInput from 'bs-custom-file-input';

import Input from './components/Input';

export default function FileUploadForm(props) {
  const { data, onSubmitted } = props;
  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required('파일 이름을 입력해주세요.'),
        description: yup.string(),
        private: yup.boolean(),
        file: yup
          .mixed()
          .test(
            'required',
            '업로드할 파일을 선택해주세요.',
            (value) => data || value.length > 0,
          ),
      }),
    [data],
  );

  const form = useForm({ resolver: yupResolver(schema) });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    try {
      let response = null;
      const formData = new FormData();
      formData.set('name', values.name);
      formData.set('description', values.description);
      formData.set('private', values.private);
      const file = values.file[0];
      if (file instanceof File) formData.set('file', file);

      if (!data) {
        response = await axios.post('/api/files', formData);
      } else {
        response = await axios.patch(`/api/files/${data._id}`, formData);
      }

      onSubmitted && onSubmitted(response);
    } catch (err) {
      alert(err.response?.data);
    }
  };

  useEffect(() => {
    reset(data);
  }, [reset, data]);

  useEffect(() => {
    // https://react-bootstrap-v4.netlify.app/components/forms/#forms-custom-file
    // FOR CUSTOM FILE INPUT LABLING
    bsCustomFileInput.init();
  }, []);

  return (
    <FormProvider {...form}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="fileUpload">
          <Form.Label>파일 업로드</Form.Label>
          <Form.File
            {...register('file')}
            isInvalid={errors.file}
            feedback={errors.file?.message}
            label=""
            custom
          />
        </Form.Group>
        <Form.Group controlId="filePrivate">
          <Form.Check
            {...register('private')}
            label="파일 비공개(관리자 외 접근 불가)"
          />
        </Form.Group>
        <Input type="text" label="파일 이름" name="name" id="fileId" />
        <Input
          as="textarea"
          label="파일 설명"
          name="description"
          id="fileDescription"
        />
        <Button type="submit" disabled={isSubmitting}>
          제출
        </Button>
      </Form>
    </FormProvider>
  );
}

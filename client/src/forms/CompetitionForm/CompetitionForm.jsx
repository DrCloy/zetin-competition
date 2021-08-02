import React from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

// Custom UIs
import EventField from './EventField';
import FileThumbnail from '../FileThumbnail';
import MarkdownWrapper from '../../components/MarkdownWrapper';
import { DateField, DateTimeField } from './DateFields';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CompetitionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rules: [],
      poster: null,
    };

    // schema of competition
    this.schema = yup.object().shape({
      name: yup.string().default('').required('대회 이름을 입력해주세요.'),
      desc: yup.string().default(''),
      events: yup
        .array()
        .default([])
        .min(1, '하나 이상의 경연 대회를 추가해주세요.'),
      regDateStart: yup
        .string()
        .default('')
        .required('참가 신청 접수 시작일을 입력해주세요.'),
      regDateEnd: yup
        .string()
        .default('')
        .required('참가 신청 접수 종료일을 입력해주세요.')
        .test(
          'is-later-than-regStartDate',
          '참가 신청 접수 시작일보다 빠를 수 없습니다.',
          function (value) {
            // https://github.com/jquense/yup/issues/420#issuecomment-540080334
            const regDateStart = new Date(this.options.parent.regDateStart);
            const regDateEnd = new Date(value);
            return regDateStart.getTime() <= regDateEnd.getTime();
          },
        ),
      date: yup
        .string()
        .default('')
        .required('대회 실시 날짜를 입력해주세요.')
        .test(
          'is-later-than-regStartEnd',
          '참가 신청 접수 종료일보다 빠를 수 없습니다.',
          function (value) {
            const regDateEnd = new Date(this.options.parent.regDateEnd);
            const date = new Date(value);
            return regDateEnd.getTime() <= date.getTime();
          },
        ),
      place: yup.string().default(''),
      googleMap: yup.string().default('').url('URL 형식이 올바르지 않습니다.'),
      organizer: yup.string().default(''),
      sponser: yup.string().default(''),
      prize: yup.string().default(''),
      rule: yup.string().default(''),
      moreInfo: yup.string().default(''),
      posterId: yup.string().default(''),
    });

    this.posterFileInput = React.createRef();
  }

  getInitialValues() {
    const { competition } = this.props;

    // initial values (set default value of schema and overwrite data from props)
    let initialValues = { ...this.schema.getDefaultFromShape() };
    if (typeof competition === 'object') {
      initialValues = { ...initialValues, ...competition };
    }

    return initialValues;
  }

  getPosterBlob(posterId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/files/${posterId}`, { responseType: 'blob' })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  async componentDidMount() {
    try {
      const { competition } = this.props;

      let ruleResponse = await axios.get(`/api/rules`);
      let posterFile = null;
      if (typeof competition === 'object' && competition.posterId) {
        posterFile = await this.getPosterBlob(competition.posterId);
      }

      this.setState({ rules: ruleResponse.data.slice(), poster: posterFile });
    } catch (err) {
      console.error(err);
    }
  }

  async componentDidUpdate(prevProps) {
    try {
      const { competition } = this.props;

      if (competition !== prevProps.competition) {
        let posterFile = null;
        if (typeof competition === 'object' && competition.posterId) {
          posterFile = await this.getPosterBlob(competition.posterId);
        }
        this.setState({ poster: posterFile });
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { competition, onSubmitFinished } = this.props;
    const isNew = !competition;
    const posterId = competition ? competition.posterId : undefined;

    return (
      <>
        <Formik
          initialValues={this.getInitialValues()}
          validationSchema={this.schema}
          onSubmit={async (data) => {
            try {
              // upload poster image file
              if (this.state.poster) {
                const fileForm = new FormData();
                let file;

                fileForm.set('file', this.state.poster);
                if (!data.posterId) {
                  fileForm.set('category', 'poster');
                  fileForm.set('description', `${data.name}`);
                  file = await axios.post(`/api/files`, fileForm);
                } else {
                  file = await axios.patch(`/api/files/${posterId}`, fileForm);
                }

                data.posterId = file.data._id;
              } else {
                if (!isNew) {
                  await axios.delete(`/api/files/${posterId}`);
                }
                data.posterId = '';
              }

              // post data
              let comp;
              if (isNew) {
                comp = await axios.post(`/api/competitions`, data);
              } else {
                comp = await axios.patch(
                  `/api/competitions/${competition._id}`,
                  data,
                );
              }

              if (typeof onSubmitFinished === 'function') {
                onSubmitFinished(comp);
              }
            } catch (err) {
              console.error(err);
            }
          }}
        >
          {({
            values,
            touched,
            errors,
            isValid,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            getFieldProps,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="compName">
                <Form.Label>이름</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={touched.name && errors.name}
                  {...getFieldProps('name')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="compDesc">
                <Form.Label>설명</Form.Label>
                <MarkdownWrapper>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    {...getFieldProps('desc')}
                  />
                </MarkdownWrapper>
              </Form.Group>
              <Form.Group controlId="compEvents" className="clearfix">
                <Form.Label>경연 부문</Form.Label>
                <EventField
                  events={values.events}
                  onChange={(e) => {
                    const idx = e.index;
                    const evt = e.event;
                    const events = values.events.slice();

                    if (evt === null) {
                      events.splice(idx, 1); // delete
                    } else {
                      if (idx === -1) {
                        events.push({ ...evt }); // add
                      } else {
                        events.splice(idx, 1, { ...evt }); // edit
                      }
                    }

                    setFieldTouched('events', true);
                    setFieldValue('events', events);
                  }}
                  isInvalid={touched.events && errors.events}
                  msgForInvalid={errors.events}
                />
              </Form.Group>

              <div>
                <Row>
                  <Col lg>
                    <Form.Group controlId="compRegDateStart">
                      <Form.Label>참가 신청 접수 시작일</Form.Label>
                      <DateField
                        value={values.regDateStart}
                        onChange={(date) => setFieldValue('regDateStart', date)}
                        onBlur={() => setFieldTouched('regDateStart', true)}
                        isInvalid={touched.regDateStart && errors.regDateStart}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.regDateStart}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        대회 참가 신청 페이지가 입력한 날짜에 자동으로 열립니다.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col lg>
                    <Form.Group controlId="compRegDateEnd">
                      <Form.Label>참가 신청 접수 종료일</Form.Label>
                      <DateField
                        value={values.regDateEnd}
                        onChange={(date) => setFieldValue('regDateEnd', date)}
                        onBlur={() => setFieldTouched('regDateEnd', true)}
                        isInvalid={touched.regDateEnd && errors.regDateEnd}
                        disabled={!values.regDateStart}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.regDateEnd}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg>
                    <Form.Group controlId="compDate">
                      <Form.Label>대회 개최일</Form.Label>
                      <DateTimeField
                        value={values.date}
                        onChange={(date) => setFieldValue('date', date)}
                        onBlur={() => setFieldTouched('date', true)}
                        isInvalid={touched.date && errors.date}
                        disabled={!values.regDateEnd}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.date}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <Form.Group controlId="compPlace">
                <Form.Label>장소</Form.Label>
                <Form.Control type="text" {...getFieldProps('place')} />
              </Form.Group>
              <Form.Group controlId="compGoogleMap">
                <Form.Label>구글 지도</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={touched.googleMap && errors.googleMap}
                  {...getFieldProps('googleMap')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.googleMap}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  <a
                    href="https://www.google.com/maps/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    구글 지도
                  </a>
                  의 "공유 &gt; 지도 퍼가기"에서 iframe의 src 속성을
                  입력해주세요.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="compOrganizer">
                <Form.Label>주최 및 주관</Form.Label>
                <Form.Control type="text" {...getFieldProps('organizer')} />
              </Form.Group>
              <Form.Group controlId="compSponser">
                <Form.Label>후원</Form.Label>
                <Form.Control type="text" {...getFieldProps('sponser')} />
              </Form.Group>
              <Form.Group controlId="compPrize">
                <Form.Label>시상 내역</Form.Label>
                <MarkdownWrapper>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    {...getFieldProps('prize')}
                  />
                </MarkdownWrapper>
              </Form.Group>
              <Form.Group controlId="compRule">
                <Form.Label>대회 규정</Form.Label>
                <Form.Control as="select" {...getFieldProps('rule')}>
                  <option value="">대회 규정 선택</option>
                  {this.state.rules.map((value) => (
                    <option key={value._id} value={value._id}>
                      {value.name} ({value.version})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="compMoreInfo">
                <Form.Label>추가 정보</Form.Label>
                <MarkdownWrapper>
                  <Form.Control
                    as="textarea"
                    rows="8"
                    {...getFieldProps('moreInfo')}
                  />
                </MarkdownWrapper>
              </Form.Group>
              <Form.Group controlId="compPoster">
                <Form.Label>대회 포스터</Form.Label>
                <Form.Control
                  type="file"
                  ref={this.posterFileInput}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    this.setState({ poster: e.target.files[0] });
                  }}
                />
                <div>
                  <FileThumbnail file={this.state.poster} width={400} />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      this.posterFileInput.current.click();
                    }}
                    className={'mt-2'}
                    size="sm"
                  >
                    파일 선택
                  </Button>
                  <Button
                    variant="danger"
                    className={
                      'mt-2 ml-2' + (this.state.poster ? '' : ' d-none')
                    }
                    onClick={() => {
                      this.setState({ poster: null });
                    }}
                    size="sm"
                  >
                    파일 삭제
                  </Button>
                </div>
              </Form.Group>
              <hr />
              <Button className="mr-2" type="submit">
                {isNew ? '개설' : '수정'}
              </Button>
              <Button
                variant="info"
                onClick={() => {
                  alert(JSON.stringify(values));
                  console.log(values);
                }}
              >
                값 미리보기
              </Button>
              {isValid ? null : (
                <div>폼이 invalid합니다. 필드를 확인해주세요.</div>
              )}
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default CompetitionForm;

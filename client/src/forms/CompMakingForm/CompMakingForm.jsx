import React from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

// Custom UIs
import EventField from './EventField';
import Thumb from '../Thumb';
import MarkdownWrapper from '../../components/MarkdownWrapper';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CompMakingForm extends React.Component {
  schema = Yup.object().shape({
    name: Yup.string().required('대회 이름을 입력해주세요.'),
    desc: Yup.string(),
    events: Yup.array().min(1, '하나 이상의 경연 대회를 추가해주세요.'),
    date: Yup.string().required('대회 실시 날짜를 입력해주세요.'),
    regDateStart: Yup.string().required(
      '참가 신청 접수 시작일을 입력해주세요.',
    ),
    regDateEnd: Yup.string().required('참가 신청 접수 종료일을 입력해주세요.'),
    googleMap: Yup.string().url('URL 형식이 올바르지 않습니다.'),
  });

  constructor(props) {
    super(props);

    this.state = {
      rules: [],
      poster: null,
    };

    this.posterFileInput = React.createRef();
  }

  componentDidMount() {
    axios
      .get('/api/rules')
      .then((res) => {
        this.setState({ rules: res.data.slice() });
      })
      .catch((err) => alert(err));
  }

  render() {
    return (
      <>
        <Formik
          initialValues={{
            name: '',
            desc: '',
            events: [],
            date: '',
            regDateStart: '',
            regDateEnd: '',
            place: '',
            googleMap: '',
            organizer: '',
            sponser: '',
            prize: '',
            rule: '',
            moreInfo: '',
          }}
          validationSchema={this.schema}
          onSubmit={(data) => {
            axios // Post new competition form
              .post('/api/competitions', data)
              .then((res) => {
                if (this.state.poster) {
                  const id = res.data._id;
                  const formData = new FormData();
                  formData.set('poster', this.state.poster);
                  axios // Post poster image
                    .post(`/files/posters/${id}`, formData)
                    .then(() => {
                      alert('성공!');
                    })
                    .catch((err) => {
                      alert(err);
                    });
                } else {
                  alert('성공!');
                }
              })
              .catch((err) => alert(err));
          }}
        >
          {({
            values,
            touched,
            errors,
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
              <Row>
                <Col lg>
                  <Form.Group controlId="compRegDateStart">
                    <Form.Label>참가 신청 접수 시작일</Form.Label>
                    <Form.Control
                      type="date"
                      max={values.regDateEnd}
                      isInvalid={touched.regDateStart && errors.regDateStart}
                      {...getFieldProps('regDateStart')}
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
                    <Form.Control
                      type="date"
                      min={values.regDateStart}
                      disabled={!values.regDateStart}
                      isInvalid={touched.regDateEnd && errors.regDateEnd}
                      {...getFieldProps('regDateEnd')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.regDateEnd}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg>
                  <Form.Group controlId="compDate">
                    <Form.Label>대회 개최일</Form.Label>
                    <Form.Control
                      type="date"
                      min={values.regDateEnd}
                      disabled={!values.regDateEnd}
                      isInvalid={touched.date && errors.date}
                      {...getFieldProps('date')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.date}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
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
                  <Thumb file={this.state.poster} width={400} />
                  {/* TODO: ButtonGroup으로 묶어버리기 */}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      this.posterFileInput.current.click();
                    }}
                    className={
                      'align-bottom mt-2' + (this.state.poster ? ' ml-2' : '')
                    }
                  >
                    파일 선택
                  </Button>
                  <Button
                    variant="danger"
                    className={
                      'align-bottom mt-2 ml-2' +
                      (this.state.poster ? '' : ' d-none')
                    }
                    onClick={() => {
                      this.setState({ poster: null });
                    }}
                  >
                    파일 삭제
                  </Button>
                </div>
              </Form.Group>
              <hr />
              <Button className="mr-2" type="submit">
                개설
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
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default CompMakingForm;

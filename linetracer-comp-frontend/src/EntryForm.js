import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class EntryForm extends React.Component {
	constructor(props) {
		super(props);
		
		this.number = props.number;
	}

	render() {
		return (
			<Form>
				<h2>인적 사항</h2>
				<Form.Group controlId="formName">
					<Form.Label>이름</Form.Label>
					<Form.Control type="name" placeholder="" />
				</Form.Group>
				<Form.Group controlId="formEmail">
					<Form.Label>이메일</Form.Label>
					<Form.Control type="email" placeholder="" />
					<Form.Text className="text-muted">
						이메일은 대회의 안내 사항을 전하는데 사용됩니다.
					</Form.Text>
				</Form.Group>
				<h2>로봇 정보</h2>
				<Form.Group controlId="formCPU">
					<Form.Label>CPU</Form.Label>
					<Form.Control type="text" placeholder="CPU 모델명을 입력해주세요." />
				</Form.Group>
				<Form.Group controlId="formROM">
					<Form.Label>롬(ROM)</Form.Label>
					<Form.Control type="text" placeholder="" />
				</Form.Group>
				<Form.Group controlId="formRAM">
					<Form.Label>램(RAM)</Form.Label>
					<Form.Control type="text" placeholder="" />
				</Form.Group>
				<Form.Group controlId="formMotorDriver">
					<Form.Label>모터 드라이버</Form.Label>
					<Form.Control type="text" placeholder="" />
				</Form.Group>
				<Form.Group controlId="formADC">
					<Form.Label>ADC</Form.Label>
					<Form.Control type="text" placeholder="" />
				</Form.Group>
				<Form.Group controlId="formSensor">
					<Form.Label>센서</Form.Label>
					<Form.Control type="text" placeholder="" />
				</Form.Group>
				<Button variant="primary" type="submit">제출</Button>
			</Form>
		);
	}
}

export default EntryForm;
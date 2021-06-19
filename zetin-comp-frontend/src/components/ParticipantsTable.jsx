import React from 'react';
import Table from 'react-bootstrap/Table';

class ParticipantsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      data: {}
    };
  }

  componentDidMount() {
    // https://reactjs.org/docs/faq-ajax.html
    fetch("https://linetracer-comp-api.run.goorm.io/data")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          data: result
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        })
      }
    );
  }
    
  render() {
    const { error, isLoaded, data } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading ...</div>;
    } else {
      const participants = data.participants.map((p) =>
        <tr>
          <td>{p.order}</td>
          <td>{p.name}</td>
          <td>{p.group}</td>
          <td>{p.robotName}</td>
        </tr>
      );
      
      return (
        <div>
          <h2>{data.compName}</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>소속</th>
                <th>로봇 이름</th>
              </tr>
            </thead>
            <tbody>
              {participants}
            </tbody>
          </Table>
        </div>
      );
    }
  }
}

export default ParticipantsTable;
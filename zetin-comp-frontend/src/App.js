import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import MarkdownIt from 'markdown-it';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';

import LinetracerCompEntryForm from './forms/entry/LinetracerCompEntryForm';

// import sample data
import getLinetracerCompSampleData from './samples/linetracer';

function App() {
  return (
    <Router>
      <Container>
        <Navbar expand="lg">
          <Navbar.Brand href="/">ZETIN Competition</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link className="nav-link" to="/">홈</Link>
              <Link className="nav-link" to="/entry">참가</Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        
        <Switch>
          <Route path="/entry">
            <LinetracerCompEntryForm />
          </Route>
          
          <Route path="/">
            <Home />
            <ParticipantsTable data={getLinetracerCompSampleData()} />
          </Route>
        </Switch>
        
      </Container>
    </Router>
  );
}

function Home() {
  let md = new MarkdownIt();
  let result = md.render('**Enjoy the ZETIN linetracer competition!**');
  
  return (
    <div dangerouslySetInnerHTML={{__html: result}}></div>
  );
}

function ParticipantsTable(props) {
  const participants = props.data.participants.map((p) =>
    <tr>
      <td>{p.order}</td>
      <td>{p.name}</td>
      <td>{p.group}</td>
      <td>{p.robotName}</td>
    </tr>
  );

  console.log(participants)

  return (
    <div>
      <h2>{props.data.compName}</h2>
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

export default App;
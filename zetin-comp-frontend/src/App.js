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

import LinetracerCompEntryForm from './forms/entry/LinetracerCompEntryForm';
import ParticipantsTable from './components/ParticipantsTable';

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
            <ParticipantsTable />
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

export default App;
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import LinetracerCompEntryForm from './forms/entry/LinetracerCompEntryForm';
import CompMakingForm from './forms/CompMakingForm/CompMakingForm';
import ParticipantsTable from './components/ParticipantsTable';

import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Container>
        <Navbar expand="md">
          <Navbar.Brand as={Link} to="/">
            ZETIN Competition
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link className="nav-link" to="/">
                홈
              </Link>
              <Link className="nav-link" to="/makecomp">
                대회 페이지 개설
              </Link>
              <Link className="nav-link" to="/participants">
                참가자
              </Link>
              <Link className="nav-link" to="/entry">
                참가
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/entry">
            <LinetracerCompEntryForm />
          </Route>
          <Route path="/participants">
            <ParticipantsTable />
          </Route>
          <Route path="/makecomp">
            <h2 className="my-4 text-center">대회 페이지 개설</h2>
            <CompMakingForm />
          </Route>
          <Route path="/">
            <Home title="Competitions" />
          </Route>
        </Switch>

        <footer className="mt-5"></footer>
      </Container>
    </Router>
  );
}

export default App;

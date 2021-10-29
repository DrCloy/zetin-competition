import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import Home from './pages/Home';
import Competition from './pages/Competition';
import CompetitionEdit from './pages/CompetitionEdit';
import Rule from './pages/Rule';
import Entry from './pages/Entry';

function App() {
  return (
    <Router>
      <Container>
        <Navbar expand="md">
          <Navbar.Brand as={Link} to="/">
            ZETIN Competition
          </Navbar.Brand>
        </Navbar>

        <Switch>
          <Route
            path={['/competitions/edit/:id', '/competitions/edit']}
            component={CompetitionEdit}
          />
          <Route path="/competitions/:id" component={Competition} />
          <Route path={['/entry/:competitionId']} component={Entry} />
          <Route path="/makerule" component={Rule}></Route>
          <Route path="/">
            <Home />
            <footer className="mt-5">
              <Link className="nav-link" to="/competitions/edit">
                대회 페이지 개설
              </Link>
              <Link className="nav-link" to="/makerule">
                대회 규정 만들기
              </Link>
            </footer>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;

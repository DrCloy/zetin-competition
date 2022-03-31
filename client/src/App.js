import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

import Admin from './pages/Admin';
import Competition from './pages/Competition';
import CompetitionEdit from './pages/CompetitionEdit';
import Rule from './pages/Rule';
import Entry from './pages/Entry';
import Participant from './pages/Participant';

function App() {
  return (
    <Router>
      <Switch>
        <Route
          path={['/competitions/edit/:id', '/competitions/edit']}
          component={CompetitionEdit}
        />
        <Route path="/competitions/:id" component={Competition} />
        <Route path={['/entry/:competitionId']} component={Entry} />
        <Route path="/participants/:competitionId" component={Participant} />
        <Route path="/makerule" component={Rule} />
        <Route path="/admin" component={Admin}></Route>
      </Switch>
    </Router>
  );
}

export default App;

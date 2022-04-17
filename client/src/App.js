import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Admin from './pages/Admin';
import Competition from './pages/Competition';
import Rule from './pages/Rule';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/competitions/:id" component={Competition} />
        <Route path="/makerule" component={Rule} />
        <Route path="/admin" component={Admin} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;

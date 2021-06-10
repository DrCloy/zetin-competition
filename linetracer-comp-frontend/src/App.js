import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import LinetracerCompEntryForm from './forms/entry/LinetracerCompEntryForm';

function App() {
	return (
		<Router>
			<Container>
				<Navbar bg="light" expand="lg">
					<Navbar.Brand href="/">ZETIN Competition</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<Link className="nav-link" to="/">Home</Link>
							<Link className="nav-link" to="/entry">Entry</Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				
				<Switch>
					<Route path="/entry">
						<LinetracerCompEntryForm />
					</Route>
					
					<Route path="/">
						<Home />
					</Route>
				</Switch>
				
			</Container>
    </Router>
	);
}

function Home() {
	return (
		<h1>Welcome to ZETIN Competition Page</h1>
	);
}

export default App;
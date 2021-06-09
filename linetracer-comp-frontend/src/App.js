import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

import EntryForm from './EntryForm'

function App() {
	return (
		<Container>
			<h1>Linetracer Competition Page</h1>
			<EntryForm />
		</Container>
	);
}

export default App;
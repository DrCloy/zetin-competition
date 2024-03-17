import { Outlet, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Link to="/admin" className="d-block">
        관리자 페이지
      </Link>
      <Link to="/competitions" className="d-block">
        대회 페이지
      </Link>
      <Outlet />
    </div>
  );
}

export default App;

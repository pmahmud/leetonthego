import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Problem from './pages/Problem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem/:problemNumber" element={<Problem />} />
      </Routes>
    </Router>
  );
}

export default App;
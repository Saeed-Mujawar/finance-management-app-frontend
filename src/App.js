import React from 'react';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 


const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    </Router>
)

export default App;

/* Import Dependencies */
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

/* Import Routes */
import AppRoutes from 'app/Routes';

/* Import Styles */
import './App.css';


/**
 * Function to render the application body and its routes
 * @returns JSX component
 */
const App = () => {
  return (
    <div className="h-100 w-100">
      <Router>
        <Routes>
          {AppRoutes}
        </Routes>
      </Router>
    </div>
  );
};

export default App;

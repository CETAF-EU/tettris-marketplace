/* Import Dependencies */
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

/* Import Store */
import { setupStore } from './app/Store';

/* Import Styles */
import '@mdxeditor/editor/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";

/* Import Components */
import App from './App';


/**
 * Function for rendering the root of the application
 */
const RenderRoot = () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <Provider store={setupStore()}>
      <App />
    </Provider>
  );
};

RenderRoot();
/* Import Dependencies */
import { Route } from "react-router-dom";

/* Import Components */
import Home from "./Home";
import Dev from "components/general/devPage/dev";


/* Routes associated with the Home page */
const routes = [
    <Route key="home" path="/" element={<Home />} />,
    // Redirection to dev page
    import.meta.env.VITE_DEV === 'true' ? '' : <Route key="Expertise" path="/taxonomicExpert" element={<Dev />} />,
    import.meta.env.VITE_DEV === 'true' ? '' : <Route key="Collection" path="/ReferenceCollection" element={<Dev />} />,
];

export default routes;
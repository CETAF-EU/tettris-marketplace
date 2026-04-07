/* Import Dependencies */
import { Route } from "react-router-dom";

/* Import Components */
import Home from "./Home";
import ReferenceCollection from "components/referenceCollection/ReferenceCollection";


/* Routes associated with the Home page */
const routes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="Collection" path="/referenceCollection" element={<ReferenceCollection />} />,
];

export default routes;
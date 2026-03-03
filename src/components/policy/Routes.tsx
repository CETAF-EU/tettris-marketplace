/* Import Dependencies */
import { Route } from "react-router-dom";

/* Import Components */
import Policy from "./Policy";

/* Routes associated with the policy page */
const routes = [
    <Route key="policy" path="/policy" element={<Policy />} />
];

export default routes;

/* Import Dependencies */
import { Route } from "react-router-dom";

/* Import Components */
import TaxonomicForm from "components/general/FormComponents/TaxonomicForm";
import TaxonomicExpert from "./TaxonomicExpert";


/* Routes associated with the Expertise page */
const routes = [
    <Route key="taxonomicExpert" path="/te/:prefix/:suffix" element={<TaxonomicExpert />} />,
    <Route key="TaxonomicForm" path="/te/registerYourExpertise" element={<TaxonomicForm />} />
];

export default routes;
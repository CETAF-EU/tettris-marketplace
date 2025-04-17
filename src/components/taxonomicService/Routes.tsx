/* Import Dependencies */
import { Route } from "react-router-dom";

/* Import Components */
import TaxonomicService from "./TaxonomicService";
import TaxonomicForm from "components/general/FormComponents/TaxonomicForm";


/* Routes associated with the Taxonomic Service page */
const routes = [
    <Route key="taxonomicService" path="/ts/:prefix/:suffix" element={<TaxonomicService />} />,
    <Route key="TaxonomicForm" path="/ts/suggestNewTaxonomicService" element={<TaxonomicForm />} />
];

export default routes;
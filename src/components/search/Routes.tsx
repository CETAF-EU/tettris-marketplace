/* Import Dependencies */
import { Route } from "react-router-dom";

/* Import Components */
import Search from "./Search";
import PollinatorCollections from "../pollinatorCollections/PollinatorCollections";


/* Routes associated with the Search page */
const routes = [
    <Route key="search" path="/search" element={<Search />} />,
    <Route key="pollinatorCollections" path="/pollinator-collections" element={<PollinatorCollections />} />
];

export default routes;

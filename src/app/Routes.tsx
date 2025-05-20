/* Import Dependencies */
import { Route } from 'react-router-dom';

/* Import Routes */
import HomeRoutes from 'components/home/Routes';
import NotFound404 from 'components/general/NotFound404/NotFound404';
import SearchRoutes from 'components/search/Routes';
import SupportRoutes from 'components/support/Routes';
import TaxonomicServiceRoutes from 'components/taxonomicService/Routes';
import TaxonomicExpertRoutes from 'components/taxonomicExpert/Routes';

/* Routes for application */
const AppRoutes: JSX.Element[] = [
    ...(HomeRoutes as JSX.Element[]),
    ...(SearchRoutes as JSX.Element[]),
    ...(SupportRoutes as JSX.Element[]),
    ...(TaxonomicServiceRoutes as JSX.Element[]),
    ...(TaxonomicExpertRoutes as JSX.Element[]),
    <Route key="404" path="*" element={<NotFound404 />} />
];


export default AppRoutes;
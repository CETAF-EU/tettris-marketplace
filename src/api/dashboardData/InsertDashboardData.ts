/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { DashboardData, CordraResult, Dict } from 'app/Types';

/**
 * Function that sends a POST request to the API in order to insert a new dashboard data
 * @param DashboardData The data to insert
 * @returns An instance of Taxonomic Service or undefined
 */
const InsertDashboardData = async ({ DashboardDataRecord }: { DashboardDataRecord?: Dict }) => {
    let dashboardData: DashboardData | undefined;

    if (DashboardDataRecord) {
        try {
            const result = await axios({
                method: 'post',
                url: '/Op.Create',
                params: {
                    targetId: 'service'
                },
                data: DashboardDataRecord,
                headers: {
                    'Content-type': 'application/json'
                }, 
                auth: {
                    username: 'TaxonomicMarketplace',
                    password: import.meta.env.VITE_CORDRA_PASSWORD
                },
                responseType: 'json'
            });

            /* Get result data from JSON */
            const data: CordraResult = result.data;

            /* Set data */
            dashboardData = data.attributes.content as DashboardData;
            
            /* Set created and modified */
            dashboardData.dashboardData['schema:dateCreated'] = format(new Date(data.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            dashboardData.dashboardData['schema:dateModified'] = format(new Date(data.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

        } catch (error) {
            console.error(error);

            throw (error);
        };
    };

    return dashboardData;
}

export default InsertDashboardData;
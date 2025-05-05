/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { DashboardData, CordraResult, Dict } from 'app/Types';

/**
 * Function that sends a POST request to the API in order to insert a new taxonomic expert
 * @param DashboardData The taxonomic expert to insert
 * @returns An instance of Taxonomic Service or undefined
 */
const InsertDashboardData = async ({ DashboardDataRecord }: { DashboardDataRecord?: Dict }) => {
    let DashboardData: DashboardData | undefined;

    if (DashboardDataRecord) {
        /* Craft taxonomic expert object */
        const newDashboardData = {
            type: 'DashboardData',
            attributes: {
                content: {
                    DashboardData: {
                        "@type": 'DashboardData',
                        ...DashboardDataRecord
                    }
                }
            }
        };

        try {
            const result = await axios({
                method: 'post',
                url: '/Op.Create',
                params: {
                    targetId: 'service'
                },
                data: newDashboardData,
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

            /* Set Taxonomic Expert */
            DashboardData = data.attributes.content as DashboardData;
            
            /* Set created and modified */
            DashboardData.DashboardData['schema:dateCreated'] = format(new Date(data.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            DashboardData.DashboardData['schema:dateModified'] = format(new Date(data.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

        } catch (error) {
            console.error(error);

            throw (error);
        };
    };

    return DashboardData;
}

export default InsertDashboardData;
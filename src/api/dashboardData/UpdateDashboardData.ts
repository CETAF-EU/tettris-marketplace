/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { DashboardData, CordraResult, Dict } from 'app/Types';

/**
 * Function that sends a POST request to the API in order to update existing dashboard data
 * @param id Cordra ID of the dashboard data to update
 * @param DashboardDataRecord The fields to update
 * @returns Updated instance of DashboardData or undefined
 */
const UpdateDashboardData = async ({ id, DashboardDataRecord }: { id: string; DashboardDataRecord?: Dict; }): Promise<DashboardData | undefined> => {
    let dashboardData: DashboardData | undefined;

    if (!id || !DashboardDataRecord) return;

    try {
        const payload = {
            id: id,
            type: 'DashboardData',
            attributes: {
                content: {
                    dashboardData: {
                        "@type": 'DashboardData',
                        ...DashboardDataRecord
                    }
                }
            }
        };

        const result = await axios({
            method: 'post',
            url: '/Op.Update',
            params: {
                targetId: 'service'
            },
            data: payload,
            headers: {
                'Content-type': 'application/json'
            },
            auth: {
                username: 'TaxonomicMarketplace',
                password: import.meta.env.VITE_CORDRA_PASSWORD
            },
            responseType: 'json'
        });

        const data: CordraResult = result.data;

        dashboardData = data.attributes.content as DashboardData;

        // Timestamps
        dashboardData.dashboardData['schema:dateModified'] = format(
            new Date(data.attributes.metadata.modifiedOn),
            "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        );

    } catch (error) {
        console.error('UpdateDashboardData error:', error);
        throw error;
    }

    return dashboardData;
};

export default UpdateDashboardData;

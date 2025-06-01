/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicExpert, CordraResult, Dict } from 'app/Types';
import InsertDashboardData from 'api/dashboardData/InsertDashboardData';
import SendEmail from 'api/email/SendEmail';

/**
 * Function to update an existing taxonomic expert object in Cordra.
 * @param id The Cordra ID of the taxonomic expert.
 * @param updatedData The updated fields to merge into the taxonomic expert.
 * @returns The updated TaxonomicExpert or undefined.
 */
const UpdateTaxonomicExpert = async ({ id, updatedData }: { id: string; updatedData: Dict;}): Promise<TaxonomicExpert | undefined> => {
    let updatedExpert: TaxonomicExpert | undefined;

    if (!id || !updatedData) return;

    /* Prepare object for update */
    const updatePayload = {
        id: id,
        type: 'TaxonomicExpert',
        attributes: {
            content: {
                taxonomicExpert: {
                    "@type": 'TaxonomicExpert',
                    "schema:status": 'proposed',
                    ...updatedData
                }
            }
        }
    };

    try {
        const result = await axios({
            method: 'post',
            url: '/Op.Update',
            params: {
                targetId: 'service'
            },
            data: updatePayload,
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
        updatedExpert = data.attributes.content as TaxonomicExpert;

        // Timestamps
        updatedExpert.taxonomicExpert['schema:dateModified'] = format(
            new Date(data.attributes.metadata.modifiedOn),
            "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        );

        // Update dashboard data
        const updatedDashboardData = {
            type: 'DashboardData',
            attributes: {
                content: {
                    dashboardData: {
                        "@type": 'DashboardData',
                        "schema:reference": updatedExpert.taxonomicExpert['@id'],
                        "schema:gender": updatedExpert.taxonomicExpert['schema:person']?.['schema:gender'],
                        "schema:age": updatedExpert.taxonomicExpert['schema:person']?.['schema:birthDate']
                    }
                }
            }
        };
        await InsertDashboardData({ DashboardDataRecord: updatedDashboardData });

        /* Send email */
        const url = "https://marketplace.cetaf.org/cordra/#objects/" + updatedExpert.taxonomicExpert['@id'];
        const name = updatedExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] ?? "Taxonomic Expert";
        SendEmail(name, url);

    } catch (error) {
        console.error('UpdateTaxonomicExpert error:', error);
        throw error;
    }

    return updatedExpert;
};

export default UpdateTaxonomicExpert;

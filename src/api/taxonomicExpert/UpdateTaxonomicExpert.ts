/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicExpert, Dict } from 'app/Types';
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

    const taxonomicExpertRecord = {
        'schema:status': 'proposed',
        ...updatedData,
    };

    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/cordra/experts/${encodeURIComponent(id)}`,
            {
                taxonomic_expert_record: taxonomicExpertRecord,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
                },
            }
        );

        const data: Dict = response.data;
        updatedExpert = (
            data.taxonomicExpert ??
            data.taxonomic_expert ??
            data.attributes?.content
        ) as TaxonomicExpert;

        if (!updatedExpert?.taxonomicExpert) {
            throw new Error('Failed to update taxonomic expert record.');
        }

        const metadata = data.metadata ?? data.attributes?.metadata;

        // Timestamps
        if (metadata?.modifiedOn) {
            updatedExpert.taxonomicExpert['schema:dateModified'] = format(
                new Date(metadata.modifiedOn),
                "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            );
        }

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

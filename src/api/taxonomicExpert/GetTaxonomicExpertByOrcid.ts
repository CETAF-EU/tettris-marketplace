/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicExpert, CordraResultArray, Dict } from 'app/Types';

/* Import Sources */

/**
 * Function that fetches the latest taxonomic services from the API
 * @param pageNumber The number of the current page of records
 * @returns An array of Taxonomic Service instances or an empty array
 */
const GetTaxonomicExpertByOrcid = async ({ orcidId }: { orcidId?: string }) => {
    /* Base variables */
    let taxonomicExperts: TaxonomicExpert[] = [];

    /* Filter for the object type to be a taxonomic expert */
    let filters: string = ''
    filters = filters.concat('/taxonomicExpert/@type:TaxonomicExpert');
    /* Filter for retreive the orcid */
    if (orcidId) {
        filters = filters.concat(String.raw` AND /taxonomicExpert/schema\:person/schema\:orcid:"${orcidId}"`);
    }

    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
            params: {
                query: filters
            },
            headers: {
                'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
            },
        });

        const data: Dict = response.data;

        if (Array.isArray(data.taxonomicExperts)) {
            taxonomicExperts = data.taxonomicExperts as TaxonomicExpert[];
        } else if (Array.isArray(data.taxonomic_experts)) {
            taxonomicExperts = data.taxonomic_experts as TaxonomicExpert[];
        } else {
            const fallbackData: CordraResultArray = data as CordraResultArray;

            fallbackData.results?.forEach((dataFragment) => {
                const taxonomicExpert = dataFragment.attributes.content as TaxonomicExpert;

                taxonomicExpert.taxonomicExpert['schema:dateCreated'] = format(new Date(dataFragment.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
                taxonomicExpert.taxonomicExpert['schema:dateModified'] = format(new Date(dataFragment.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

                taxonomicExperts.push(taxonomicExpert);
            });
        }
    } catch (error) {
        console.error(error);

        throw (error);
    };

    return taxonomicExperts;
}

export default GetTaxonomicExpertByOrcid;
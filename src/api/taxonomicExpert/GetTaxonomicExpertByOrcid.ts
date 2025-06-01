/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicExpert, CordraResultArray } from 'app/Types';

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
        filters = filters.concat(` AND /taxonomicExpert/schema\\:person/schema\\:orcid:"${orcidId}"`);
    }
    try {
        const result = await axios({
            method: 'get',
            url: `/Op.Search`,
            params: {
                targetId: 'service',
                query: filters
            },
            auth: {
                username: 'TaxonomicMarketplace',
                password: import.meta.env.VITE_CORDRA_PASSWORD
            },
            responseType: 'json'
        });
        /* Get result data from JSON */
        const data: CordraResultArray = result.data;

        /* Set Taxonomic Expert */
        data.results.forEach((dataFragment) => {
            const taxonomicExpert = dataFragment.attributes.content as TaxonomicExpert;

            /* Set created and modified */
            taxonomicExpert.taxonomicExpert['schema:dateCreated'] = format(new Date(dataFragment.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            taxonomicExpert.taxonomicExpert['schema:dateModified'] = format(new Date(dataFragment.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

            /* Push to taxonomic services array */
            taxonomicExperts.push(taxonomicExpert);
        });
    } catch (error) {
        console.error(error);

        throw (error);
    };
    console.log('taxonomicExperts', taxonomicExperts);
    return taxonomicExperts;
}

export default GetTaxonomicExpertByOrcid;
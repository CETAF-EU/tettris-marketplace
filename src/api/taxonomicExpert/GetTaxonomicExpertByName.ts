/* Import Dependencies */
import axios from 'axios';

/* Import Types */
import { TaxonomicExpert } from 'app/Types';
import { Slugify } from 'app/Utilities';


/**
 * Function that fetches a taxonomic expert from the API by providing a slugged name
 * @param name The slugged name segment from URL
 * @returns An instance of Taxonomic Expert
 */
const GetTaxonomicExpertByName = async ({ name }: { name?: string }) => {
    if (!name) {
        throw (new Error('Missing taxonomic expert name in URL', { cause: 400 }));
    }

    const decodedName = decodeURIComponent(name).replaceAll('-', ' ').trim();
    const escapedName = decodedName.replaceAll(/([*?\\:"])/g, String.raw`\$1`);
    let filters = '/taxonomicExpert/@type:TaxonomicExpert';
    filters += String.raw` AND /taxonomicExpert/schema\:status:accepted`;
    filters += String.raw` AND ((/taxonomicExpert/schema\:person/schema\:name:${escapedName}*) OR ` +
        String.raw`(/taxonomicExpert/schema\:person/schema\:name:${escapedName}~5))`;

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
        params: {
            pageNumber: 1,
            pageSize: 25,
            query: filters,
        },
        headers: {
            'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
        },
    });

    const experts = response.data.taxonomicExperts as TaxonomicExpert[];

    if (!Array.isArray(experts) || experts.length === 0) {
        throw (new Error('Taxonomic expert not found', { cause: 404 }));
    }

    const exactMatch = experts.find((expert) => {
        const expertName = expert.taxonomicExpert?.['schema:person']?.['schema:name'];
        return !!expertName && Slugify(expertName) === Slugify(decodedName);
    });

    return exactMatch ?? experts[0];
}

export default GetTaxonomicExpertByName;

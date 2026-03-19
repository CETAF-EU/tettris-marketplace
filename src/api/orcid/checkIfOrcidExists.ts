import axios from 'axios';
import { TaxonomicExpert, CordraResultArray } from 'app/Types';
/**
 * Checks if an expert with the given ORCID already exists.
 * @param orcid - The ORCID to check.
 * @returns Existing expert if found, otherwise null.
 */
const checkIfOrcidExists = async (orcid: string): Promise<TaxonomicExpert | null> => {

    console.log('Checking if orcid exists:', orcid);

    let taxonomicExperts: TaxonomicExpert[] = [];
    const filters = String.raw`/taxonomicExpert/@type:TaxonomicExpert AND (/taxonomicExpert/schema\:person/schema\:orcid:"${orcid}")`;
    
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
            params: {
                query: filters,
                size: 1
            },
            headers: {
                'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
            }
        });

        const data = response.data as {
            taxonomicExperts?: TaxonomicExpert[];
            taxonomic_experts?: TaxonomicExpert[];
        } & Partial<CordraResultArray>;

        if (Array.isArray(data.taxonomicExperts)) {
            taxonomicExperts = data.taxonomicExperts;
        } else if (Array.isArray(data.taxonomic_experts)) {
            taxonomicExperts = data.taxonomic_experts;
        } else if (Array.isArray(data.results)) {
            data.results.forEach((dataFragment) => {
                const taxonomicExpert = dataFragment.attributes.content as TaxonomicExpert;
                taxonomicExperts.push(taxonomicExpert);
            });
        }

        const normalizedOrcid = orcid.trim().toUpperCase();
        const existingExpert = taxonomicExperts.find((expert) => {
            const expertOrcid = expert?.taxonomicExpert?.['schema:person']?.['schema:orcid'];
            return typeof expertOrcid === 'string' && expertOrcid.trim().toUpperCase() === normalizedOrcid;
        }) || null;

        if (existingExpert) {
            console.log('Orcid exists:', existingExpert.taxonomicExpert?.['schema:person']?.['schema:orcid']);
            return existingExpert;
        }

        console.log('Orcid does not match:', orcid);
        return null;
    } catch (error) {
        console.error('Orcid existence check failed:', error);
        return null;
    }
};

export default checkIfOrcidExists;

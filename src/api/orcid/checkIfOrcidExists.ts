import axios from 'axios';
import { TaxonomicExpert, CordraResultArray } from 'app/Types';
/**
 * Checks if an expert with the given email already exists.
 * @param email - The email to check.
 * @returns True if the email exists, false otherwise.
 */
const checkIfOrcidExists = async (orcid: string): Promise<TaxonomicExpert | null> => {

    console.log('Checking if orcid exists:', orcid);

    let taxonomicExperts: TaxonomicExpert[] = [];
    const filters = `/taxonomicExpert/@type:TaxonomicExpert AND (/taxonomicExpert/schema\\:person/schema\\:orcid:"${orcid}")`;
    
    try {
        const response = await axios.get('/Op.Search', {
            params: {
                targetId: 'service',
                query: filters,
                size: 1
            },
            auth: {
                username: 'TaxonomicMarketplace',
                password: import.meta.env.VITE_CORDRA_PASSWORD
            }
        });

        const data: CordraResultArray = response.data;
        /* Set Taxonomic Expert */
        data.results.forEach((dataFragment) => {
            const taxonomicExpert = dataFragment.attributes.content as TaxonomicExpert;        
            /* Push to taxonomic services array */
            taxonomicExperts.push(taxonomicExpert);
        });

        const orcidExist = taxonomicExperts[0].taxonomicExpert?.['schema:person']?.['schema:orcid'] as string || null;
        console.log('Orcid existence check result:', orcidExist)
        if (orcidExist === orcid)
        {
            console.log('Orcid exists:', orcidExist);
            return taxonomicExperts[0];
        }
        console.log('Orcid does not match:', orcid);
        return null;
    } catch (error) {
        console.error('Orcid existence check failed:', error);
        return null;
    }
};

export default checkIfOrcidExists;

import axios from 'axios';
import { TaxonomicExpert, CordraResultArray } from 'app/Types';
/**
 * Checks if an expert with the given email already exists.
 * @param email - The email to check.
 * @returns Existing expert if found, otherwise null.
 */
const checkIfEmailExists = async (email: string): Promise<TaxonomicExpert | null> => {

    console.log('Checking if email exists:', email);

    let taxonomicExperts: TaxonomicExpert[] = [];
    const filters = String.raw`/taxonomicExpert/@type:TaxonomicExpert AND (/taxonomicExpert/schema\:person/schema\:email:"${email}")`;
    
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
            params: {
                size:1,
                query: filters,
            },
            headers: {
                'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
            },
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

        const normalizedEmail = email.trim().toLowerCase();
        const existingExpert = taxonomicExperts.find((expert) => {
            const expertEmail = expert?.taxonomicExpert?.['schema:person']?.['schema:email'];
            return typeof expertEmail === 'string' && expertEmail.trim().toLowerCase() === normalizedEmail;
        }) || null;

        if (existingExpert) {
            console.log('Email exists:', existingExpert.taxonomicExpert?.['schema:person']?.['schema:email']);
            return existingExpert;
        }

        console.log('Email does not match:', email);
        return null;
    } catch (error) {
        console.error('Email existence check failed:', error);
        return null;
    }
};

export default checkIfEmailExists;

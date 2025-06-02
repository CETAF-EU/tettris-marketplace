import axios from 'axios';
import { TaxonomicExpert, CordraResultArray } from 'app/Types';
/**
 * Checks if an expert with the given email already exists.
 * @param email - The email to check.
 * @returns True if the email exists, false otherwise.
 */
const checkIfEmailExists = async (email: string, password?: string): Promise<TaxonomicExpert | boolean> => {

    console.log('Checking if email exists:', email);

    let taxonomicExperts: TaxonomicExpert[] = [];
    const filters = `/taxonomicExpert/@type:TaxonomicExpert AND (/taxonomicExpert/schema\\:person/schema\\:email:"${email}")`;
    
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

        const emailExist = taxonomicExperts[0].taxonomicExpert?.['schema:person']?.['schema:email'] as string || null;
        if (emailExist === email)
        {
            console.log('Email exists:', emailExist);
            if (password !== undefined) {
                return true;
            }
        }
        else {
            console.log('Email does not match:', emailExist);
            return false;
        }
        // const passwpordExist = taxonomicExperts[0].taxonomicExpert?.['schema:person']?.['schema:password'] as string || null;
        // if (password && passwpordExist === password) {
        //     console.log('Password matches for email:', email);
        //     return true;
        // }
        // console.log('Password does not match for email:', email);
        return true;
    } catch (error) {
        console.error('Email existence check failed:', error);
        return false;
    }
};

export default checkIfEmailExists;

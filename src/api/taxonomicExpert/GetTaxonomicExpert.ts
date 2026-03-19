/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicExpert, Dict } from 'app/Types';


/**
 * Function that fetches a taxonomic service from the API by providing a taxonomic service identifier
 * @param handle The handle identifier of the requested taxonomic service
 * @returns An instance of Taxonomic Service or undefined
 */
const GetTaxonomicExpert = async ({ handle }: { handle?: string }) => {
    let taxonomicExpert: TaxonomicExpert | undefined;

    if (handle) {
        const taxonomicExpertID: string = handle.replace(import.meta.env.VITE_HANDLE_URL as string, '');

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/cordra/experts/${encodeURIComponent(taxonomicExpertID)}`,
                {
                    headers: {
                        'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
                    },
                }
            );

            const data: Dict = response.data;
            taxonomicExpert = (
                data.taxonomicExpert ??
                data.taxonomic_expert ??
                data.attributes?.content
            ) as TaxonomicExpert;

            const metadata = data.metadata ?? data.attributes?.metadata;

            if (metadata?.createdOn && taxonomicExpert?.taxonomicExpert) {
                taxonomicExpert.taxonomicExpert['schema:dateCreated'] = format(new Date(metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            }

            if (metadata?.modifiedOn && taxonomicExpert?.taxonomicExpert) {
                taxonomicExpert.taxonomicExpert['schema:dateModified'] = format(new Date(metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            }
        } catch (error) {
            console.error(error);

            throw (error);
        }
    };

    return taxonomicExpert;
}

export default GetTaxonomicExpert;
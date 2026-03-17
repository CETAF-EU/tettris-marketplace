/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicService, Dict } from 'app/Types';


/**
 * Function that fetches a taxonomic service from the API by providing a taxonomic service identifier
 * @param handle The handle identifier of the requested taxonomic service
 * @returns An instance of Taxonomic Service or undefined
 */
const GetTaxonomicService = async ({ handle }: { handle?: string }) => {
    let taxonomicService: TaxonomicService | undefined;

    if (handle) {
        const taxonomicServiceID: string = handle.replace(import.meta.env.VITE_HANDLE_URL as string, '');

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/cordra/services/${encodeURIComponent(taxonomicServiceID)}`,
                {
                    headers: {
                        'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
                    },
                }
            );

            const data: Dict = response.data;
            taxonomicService = (
                data.taxonomicService ??
                data.taxonomic_service ??
                data.attributes?.content
            ) as TaxonomicService;

            /* Check if Taxonomic Service is published, otherwise throw error */
            if (taxonomicService.taxonomicService['schema:status'] !== 'accepted') {
                throw (new Error('This Taxonomic Service has not been published yet', { cause: 200 }));
            };

            const metadata = data.metadata ?? data.attributes?.metadata;

            if (metadata?.createdOn) {
                taxonomicService.taxonomicService['schema:dateCreated'] = format(new Date(metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            }

            if (metadata?.modifiedOn) {
                taxonomicService.taxonomicService['schema:dateModified'] = format(new Date(metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            }
        } catch (error) {
            console.error(error);

            throw (error);
        }
    };

    return taxonomicService;
}

export default GetTaxonomicService;
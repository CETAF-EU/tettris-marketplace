/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicService, Dict } from 'app/Types';
import SendEmail from 'api/email/SendEmail';


/**
 * Function that sends a POST request to the API in order to insert a new taxonomic service
 * @param taxonomicService The taxonomic service to insert
 * @returns An instance of Taxonomic Service or undefined
 */
const InsertTaxonomicService = async ({ taxonomicServiceRecord }: { taxonomicServiceRecord?: Dict }) => {
    let taxonomicService: TaxonomicService | undefined;

    if (taxonomicServiceRecord) {
        const normalizedTaxonomicServiceRecord = {
            'schema:status': 'proposed',
            'schema:ratingValue': 0,
            ...taxonomicServiceRecord,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/cordra/services`,
                {
                    taxonomic_service_record: normalizedTaxonomicServiceRecord,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
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

            const metadata = data.metadata ?? data.attributes?.metadata;

            if (metadata?.createdOn && taxonomicService?.taxonomicService) {
                taxonomicService.taxonomicService['schema:dateCreated'] = format(new Date(metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            }

            if (metadata?.modifiedOn && taxonomicService?.taxonomicService) {
                taxonomicService.taxonomicService['schema:dateModified'] = format(new Date(metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            }

            /* Send email */
            if (taxonomicService?.taxonomicService) {
                const url = "https://marketplace.cetaf.org/cordra/#objects/" + taxonomicService.taxonomicService['@id'];
                const name = taxonomicService.taxonomicService['schema:service']['schema:name'] ? taxonomicService.taxonomicService['schema:service']['schema:name'] : "Taxonomic Service";
                SendEmail(name, url);
            }
        } catch (error) {
            console.error(error);

            throw (error);
        };
    };

    return taxonomicService;
}

export default InsertTaxonomicService;
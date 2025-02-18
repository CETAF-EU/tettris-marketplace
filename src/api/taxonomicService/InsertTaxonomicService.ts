/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicService, CordraResult, Dict } from 'app/Types';
import SendEmail from 'api/email/SendEmail';


/**
 * Function that sends a POST request to the API in order to insert a new taxonomic service
 * @param taxonomicService The taxonomic service to insert
 * @returns An instance of Taxonomic Service or undefined
 */
const InsertTaxonomicService = async ({ taxonomicServiceRecord }: { taxonomicServiceRecord?: Dict }) => {
    let taxonomicService: TaxonomicService | undefined;

    if (taxonomicServiceRecord) {
        /* Craft taxonomic service object */
        const newTaxonomicService = {
            type: 'TaxonomicService',
            attributes: {
                content: {
                    taxonomicService: {
                        "@type": 'TaxonomicService',
                        "schema:status": 'proposed',
                        "schema:ratingValue": 0,
                        ...taxonomicServiceRecord
                    }
                }
            }
        };

        try {
            const result = await axios({
                method: 'post',
                url: '/Op.Create',
                params: {
                    targetId: 'service'
                },
                data: newTaxonomicService,
                headers: {
                    'Content-type': 'application/json'
                },
                auth: {
                    username: 'TaxonomicMarketplace',
                    password: import.meta.env.VITE_CORDRA_PASSWORD
                },
                responseType: 'json'
            });

            /* Get result data from JSON */
            const data: CordraResult = result.data;

            /* Set Taxonomic Service */
            taxonomicService = data.attributes.content as TaxonomicService;

            /* Set created and modified */
            taxonomicService.taxonomicService['schema:dateCreated'] = format(new Date(data.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            taxonomicService.taxonomicService['schema:dateModified'] = format(new Date(data.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

            /* Send email */
            const url = "https://marketplace.cetaf.org/cordra/#objects/" + taxonomicService.taxonomicService['@id'];
            const name = taxonomicService.taxonomicService['schema:service']['schema:name'] ? taxonomicService.taxonomicService['schema:service']['schema:name'] : "Taxonomic Service";
            SendEmail(name, url);
        } catch (error) {
            console.error(error);

            throw (error);
        };
    };

    return taxonomicService;
}

export default InsertTaxonomicService;
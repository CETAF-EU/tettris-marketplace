/* Import Dependencies */
import axios from 'axios';

/* Import Types */
import { TaxonomicExpert, CordraResult, Dict } from 'app/Types';
import SendEmail from 'api/email/SendEmail';

/**
 * Function that sends a POST request to the API in order to insert a new taxonomic expert
 * @param taxonomicExpert The taxonomic expert to insert
 * @returns An instance of Taxonomic Service or undefined
 */
const InsertTaxonomicExpert = async ({ taxonomicExpertRecord }: { taxonomicExpertRecord?: Dict }) => {
    let taxonomicExpert: TaxonomicExpert | undefined;

    if (taxonomicExpertRecord) {
        /* Craft taxonomic expert object */
        const newTaxonomicExpert = {
            type: 'TaxonomicExpert',
            attributes: {
                content: {
                    taxonomicExpert: {
                        "@type": 'TaxonomicExpert',
                        ...taxonomicExpertRecord
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
                data: newTaxonomicExpert,
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

            /* Set Taxonomic Expert */
            taxonomicExpert = data.attributes.content as TaxonomicExpert;

            /* Send email */
            const url = "https://marketplace.cetaf.org/cordra/#objects/" + taxonomicExpert.taxonomicExpert['@id'];
            const name = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] ? taxonomicExpert.taxonomicExpert['schema:person']['schema:name'] : "Taxonomic Expert";
            SendEmail(name, url);

        } catch (error) {
            console.error(error);

            throw (error);
        };
    };

    return taxonomicExpert;
}

export default InsertTaxonomicExpert;
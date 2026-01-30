/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';

/* Import Types */
import { TaxonomicExpert, CordraResult, Dict } from 'app/Types';
import SendEmail from 'api/email/SendEmail';
// import InsertDashboardData from 'api/dashboardData/InsertDashboardData';
import { postImage } from 'api/image/PostImage';
/**
 * Function that sends a POST request to the API in order to insert a new taxonomic expert
 * @param taxonomicExpert The taxonomic expert to insert
 * @returns An instance of Taxonomic Service or undefined
 */
const InsertTaxonomicExpert = async ({ taxonomicExpertRecord }: { taxonomicExpertRecord?: Dict }) => {
    let taxonomicExpert: TaxonomicExpert | undefined;

    if (taxonomicExpertRecord) {
        const imageValue = taxonomicExpertRecord['schema:person']['schema:ProfilePicture'];

        if (imageValue) {
            try {
                const pictureUrl = await postImage(imageValue);
                taxonomicExpertRecord['schema:person']['schema:ProfilePicture'] = pictureUrl.url;
            } catch (error) {
                console.error(error);
                throw (error);
            }
        }
        /* Craft taxonomic expert object */
        const newTaxonomicExpert = {
            type: 'TaxonomicExpert',
            attributes: {
                content: {
                    taxonomicExpert: {
                        "@type": 'TaxonomicExpert',
                        "schema:status": 'proposed',
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
            
            /* Set created and modified */
            taxonomicExpert.taxonomicExpert['schema:dateCreated'] = format(new Date(data.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            taxonomicExpert.taxonomicExpert['schema:dateModified'] = format(new Date(data.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            
            // const newDashboardData = {
            //     type: 'DashboardData',
            //     attributes: {
            //         content: {
            //             dashboardData: {
            //                 "@type": 'DashboardData',
            //                 "schema:reference": taxonomicExpert.taxonomicExpert['@id'],
            //                 "schema:gender": taxonomicExpert.taxonomicExpert['schema:person']?.['schema:gender'],
            //                 "schema:age": taxonomicExpert.taxonomicExpert['schema:person']?.['schema:birthDate'],
            //             }
            //         }
            //     }
            // };
            // /* Dashboard Data */                           
            // await InsertDashboardData({ DashboardDataRecord: newDashboardData });

            /* Send email */
            const url = "https://marketplace.cetaf.org/cordra/#objects/" + taxonomicExpert.taxonomicExpert['@id'];
            const name = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] ?? "Taxonomic Expert";
            SendEmail(name, url);

        } catch (error) {
            console.error(error);

            throw (error);
        };
    };

    return taxonomicExpert;
}

export default InsertTaxonomicExpert;
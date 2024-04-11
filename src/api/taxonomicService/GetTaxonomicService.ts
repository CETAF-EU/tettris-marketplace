/* Import Types */
import { TaxonomicService, JSONResult } from 'app/Types';

/* Import Mock Data */
import AcceptedTaxonomicService from 'sources/mock/TaxonomicServiceAccepted.json';
import SuggestedTaxonomicService from 'sources/mock/TaxonomicServiceSuggested.json';
import ReferenceCollection from 'sources/mock/ReferenceCollection.json';


/**
 * Function that fetches a taxonomic service from the API by providing a taxonomic service identifier
 * @param taxonomicServiceID The identifier of the requested taxonomic service
 * @param version The specific version of the requested taxonomic service
 * @returns An instance of Taxonomic Service or undefined
 */
const GetTaxonomicService = async (handle?: string, _version?: string) => {
    let taxonomicService: TaxonomicService | undefined;

    if (handle) {
        const taxonomicServiceID: string = handle.replace(process.env.REACT_APP_HANDLE_URL as string, '');

        try {
            let result: { data: JSONResult };

            switch (taxonomicServiceID) {
                case 'TEST/SEMKDJE98D7':
                    result = { data: { ...AcceptedTaxonomicService } };

                    break;
                case 'TEST/LOFKDJE98D7':
                    result = { data: { ...SuggestedTaxonomicService } };

                    break;
                case 'TEST/POTKDJE98D7':
                    result = { data: { ...ReferenceCollection } };

                    break;
                default:
                    throw (new Error('No mock data found'));
            }

            /* Get result data from JSON */
            const data: JSONResult = result.data;

            /* Set Taxonomic Service */
            taxonomicService = data.data.attributes as TaxonomicService;
        } catch (error) {
            console.warn(error);
        }
    }

    return taxonomicService;
}

export default GetTaxonomicService;
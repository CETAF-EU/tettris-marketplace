import axios from 'axios';
import { isEmpty } from 'lodash';

/* Import Types */
import { TaxonomicService, Dict } from 'app/Types';

/* Import Sources */
import TaxonomicServiceFilters from 'sources/searchFilters/TaxonomicServiceFilters.json';

const GetTaxonomicServices = async ({
    pageNumber,
    pageSize,
    searchFilters,
}: {
    pageNumber: number;
    pageSize: number;
    searchFilters: { [searchFilter: string]: string };
}) => {
    let filters = '/taxonomicService/@type:TaxonomicService';
    filters += String.raw` AND /taxonomicService/schema\:status:accepted`;

    if (!isEmpty(searchFilters)) {
        Object.entries(searchFilters).forEach(([key, value]) => {
            const alias =
                TaxonomicServiceFilters.taxonomicServiceFilters.find(
                    taxonomicSearchFilter => taxonomicSearchFilter.name === key
                )?.alias;
            const escapedAlias = (alias ?? key).replaceAll(':', String.raw`\:`);

            switch (key) {
                case 'language':
                case 'topicDiscipline':
                    filters += String.raw` AND /taxonomicService/${escapedAlias}/_:${value}`;
                    break;
                case 'query':
                    filters +=
                        ` AND (` +
                        String.raw`/taxonomicService/schema\:service/schema\:name:${value}*` +
                        String.raw` OR /taxonomicService/schema\:taxonomicRange/_:${value}*` +
                        String.raw` OR /taxonomicService/ods\:topicDiscipline/_:${value}*` +
                        `)`;
                    break;
                case 'taxonomicRange':
                    filters += String.raw` AND /taxonomicService/schema\:taxonomicRange/_:${value}*`;
                    break;
                case 'serviceType':
                    filters += String.raw` AND /taxonomicService/schema\:Service/schema\:serviceType:${value}`;
                    break;
                default:
                    filters += String.raw` AND /taxonomicService/${escapedAlias}:${value}`;
            }
        });
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/services`, {
        params: {
            pageNumber,
            pageSize,
            query: filters,
        },
        headers: {
            'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
        },
    });

    return {
        taxonomicServices: response.data.taxonomicServices as TaxonomicService[],
        metadata: response.data.metadata as Dict,
    };
};

export default GetTaxonomicServices;
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
    searchFilters: { [searchFilter: string]: string | string[] };
}) => {
    let filters = '/taxonomicService/@type:TaxonomicService';
    filters += String.raw` AND /taxonomicService/schema\:status:accepted`;

    const appendOrFilter = (clauses: string[]) => {
        if (!clauses.length) return;

        filters += clauses.length === 1
            ? String.raw` AND ${clauses[0]}`
            : ' AND (' + clauses.join(' OR ') + ')';
    };

    if (!isEmpty(searchFilters)) {
        Object.entries(searchFilters).forEach(([key, value]) => {
            const values = (Array.isArray(value) ? value : [value]).filter((item) => !!item);
            if (!values.length) return;

            const alias =
                TaxonomicServiceFilters.taxonomicServiceFilters.find(
                    taxonomicSearchFilter => taxonomicSearchFilter.name === key
                )?.alias;
            const escapedAlias = (alias ?? key).replaceAll(':', String.raw`\:`);

            switch (key) {
                case 'language':
                case 'topicDiscipline':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicService/${escapedAlias}/_:${item}`));
                    break;
                case 'query':
                    {
                        const firstValue = values[0];
                        if (!firstValue) break;

                    filters +=
                        ` AND (` +
                        String.raw`/taxonomicService/schema\:service/schema\:name:${firstValue}*` +
                        String.raw` OR /taxonomicService/schema\:taxonomicRange/_:${firstValue}*` +
                        String.raw` OR /taxonomicService/ods\:topicDiscipline/_:${firstValue}*` +
                        `)`;
                    }
                    break;
                case 'taxonomicRange':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicService/schema\:taxonomicRange/_:${item}*`));
                    break;
                case 'serviceType':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicService/schema\:Service/schema\:serviceType:${item}`));
                    break;
                default:
                    appendOrFilter(values.map((item) => String.raw`/taxonomicService/${escapedAlias}:${item}`));
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
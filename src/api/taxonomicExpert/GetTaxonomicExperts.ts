import axios from 'axios';
import { isEmpty } from 'lodash';

/* Import Types */
import { TaxonomicExpert, Dict } from 'app/Types';

const GetTaxonomicExperts = async ({
    pageNumber,
    pageSize,
    searchFilters,
}: {
    pageNumber: number;
    pageSize: number;
    searchFilters: { [searchFilter: string]: string | string[] };
}) => {
    let filters = '/taxonomicExpert/@type:TaxonomicExpert';
    filters += String.raw` AND /taxonomicExpert/schema\:status:accepted`;

    const appendOrFilter = (clauses: string[]) => {
        if (!clauses.length) return;

        filters += clauses.length === 1
            ? String.raw` AND ${clauses[0]}`
            : ` AND (${clauses.join(' OR ')})`;
    };

    if (!isEmpty(searchFilters)) {
        Object.entries(searchFilters).forEach(([key, value]) => {
            const values = (Array.isArray(value) ? value : [value]).filter((item) => !!item);

            if (!values.length) return;

            switch (key) {
                case 'query': {
                    const firstValue = values[0];
                    if (!firstValue) return;

                    const escaped = firstValue.replaceAll(/([*?\\:])/g, String.raw`\$1`);
                    filters += String.raw` AND ((/taxonomicExpert/schema\:person/schema\:name:${escaped}*) OR ` +
                        String.raw`(/taxonomicExpert/schema\:person/schema\:name:${escaped}~10) OR ` +
                        String.raw`(/taxonomicExpert/schema\:Taxon/schema\:spatialCoverage/_:${escaped}*) OR ` +
                        String.raw`(/taxonomicExpert/schema\:Taxon/schema\:spatialCoverage/_:${escaped}~) OR ` +
                        String.raw`(/taxonomicExpert/schema\:occupation/schema\:educationalLevel/_:${escaped}~) OR ` +
                        String.raw`(/taxonomicExpert/schema\:occupation/schema\:educationalLevel/_:${escaped}*))`;
                    break;
                }
                case 'location':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicExpert/schema\:person/schema\:location:${item}`));
                    break;
                case 'language':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicExpert/schema\:person/schema\:language/_:${item}`));
                    break;
                case 'taxonomicGroup':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicExpert/schema\:Taxon/schema\:discipline/_:${item}`));
                    break;
                case 'subTaxonomicGroup':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicExpert/schema\:Taxon/schema\:additionalType/_:${item}`));
                    break;
                case 'appliedResearch':
                    appendOrFilter(values.map((item) => String.raw`/taxonomicExpert/schema\:Taxon/schema\:ResearchProject/_:${item}`));
                    break;
                default:
                    break;
            }
        });
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
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
        taxonomicExperts: response.data.taxonomicExperts as TaxonomicExpert[],
        metadata: response.data.metadata as Dict,
    };
};

export default GetTaxonomicExperts;
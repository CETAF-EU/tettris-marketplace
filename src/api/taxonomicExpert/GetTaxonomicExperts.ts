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
    searchFilters: { [searchFilter: string]: string };
}) => {
    let filters = '/taxonomicExpert/@type:TaxonomicExpert';
    filters += String.raw` AND /taxonomicExpert/schema\:status:accepted`;

    if (!isEmpty(searchFilters)) {
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (!value) return;

            if (key === 'query') {
                const escaped = value.replaceAll(/([*?\\:])/g, String.raw`\$1`);
                filters += String.raw` AND ((/taxonomicExpert/schema\:person/schema\:name:${escaped}*) OR ` +
                    String.raw`(/taxonomicExpert/schema\:person/schema\:name:${escaped}~10) OR ` +
                    String.raw`(/taxonomicExpert/schema\:Taxon/schema\:spatialCoverage/_:${escaped}*) OR ` +
                    String.raw`(/taxonomicExpert/schema\:Taxon/schema\:spatialCoverage/_:${escaped}~) OR ` +
                    String.raw`(/taxonomicExpert/schema\:occupation/schema\:educationalLevel/_:${escaped}~) OR ` +
                    String.raw`(/taxonomicExpert/schema\:occupation/schema\:educationalLevel/_:${escaped}*))`;
            }

            if (key === 'location') {
                filters += String.raw` AND /taxonomicExpert/schema\:person/schema\:location:${value}`;
            }

            if (key === 'language') {
                filters += String.raw` AND /taxonomicExpert/schema\:person/schema\:language/_:${value}`;
            }

            if (key === 'taxonomicGroup') {
                filters += String.raw` AND /taxonomicExpert/schema\:Taxon/schema\:discipline/_:${value}`;
            }

            if (key === 'subTaxonomicGroup') {
                filters += String.raw` AND /taxonomicExpert/schema\:Taxon/schema\:additionalType/_:${value}`;
            }

            if (key === 'appliedResearch') {
                filters += String.raw` AND /taxonomicExpert/schema\:Taxon/schema\:ResearchProject/_:${value}`;
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
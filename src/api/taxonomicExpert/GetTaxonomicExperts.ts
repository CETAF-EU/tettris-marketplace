import axios from 'axios';

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
    const filters: Record<string, string> = {};
    for (const key of ["query","location","language","taxonomicGroup","subTaxonomicGroup","appliedResearch"]) {
        const value = searchFilters?.[key];
        if (value) filters[key] = value;
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
        params: {
            pageNumber: Math.max(1, pageNumber),
            pageSize,
            ...filters,
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
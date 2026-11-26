import axios from 'axios';

/* Import Types */
import { TaxonomicService, Dict } from 'app/Types';

const GetTaxonomicServices = async ({
    pageNumber,
    pageSize,
    searchFilters,
}: {
    pageNumber: number;
    pageSize: number;
    searchFilters: { [searchFilter: string]: string };
}) => {
    const filters: Record<string, string> = {};
    for (const key of ["query","language","topicDiscipline","taxonomicRange","serviceType"]) {
        const value = searchFilters?.[key];
        if (value) filters[key] = value;
    }
    // The generic catalogue selector is not a Cordra service type.
    if (filters.serviceType === 'taxonomicService') delete filters.serviceType;
    if (filters.serviceType === 'referenceCollection') filters.serviceType = 'Reference collection';

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/services`, {
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
        taxonomicServices: response.data.taxonomicServices as TaxonomicService[],
        metadata: response.data.metadata as Dict,
    };
};

export default GetTaxonomicServices;
/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

/* Import Types */
import { TaxonomicExpert, CordraResultArray, Dict } from 'app/Types';

/* Import Sources */

/**
 * Function that fetches the latest taxonomic services from the API
 * @param pageNumber The number of the current page of records
 * @returns An array of Taxonomic Service instances or an empty array
 */
const GetTaxonomicExperts = async ({ pageNumber, pageSize, searchFilters }: { pageNumber: number, pageSize: number, searchFilters: { [searchFilter: string]: string } }) => {
    /* Base variables */
    let taxonomicExperts: TaxonomicExpert[] = [];
    let metadata: Dict = {};

    /* Filter for the object type to be a taxonomic expert */
    let filters: string = ''
    filters = filters.concat('/taxonomicExpert/@type:TaxonomicExpert');
    /* Filter for state to be accepted */
    filters = filters.concat(' AND /taxonomicExpert/schema\\:status:accepted');

    if (!isEmpty(searchFilters)) {
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (key === 'query') {
                /* Set query to name search */
                filters = filters.concat(` AND ` + `(` + `/taxonomicExpert/schema\\:person/schema\\:name:` + `${value}*`
                    + `)`
                );
            }
            if (key === 'location') {
                /* Set array search for language */
                filters = filters.concat(` AND ` + `/taxonomicExpert/schema\\:person/schema\\:language/_:` + `${value}`);
            }
            if (key === 'language') {
                /* Set array search for language */
                filters = filters.concat(` AND ` + `/taxonomicExpert/schema\\:person/schema\\:language/_:` + `${value}`);
            }
            if (key === 'country') {
                /* Set array search for country */
                filters = filters.concat(` AND ` + `/taxonomicExpert/schema\\:person/schema\\:location:` + `${value}`);
            }
            if (key === 'taxonomicGroup') {
                /* Set taxonomic range search */
                filters = filters.concat(` AND ` + `/taxonomicExpert/schema\\:Taxon/schema\\:discipline/_:` + `${value}`);
            }
            if (key === 'subTaxonomicGroup') {
                /* Set taxonomic range search */
                filters = filters.concat(` AND ` + `/taxonomicExpert/schema\\:Taxon/schema\\:additionalType/_:` + `${value}`);
            }
            if (key === 'appliedResearch') {
                /* Set array search for Research Project */
                filters = filters.concat(` AND ` + `/taxonomicExpert/schema\\:Taxon/schema\\:ResearchProject/_:` + `${value}`);
            }
        });
    };

    try {
        const result = await axios({
            method: 'get',
            url: `/Op.Search`,
            params: {
                pageSize,
                pageNum: (pageNumber - 1 >= 0) ? pageNumber - 1 : 0,
                targetId: 'service',
                query: filters
            },
            auth: {
                username: 'TaxonomicMarketplace',
                password: import.meta.env.VITE_CORDRA_PASSWORD
            },
            responseType: 'json'
        });
        /* Get result data from JSON */
        const data: CordraResultArray = result.data;

        /* Set Taxonomic Expert */
        data.results.forEach((dataFragment) => {
            const taxonomicExpert = dataFragment.attributes.content as TaxonomicExpert;

            /* Set created and modified */
            taxonomicExpert.taxonomicExpert['schema:dateCreated'] = format(new Date(dataFragment.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            taxonomicExpert.taxonomicExpert['schema:dateModified'] = format(new Date(dataFragment.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

            /* Push to taxonomic services array */
            taxonomicExperts.push(taxonomicExpert);
        });

        /* Set metadata */
        metadata = {
            totalRecords: data.size
        };
    } catch (error) {
        console.error(error);

        throw (error);
    };

    return {
        taxonomicExperts,
        metadata
    };
}

export default GetTaxonomicExperts;
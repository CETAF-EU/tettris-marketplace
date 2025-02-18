/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

/* Import Types */
import { TaxonomicService, CordraResultArray, Dict } from 'app/Types';

/* Import Sources */
import TaxonomicServiceFilters from 'sources/searchFilters/TaxonomicServiceFilters.json';


/**
 * Function that fetches the latest taxonomic services from the API
 * @param pageNumber The number of the current page of records
 * @returns An array of Taxonomic Service instances or an empty array
 */
const GetTaxonomicServices = async ({ pageNumber, pageSize, searchFilters }: { pageNumber: number, pageSize: number, searchFilters: { [searchFilter: string]: string } }) => {
    /* Base variables */
    let taxonomicServices: TaxonomicService[] = [];
    let metadata: Dict = {};

    /* Destructure search filters into string */
    let filters: string = '';

    /* Filter for the object type to be a taxonomic service */
    filters = filters.concat('/taxonomicService/@type:TaxonomicService');

    /* Filter for state to be accepted */
    filters = filters.concat(' AND /taxonomicService/schema\\:status:accepted');

    if (!isEmpty(searchFilters)) {
        Object.entries(searchFilters).forEach(([key, value]) => {
            const alias: string | undefined = TaxonomicServiceFilters.taxonomicServiceFilters.find(taxonomicSearchFilter => taxonomicSearchFilter.name === key)?.alias;

            switch (key) {
                case 'language':
                case 'topicDiscipline':
                    /* Set array search for language */
                    filters = filters.concat(` AND ` + `/taxonomicService/${(alias ?? key).replace(':', '\\:')}/_:` + `${value}`);

                    break;
                case 'query':
                    /* Set query to name search */
                    filters = filters.concat(` AND ` + `(` + `/taxonomicService/schema\\:service/schema\\:name:` + `${value}*`
                        + ` OR ` + `/taxonomicService/schema\\:taxonomicRange/_:` + `${value}*`
                        + ` OR ` + `/taxonomicService/ods\\:topicDiscipline/_:` + `${value}*`
                        + `)`
                    );

                    break;
                case 'taxonomicRange':
                    /* Set taxonomic range search */
                    filters = filters.concat(` AND ` + `/taxonomicService/schema\\:taxonomicRange/_:` + `${value}*`);

                    break;
                case 'serviceType':
                    /* Set service type search */
                    filters = filters.concat(` AND ` + `/taxonomicService/schema\\:Service/schema\\:serviceType:` + `${value}`);

                    break;
                default:
                    /* Get field alias from taxonomic service filters source */
                    filters = filters.concat(` AND ` + `/taxonomicService/${(alias ?? key).replaceAll(':', '\\:')}:` + `${value}`);
            };
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
            responseType: 'json'
        });

        /* Get result data from JSON */
        const data: CordraResultArray = result.data;

        /* Set Taxonomic Services */
        data.results.forEach((dataFragment) => {
            const taxonomicService = dataFragment.attributes.content as TaxonomicService;

            /* Set created and modified */
            taxonomicService.taxonomicService['schema:dateCreated'] = format(new Date(dataFragment.attributes.metadata.createdOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            taxonomicService.taxonomicService['schema:dateModified'] = format(new Date(dataFragment.attributes.metadata.modifiedOn), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

            /* Push to taxonomic services array */
            taxonomicServices.push(taxonomicService);
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
        taxonomicServices,
        metadata
    };
}

export default GetTaxonomicServices;
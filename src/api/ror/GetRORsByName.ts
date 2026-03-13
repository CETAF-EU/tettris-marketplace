/* Import Dependencies */
import axios from 'axios';

/* Import Types */
import { Dict } from 'app/Types';


/**
 * Function that searches for and fetches ROR data from the ROR API by providing a query
 * @param query The provided query to search by
 * @returns
 */
const GetRORsByName = async ({ query }: { query?: string }) => {
    let rors: Dict[] = [];

    if (query) {
        /* Escape special characters in query string */
        let escapedQuery: string = '';

        for(let index = 0; index < query.length; index++) {
            const character = query.at(index) as string;

            escapedQuery = escapedQuery.concat(character?.replaceAll(/[^\w]/g, `\\${character}`));
        };

        try {
            const result = await axios({
                baseURL: 'https://api.ror.org/v2',
                method: 'get',
                url: '/organizations',
                params: {
                    query: escapedQuery
                },
                responseType: 'json'
            });

            /* Get result data from JSON */
            const data: any = result.data;

            rors = data.items;
        } catch (error) {
            console.error(error);

            throw (error);
        }
    };

    return rors;
}

export default GetRORsByName;
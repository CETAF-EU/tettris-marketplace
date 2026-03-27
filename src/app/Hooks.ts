/* Import Dependencies */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

/* Import Types */
import type { RootState, AppDispatch } from './Store';
import { Dict } from './Types';


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


/**
 * Fetch hook for handling fetch requests
 * @returns Instance of hook
 */
const useFetch = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const Fetch = ({ params, Method, Handler, ErrorHandler }: { params?: Dict, Method: Function, Handler?: Function, ErrorHandler?: Function }) => {
        useEffect(() => {
            setLoading(true);

            Method(params).then((result: Dict) => {
                Handler?.(result);
            }).catch((error: Error) => {
                console.error(error);

                ErrorHandler?.(error);
            }).finally(() => {
                setLoading(false);
            });
        }, []);
    };

    /**
     * Function to fetch multiple endpoints at the same time
     * @param methods Fetch methods to query
     * @returns Results
     */
    const FetchMultiple = ({ callMethods, Handler, ErrorHandler }: { callMethods: { alias: string, params?: Dict, Method: Function }[], Handler?: Function, ErrorHandler?: Function }) => {
        useEffect(() => {
            const promises: Promise<Dict>[] = [];

            callMethods.forEach(callMethod => {
                promises.push(callMethod.Method(callMethod.params));
            });

            Promise.all(promises).then((results) => {
                ProcessResults(results);
            }).catch(error => {
                ErrorHandler?.(error);
            });
        }, []);

        const ProcessResults = (results: Dict[]) => {
            const aliasedResults: { [alias: string]: Dict } = {};

            results.forEach((result, index) => {
                aliasedResults[callMethods[index].alias] = result;
            });

            Handler?.(aliasedResults);
        };
    };

    return {
        loading,
        Fetch,
        FetchMultiple
    };
}


/**
 * Focus hook for handling the focus of a specific HTML element
 * @param ref A React reference to the focussed element
 * @returns Instance of hook
 */
const useFocus = ({ ref, OnFocusLose }: { ref: React.RefObject<HTMLElement>, OnFocusLose?: Function }) => {
    /* Base variables */
    const [focusToggle, setFocusToggle] = useState<boolean>(false);

    useEffect(() => {
        const focusElement = ref.current as HTMLDivElement;

        /**
         * Function to handle a click outside of the element
         * @param event The click event initiated by the user
         */
        const HandleClickOutside = (event: Dict) => {
            if (!focusElement.contains(event.target)) {
                setFocusToggle(false);

                /* Call OnFocusLose function if defined */
                OnFocusLose?.();
            }
        };

        /* Set listener for mouse down (click) events */
        document.addEventListener("mousedown", HandleClickOutside);

        /* Clean up function */
        return () => {
            document.removeEventListener("mousedown", HandleClickOutside);
        };
    }, [ref]);

    return {
        focusToggle
    };
}


/**
 * Paginator Hook for handling pagination with fetch requests and page numbers
 * @returns Instance of hook
 */
const usePaginator = ({ Initiate, Method, Handler, ErrorHandler, pageSize, resultKey, allowSearchParams = false }:
    { Initiate: Function, Method: Function, Handler: Function, ErrorHandler?: Function, pageSize: number, resultKey?: string, allowSearchParams: boolean }
) => {
    /* Hooks */
    const [searchParams] = useSearchParams();

    /* Base variables */
    const [returnData, setReturnData] = useState<{
        records: Dict[],
        metadata: Dict
    }>({
        records: [],
        metadata: {}
    });
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    /* Get search filters from search params */
    const searchFilters = [...searchParams.entries()].reduce((filtersObject, [key, value]) => {
        const previousValue = filtersObject[key];

        if (!previousValue) {
            return {
                ...filtersObject,
                [key]: value
            };
        }

        return {
            ...filtersObject,
            [key]: Array.isArray(previousValue) ? [...previousValue, value] : [previousValue, value]
        };
    }, {} as Dict);
    const [searchFiltersSave, setSearchFiltersSave] = useState<Dict>(
        searchFilters
    );

    /**
     * Function to check for a next page and if so initate a fetch for those records
     * @returns True, if there is a next page or not
     */
    const Next = () => {
        setPageNumber(pageNumber + 1);
    };

    /* UseEffect to watch the page number, if changed, trigger the given method */
    useEffect(() => {
        if (pageNumber) {
            /* Set Loading to true */
            setLoading(true);

            /* Fetch data */
            (async () => {
                try {
                    const result = await Method({ pageNumber: pageNumber, pageSize, ...(allowSearchParams && { searchFilters }) });

                    if (result) {
                        /* Set return data */
                        const records = resultKey ? result[resultKey] : result[Object.keys(result)[0]];

                        setReturnData({
                            records,
                            metadata: result.metadata
                        });

                        /* Undo error message */
                        setErrorMessage(undefined);

                        /* Return records to handler */
                        Handler?.(records);
                    } else {
                        throw (new Error('Fetch ended in undefined Result'));
                    };
                } catch (error) {
                    if (pageNumber > 1) {
                        setErrorMessage('No more records to be found');
                    } else {
                        setReturnData({
                            records: [],
                            metadata: {
                                totalRecords: 0
                            }
                        });

                        setErrorMessage('Not a single record found with these criteria');
                    };

                    ErrorHandler?.(error);
                };

                setLoading(false);
            })();
        } else {
            setPageNumber(1);
        };
    }, [pageNumber]);

    /* UseEffect to watch the search parameters if allowed, if so and on change, reset the page number to 1 */
    useEffect(() => {
        if (JSON.stringify(searchFilters) !== JSON.stringify(searchFiltersSave)) {
            setSearchFiltersSave(searchFilters);

            setPageNumber(0);
        }
    }, [(allowSearchParams ? searchParams : false)]);

    /* Initate Function */
    useEffect(() => {
        Initiate?.();
    }, [searchParams]);

    return {
        records: returnData.records ?? [],
        totalRecords: returnData.metadata?.totalRecords ?? undefined,
        currentPage: pageNumber,
        loading,
        errorMessage,
        Next
    };
};

export {
    useFetch,
    useFocus,
    usePaginator
}
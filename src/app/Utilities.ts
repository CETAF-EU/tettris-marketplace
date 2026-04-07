/* Import Dependencies */
import { startCase } from "lodash";


/** Function to capitalize the first character of a string */
const Capitalize = (string: string) => {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return '';
    }
}

/** Function to replace capitals in a string with spaces to make a readable string */
const MakeReadableString = (string: string) => {
    const splitArray: RegExpMatchArray | null = string.match(/[A-Z]?[a-z]+|[/d]+|[A-Z]+(?![a-z])/g);

    return startCase(splitArray?.join(' ')) ?? startCase(string.split(/(?=[A-Z])/).join(' '));
};

/** Function to remove handle base URL and keep only the identifier path */
const HandleToPath = (handle: string) => {
    return handle
        .replace((import.meta.env.VITE_HANDLE_URL as string) ?? '', '')
        .replace(/^\/+/, '');
};

/** Function to turn labels into URL-safe slugs */
const Slugify = (value: string) => {
    return value
        .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
};

/** Function to build canonical taxonomic entity route */
const BuildEntityRoute = (entityType: 'ts' | 'te', handle: string, name?: string) => {
    const handlePath = HandleToPath(handle);
    const slug = Slugify(name ?? '');

    return slug
        ? `/${entityType}/${handlePath}/${encodeURIComponent(slug)}`
        : `/${entityType}/${handlePath}`;
};

/** Function to build slug-only canonical route */
const BuildSlugOnlyRoute = (entityType: 'ts' | 'te', name: string) => {
    return `/${entityType}/${encodeURIComponent(Slugify(name))}`;
};


export {
    Capitalize,
    MakeReadableString,
    HandleToPath,
    Slugify,
    BuildEntityRoute,
    BuildSlugOnlyRoute
}
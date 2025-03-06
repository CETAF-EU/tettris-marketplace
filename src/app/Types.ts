/* Import Types */
import { TaxonomicService as TaxonomicServiceType } from "./types/TaxonomicService";
import { TaxonomicExpert as TaxonomicExpertType } from "./types/TaxonomicExpert";

/* General type for a dictionary */
export type Dict = {
    [name: string]: any;
};

/* Types for JSON Result Interfaces */
export type CordraResult = {
    id: string,
    type: string,
    attributes: {
        content: {
            taxonomicService?: TaxonomicServiceType,
            taxonomicExpert?: TaxonomicExpertType,
            [property: string]: any
        },
        metadata: {
            createdOn: number,
            createdBy: string,
            modifiedOn: number,
            modifiedBy: string
        }
    }
};

export type CordraResultArray = {
    size: number,
    results: CordraResult[]
};

/* Type for a Taxonomic Service */
export type TaxonomicService = {
    taxonomicService: TaxonomicServiceType
}

/* Type for a Taxonomic Expert */
export type TaxonomicExpert = {
    taxonomicExpert: TaxonomicExpertType
}

/* Type for an Author */
export type Author = {
    "@type": "schema:Person";
    "schema:identifier": string;
    "schema:affiliation": {
        "@type": "schema:Organization";
        "schema:identifier": string;
        "schema:name"?: string;
    }
};

/* Type for an Agent */
export type Maintainer = {
    "@type": string;
    "schema:identifier": string[];
    "schema:name"?: string;
    "schema:affiliation": {
        "@type": "schema:Organization";
        "schema:identifier": string;
        "schema:name"?: string;
    };
}

/* Type for a Funder */
export type Funder = {
    "@type": "schema:Person";
    "schema:identifier": string;
    "schema:name": string
};

/* Type for a Filter */
export type Filter = {
    name: string,
    type: string,
    default?: string,
    options?: {
        label: string,
        value: string,
        subOptions?: {
            label: string,
            value: string
        }[],
        action?: Function
    }[],
    placeholder?: string
};

/* Type for a form field */
export type FormField = {
    jsonPath: string,
    title: string,
    description: string,
    type: string,
    const?: string,
    options?: string[],
    mapping?: {
        [option: string]: string
    } | string,
    required?: boolean,
    maxChars?: number
    maxSelections?: number
};

/* Type for a Dropdown item */
export type DropdownItem = {
    label: string,
    value: string,
    action?: Function
};
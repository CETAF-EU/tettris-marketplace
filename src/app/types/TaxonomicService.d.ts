/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Generic concept of a Service or Tool
 */
export interface TaxonomicService {
  /**
   * The unique identifier of the Taxonomic Service object
   */
  "@id": string;
  /**
   * The type of the object, in this case TaxonomicService
   */
  "@type": "TaxonomicService";
  /**
   * The date on which the Taxonomic Service was created or the item was added to a DataFeed, following the ISO Date Time Format yyyy-MM-dd'T'HH:mm:ss.SSSXXX
   */
  "schema:dateCreated": string;
  /**
   * The date on which the Service was most recently modified or when the item's entry was modified within a DataFeed, following the ISO Date Time Format yyyy-MM-dd'T'HH:mm:ss.SSSXXX
   */
  "schema:dateModified"?: string;
  /**
   * Date the service was published, following the ISO Date Time Format yyyy-MM-dd'T'HH:mm:ss.SSSXXX
   */
  "schema:datePublished"?: string;
  /**
   * The status of the record
   */
  "schema:status": "proposed" | "accepted" | "rejected";
  /**
   * A license document that applies to this content, typically indicated by URL
   */
  "schema:license"?:
    | "https://spdx.org/licenses/CC-BY-1.0.json"
    | "https://spdx.org/licenses/CC-BY-2.0.json"
    | "https://spdx.org/licenses/CC-BY-2.5.json"
    | "https://spdx.org/licenses/CC-BY-2.5-AU.json"
    | "https://spdx.org/licenses/CC-BY-3.0.json"
    | "https://spdx.org/licenses/CC-BY-3.0-AT.json"
    | "https://spdx.org/licenses/CC-BY-3.0-AU.json"
    | "https://spdx.org/licenses/CC-BY-3.0-DE.json"
    | "https://spdx.org/licenses/CC-BY-3.0-IGO.json"
    | "https://spdx.org/licenses/CC-BY-3.0-NL.json"
    | "https://spdx.org/licenses/CC-BY-3.0-US.json"
    | "https://spdx.org/licenses/CC-BY-4.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-1.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-2.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-2.5.json"
    | "https://spdx.org/licenses/CC-BY-NC-3.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-3.0-DE.json"
    | "https://spdx.org/licenses/CC-BY-NC-4.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-ND-1.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-ND-2.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-ND-2.5.json"
    | "https://spdx.org/licenses/CC-BY-NC-ND-3.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-ND-3.0-DE.json"
    | "https://spdx.org/licenses/CC-BY-NC-ND-3.0-IGO.json"
    | "https://spdx.org/licenses/CC-BY-NC-ND-4.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-1.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-2.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-2.0-DE.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-2.0-FR.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-2.0-UK.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-2.5.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-3.0.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-3.0-DE.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-3.0-IGO.json"
    | "https://spdx.org/licenses/CC-BY-NC-SA-4.0.json"
    | "https://spdx.org/licenses/CC-BY-ND-1.0.json"
    | "https://spdx.org/licenses/CC-BY-ND-2.0.json"
    | "https://spdx.org/licenses/CC-BY-ND-2.5.json"
    | "https://spdx.org/licenses/CC-BY-ND-3.0.json"
    | "https://spdx.org/licenses/CC-BY-ND-3.0-DE.json"
    | "https://spdx.org/licenses/CC-BY-ND-4.0.json"
    | "https://spdx.org/licenses/CC-BY-SA-1.0.json"
    | "https://spdx.org/licenses/CC-BY-SA-2.0.json"
    | "https://spdx.org/licenses/CC-BY-SA-2.0-UK.json"
    | "https://spdx.org/licenses/CC-BY-SA-2.1-JP.json"
    | "https://spdx.org/licenses/CC-BY-SA-2.5.json"
    | "https://spdx.org/licenses/CC-BY-SA-3.0.json"
    | "https://spdx.org/licenses/CC-BY-SA-3.0-AT.json"
    | "https://spdx.org/licenses/CC-BY-SA-3.0-DE.json"
    | "https://spdx.org/licenses/CC-BY-SA-3.0-IGO.json"
    | "https://spdx.org/licenses/CC-BY-SA-4.0.json"
    | "https://spdx.org/licenses/CC-PDDC.json"
    | "https://spdx.org/licenses/CC0-1.0.json"
    | "https://spdx.org/licenses/DL-DE-BY-2.0.json"
    | "https://spdx.org/licenses/DL-DE-ZERO-2.0.json"
    | "https://www.govdata.de/dl-de/by-1-0"
    | "https://www.govdata.de/dl-de/by-nc-1-0"
    | "https://spdx.org/licenses/EUPL-1.0.json"
    | "https://spdx.org/licenses/EPL-2.0.json"
    | "https://spdx.org/licenses/EUPL-1.2.json"
    | "https://www.etalab.gouv.fr/licence-ouverte-open-licence/"
    | "https://spdx.org/licenses/GFDL-1.1-invariants-only.json"
    | "https://spdx.org/licenses/GFDL-1.1-invariants-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.1-no-invariants-only.json"
    | "https://spdx.org/licenses/GFDL-1.1-no-invariants-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.1-only.json"
    | "https://spdx.org/licenses/GFDL-1.1-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.2-invariants-only.json"
    | "https://spdx.org/licenses/GFDL-1.2-invariants-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.2-no-invariants-only.json"
    | "https://spdx.org/licenses/GFDL-1.2-no-invariants-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.2-only.json"
    | "https://spdx.org/licenses/GFDL-1.2-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.3-invariants-only.json"
    | "https://spdx.org/licenses/GFDL-1.3-invariants-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.3-no-invariants-only.json"
    | "https://spdx.org/licenses/GFDL-1.3-no-invariants-or-later.json"
    | "https://spdx.org/licenses/GFDL-1.3-only.json"
    | "https://spdx.org/licenses/GFDL-1.3-or-later.json"
    | "https://data.gov.hr/open-licence-republic-croatia"
    | "https://www.dati.gov.it/iodl/2.0/"
    | "https://spdx.org/licenses/NLOD-1.0.json"
    | "https://spdx.org/licenses/NLOD-2.0.json"
    | "https://spdx.org/licenses/ODC-By-1.0.json"
    | "https://spdx.org/licenses/ODbL-1.0.json"
    | "https://spdx.org/licenses/PDDL-1.0.json"
    | "https://spdx.org/licenses/OGL-Canada-2.0.json"
    | "https://spdx.org/licenses/OGL-UK-1.0.json"
    | "https://spdx.org/licenses/OGL-UK-2.0.json"
    | "https://spdx.org/licenses/OGL-UK-3.0.json"
    | "https://data.gov.ro/pages/licence";
  /**
   * A language someone may use with or at the item, service or place. Please use one of the language codes from the IETF BCP 47 standard.
   */
  "schema:availableLanguage": string[];
  /**
   * The topic discipline relevant to the taxonomic range of the service
   */
  "ods:topicDiscipline"?: (
    | "Anthropology"
    | "Botany"
    | "Microbiology"
    | "Palaeontology"
    | "Zoology"
    | "Ecology"
    | "Other Biodiversity"
    | "Unclassified"
  )[];
  /**
   * The taxonomic grouping of the organism, e.g. 'No specific range' or 'Agromyzidae, Braconidae'
   */
  "schema:taxonomicRange"?: string[];
  /**
   * The geographic area associated with the service, e.g. World, Palearctic, South-East Europe, Mediterranean
   */
  "schema:geographicArea"?: string;
  /**
   * URL of the item that leads to the resource of the service
   */
  "schema:url"?: string;
  /**
   * The subject matter of the service including a summary of the Resource features updated from the previous version.
   */
  "schema:about"?: string;
  /**
   * URL to further documentation describing the service in more detail.
   */
  "schema:documentation"?: string;
  /**
   * The rating for the content on a scale from 0 to 100
   */
  "schema:ratingValue": number;
  /**
   * A short explanation (e.g. one to two sentences) providing background context and other information that led to the conclusion expressed in the rating.
   */
  "schema:ratingExplanation"?: string;
  /**
   * Generic property for handling domain specific values.
   */
  "schema:additionalProperty"?: {
    /**
     * The type of the additional property
     */
    "@type": "PropertyValue";
    /**
     * The name of the additional property
     */
    name: string;
    /**
     * A description of the additional property
     */
    description: string;
    /**
     * The value of the additional property
     */
    value: string | unknown[];
  }[];
  /**
   * A service provided by an organization, e.g. delivery service, print services, etc.
   */
  "schema:Service": {
    /**
     * A type that defines the kind of taxonomic service
     */
    "schema:serviceType": (
      | "AI training dataset"
      | "Community group"
      | "CrowdSourcing"
      | "Data tool"
      | "e-Learning service"
      | "Factsheet"
      | "Identification tool"
      | "Knowledge website"
      | "Mobile app"
      | "Service inventory"
      | "Reference collection"
      | "Specimen dataset not in GBIF"
    )[];
    /**
     * The preferred name of the service (can be in any language)
     */
    "schema:name": string;
    /**
     * A description of the service (english)
     */
    "schema:description": string;
    /**
     * A slogan or motto associated with the Service (english).
     */
    "schema:slogan"?: string;
    /**
     * An associated logo URL.
     */
    "schema:logo"?: string;
    /**
     * URL pointing to Terms of Service, Terms of Use or Terms and Conditions, the legal agreements between a service provider and a person who wants to use that service.
     */
    "schema:termsOfService"?: string;
    /**
     * Generic property for handling domain specific values.
     */
    "schema:additionalProperty"?: {
      /**
       * The type of the additional property
       */
      "@type": "PropertyValue";
      /**
       * The name of the additional property
       */
      name: string;
      /**
       * A description of the additional property
       */
      description: string;
      /**
       * The value of the additional property
       */
      value: string | unknown[];
    }[];
  };
  /**
   * A contact point—for example, a Customer Complaints department.
   */
  "schema:ContactPoint"?: {
    /**
     * Email address of the contact point.
     */
    "schema:email"?: string;
    /**
     * URL to a contact webpage or contact form for the resource.
     */
    "schema:url"?: string;
  };
  /**
   * An array of authors of this service.
   */
  "schema:Author"?: {
    /**
     * The type of the author
     */
    "@type": "schema:Person";
    /**
     * A unique identifier to identify the author; ORCID identifiers are valid
     */
    "schema:identifier": string;
    "schema:affiliation": {
      /**
       * The type of the affiliation
       */
      "@type": "schema:Organization";
      /**
       * A unique identifier to identify the author's affiliation; ROR identifiers are valid
       */
      "schema:identifier": string;
      /**
       * Full name of the author's affiliated orgnisation
       */
      "schema:name"?: string;
    };
  }[];
  /**
   * An array of maintainers of a Dataset, software package (SoftwareApplication), or other Project. A maintainer is a Person or Organization that manages contributions to, and/or publication of, some (typically complex) artefact.
   */
  "schema:Maintainer"?: {
    /**
     * The type of the maintainer
     */
    "@type": "schema:Person";
    "schema:identifier": [
      {
        type: "string";
        description: "A unique identifier to identify the maintainer; GitHub identifiers are valid";
        examples: ["https://api.github.com/users/username"];
      },
      {
        type: "string";
        description: "A unique identifier to identify the maintainer; ORCID identifiers are valid";
        examples: ["https://orcid.org/0000-0001-9790-9277"];
      }
    ];
    /**
     * Full name of the maintainer
     */
    "schema:name"?: string;
    /**
     * The organisation the maintainer is affiliated with
     */
    "schema:affiliation": {
      /**
       * The type of the affiliation
       */
      "@type": "schema:Organization";
      /**
       * A unique identifier to identify the maintainer's affiliation; ROR identifiers are valid
       */
      "schema:identifier": string;
      /**
       * Full name of the maintainer's affiliated orgnisation
       */
      "schema:name"?: string;
    };
  }[];
  /**
   * A FundingScheme combines organizational, project and policy aspects of grant-based funding that sets guidelines, principles and mechanisms to support other kinds of projects and activities.
   */
  "schema:FundingScheme"?: {
    /**
     * An award won by or for this service
     */
    "schema:award"?: string;
    /**
     * A Grant that directly or indirectly provide funding or sponsorship for this service
     */
    "schema:Funding"?: {
      /**
       * A unique identifier to identify the funder organisation; ROR identifiers are valid
       */
      "schema:identifier": string;
      /**
       * A description of the service's grant
       */
      "schema:description"?: string;
    };
    /**
     * An organization that supports (sponsors) something through some kind of financial contribution.
     */
    "schema:Funder"?: unknown[];
  };
  /**
   * Object representing the service's software source code
   */
  "schema:SoftwareSourceCode"?: {
    /**
     * Link to the repository where the un-compiled, human readable code and related code is located (SVN, GitHub, CodePlex).
     */
    "schema:codeRepository": string;
    /**
     * Runtime platform or script interpreter dependencies (example: Java v1, Python 2.3, .NET Framework 3.0).
     */
    "schema:runtimePlatform"?: string;
    /**
     * The status of a creative work in terms of its stage in a lifecycle. Example terms include Incomplete, Draft, Published, Obsolete. Some organizations define a set of terms for the stages of their publication lifecycle.
     */
    "schema:creativeWorkStatus"?: string;
    /**
     * The computer programming language.
     */
    "schema:programmingLanguage"?: string;
    /**
     * A license document that applies to this content, typically indicated by URL.
     */
    "schema:license"?: string;
    /**
     * Generic property for handling domain specific values.
     */
    "schema:additionalProperty"?: {
      /**
       * The type of the additional property
       */
      "@type": "PropertyValue";
      /**
       * The name of the additional property
       */
      name: string;
      /**
       * A description of the additional property
       */
      description: string;
      /**
       * The value of the additional property
       */
      value: boolean;
    }[];
    [k: string]: unknown;
  };
  /**
   * Array of media objects that encodes this Service. This property is a synonym for encoding.
   */
  "schema:AssociatedMedia"?: {
    /**
     * JPG, PNG or SVG file showing a screenshot or other relevant illustration of the resource. Add only files that are public domain.
     */
    "schema:contentUrl": string;
  }[];
  [k: string]: unknown;
}

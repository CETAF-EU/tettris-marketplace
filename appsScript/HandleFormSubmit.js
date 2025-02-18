const fieldNameResolutionDict = {
  "Service License": 'schema:license',
  "Available Languages": 'schema:availableLanguage',
  Version: 'schema:version',
  "Topic Discipline": "ods:topicDiscipline",
  "Taxonomic Range": 'schema:taxonomicRange',
  "Geographic Area": "schema:geographicArea",
  "Documentation URL": "schema:documentation",
  "Service Type": 'schema:serviceType',
  Name: 'schema:name',
  Description: 'schema:description',
  Slogan: 'schema:slogan',
  Logo: 'schema:logo',
  "Date Modified": 'schema:dateModified',
  "Terms of Service": 'schema:termsOfService',
  "Contact Email": 'schema:email',
  "Contact Webpage": 'schema:url',
  "Webpage": 'schema:sameAs',
  "Identifier of Maintainer": "schema:identifier",
  "Full Name": "schema:name",
  "Organisation Identifier": "schema:identifier",
  "Organisation Legal Name": "schema:legalName",
  "Payment Model": 'schema:url',
  "Funder Name": 'schema:name',
  "Code Repository": 'schema:codeRepository',
  "Change Log": 'schema:about',
  "Runtime Platform": 'schema:runtimePlatform',
  Status: 'schema:creativeWorkStatus',
  "Programming Languages": 'schema:programmingLanguage',
  "Software License": "schema:license",
  "Content URL": "schema:contentUrl",
  "Media License 1": "schema:license",
  "Media License 2": "schema:license",
  "Media License 3": "schema:license",
};
const licences = Licenses();
let maintainerIndex = 0;
let associatedMediaIndex = 0;

/**
 * Function to return the schema name for a field, when provided with the name of the field in the form
 */
const ReferenceField = (fieldName) => {
  return fieldNameResolutionDict[fieldName];
};

/**
 * Function to add a value to the taxonomic service object
 */
const AddToTaxonomicService = (taxonomicService, itemTitle, itemResponse) => {
  const setNestedValue = (path, value) => {
    path.reduce((acc, key, index) => {
      if (index === path.length - 1) {
        acc[key] = value;
      } else {
        acc[key] = acc[key] || (isNaN(path[index + 1]) ? {} : []);
      }
      return acc[key];
    }, taxonomicService);
  };

  const parseIndex = (title) => {
    const match = title.match(/\d+$/); // Match digits only at the end of the string
    return match ? Number(match[0]) - 1 : -1;
  };
  

  const handleMaintainer = (index, field, value) => {
    if (!taxonomicService.schema?.Maintainer) taxonomicService['schema:Maintainer'] = [];
    if (!taxonomicService['schema:Maintainer'][index]) taxonomicService['schema:Maintainer'][index] = {};

    const path = field.includes('Organisation') 
      ? ['schema:Maintainer', index, 'schema:Organization', field] 
      : ['schema:Maintainer', index, field];

    setNestedValue(path, value);
  };

  const handleAssociatedMedia = (index, field, value) => {
    if (!taxonomicService['schema:AssociatedMedia']) taxonomicService['schema:AssociatedMedia'] = [];
    if (!taxonomicService['schema:AssociatedMedia'][index]) taxonomicService['schema:AssociatedMedia'][index] = {};
    
    setNestedValue(['schema:AssociatedMedia', index, field], value);
  };

  const handleDefaultCases = () => {
    if (/^(?:Identifier of Maintainer|Full Name|Organisation Identifier|Organisation Legal Name) \d+\b/.test(itemTitle)) {
      handleMaintainer(parseIndex(itemTitle), ReferenceField(itemTitle.replace(/ \d+\b/, '')), itemResponse);
    } else if (/^(?:Content URL|Media License) \d+\b/.test(itemTitle)) {
      const index = parseIndex(itemTitle);
      const field = ReferenceField(itemTitle.replace(/ \d+\b/, ''));
      const value = itemTitle.includes('Media License') 
        ? licences.licenses.find(licence => licence.name === itemResponse)?.licenseId || itemResponse 
        : itemResponse;

      handleAssociatedMedia(index, field, value);
    } else {
      setNestedValue([ReferenceField(itemTitle)], itemResponse);
    }
  };

  switch (itemTitle) {
    case 'Available Languages':
    case 'Taxonomic Range':
      setNestedValue([ReferenceField(itemTitle)], itemResponse.split(',').map(item => item.trim()));
      break;
    case 'Service Type':
    case 'Name':
    case 'Description':
    case 'Slogan':
    case 'Logo':
    case 'Date Modified':
    case 'Terms of Service':
      setNestedValue(['schema:service', ReferenceField(itemTitle)], itemResponse);
      break;
    case 'Contact Email':
    case 'Contact Webpage':
    case 'Webpage':
      setNestedValue(['schema:ContactPoint', ReferenceField(itemTitle)], itemResponse);
      break;
    case 'Payment Model':
    case 'Funder Name':
      setNestedValue(['schema:FundingScheme', itemTitle === 'Funder Name' ? 'schema:Funder' : ReferenceField(itemTitle)], itemResponse);
      break;
    case 'Code Repository':
      setNestedValue(['schema:SoftwareSourceCode', ReferenceField(itemTitle)], itemResponse);
      break;
    case 'Programming Languages':
    case 'Change Log':
    case 'Runtime Platform':
    case 'Status':
      if (taxonomicService['schema:SoftwareSourceCode']) {
        setNestedValue(['schema:SoftwareSourceCode', ReferenceField(itemTitle)], itemResponse);
      }
      break;
    case 'Software License':
    case 'Service License':
      setNestedValue([ReferenceField(itemTitle)], licences.licenses.find(licence => licence.name === itemResponse)?.licenseId || itemResponse);
      break;
    default:
      handleDefaultCases();
  }
};


/**
 * Function for handling a form submit
 */
const HandleFormSubmit = (e) => {
  /* Base variables */
  const taxonomicService = {
    type: 'TaxonomicService',
    attributes: {
      content: {
        taxonomicService: {
          '@type': 'TaxonomicService',
          'schema:status': 'proposed',
          'schema:ratingValue': 0,
          'schema:Service': {}
        }
      }
    }
  };
  const itemResponses = e.response.getItemResponses();
  let message = 'A new application has been submitted, the data:\n \n';

  itemResponses.forEach((itemResponsesRecord, i) => {
    const itemTitle = itemResponsesRecord.getItem().getTitle();
    const itemResponse = itemResponsesRecord.getResponse();

    /* Add response item to taxonomic service */
    if (itemResponse && itemTitle) {
      AddToTaxonomicService(taxonomicService.attributes.content.taxonomicService, itemTitle, itemResponse);

      /* Add response item to message */
      message += itemTitle + ': ' + itemResponse + '\n';
    }
  });

  /* POST submission as a draft record to Cordra */
  const url = "https://cetaf-marketplace.dissco.tech/cordra/doip/0.DOIP/Op.Create?targetId=service";
  const options = {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Utilities.base64Encode("GoogleForms" + ":" + "J6ts896bNRKw")
    },
    contentType: 'application/json',
    payload: JSON.stringify(taxonomicService)
  };

  UrlFetchApp.fetch(url, options);

  /* Send email to CETAF admins */
  MailApp.sendEmail(
    Session.getEffectiveUser().getEmail()/*info@cetaf.org*/,
    'New Taxonomic Service Application Received',
    JSON.stringify(taxonomicService),
    { name: 'Google Forms' });
};
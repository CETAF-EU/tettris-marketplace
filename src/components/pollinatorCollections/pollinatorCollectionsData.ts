export type CollectionLink = {
    label: string;
    url: string;
};

export type PollinatorCollection = {
    institution: string;
    project?: string;
    dataCoverage: string;
    links: CollectionLink[];
};

export const pollinatorCollections: PollinatorCollection[] = [
    {
        institution: 'ES-EBD-CSIC Biological Station of Donana',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/5749f84f-da11-4196-b42a-76d244b27f31'
            }
        ]
    },
    {
        institution: 'Helsinki Zoological Museum',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Platycheirus).',
        links: [
            {
                label: 'collection data 1',
                url: 'https://scientific-collections.gbif.org/collection/7b84d165-0f43-4a98-a6ce-aeed2944f914'
            },
            {
                label: 'collection data 2',
                url: 'https://scientific-collections.gbif.org/collection/10e95388-1065-4816-af72-13c69ecc1716'
            }
        ]
    },
    {
        institution: 'Lund University Biological Museum',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/88c7ecd2-b256-4fad-9ff2-19ab4991fc31'
            }
        ]
    },
    {
        institution: 'Museo cantonale di storia naturale - Lugano',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/b572b98d-4c1e-41e8-b051-e8728c043bde'
            }
        ]
    },
    {
        institution: 'Museo Civico di Storia Naturale di Ferrara',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/8911421f-77aa-4c30-8104-42144ecd7414'
            }
        ]
    },
    {
        institution: 'Museum Koenig Bonn Leibniz Institute for Analysis of Biodiversity Change',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/ddbfbe7f-0022-42f5-8d91-dba11a9989b3'
            }
        ]
    },
    {
        institution: 'Museum of Zoology of Vilnius University',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/89fe73b4-f7b2-456b-9fe8-7c3be00d905d'
            }
        ]
    },
    {
        institution: 'National Museums Scotland',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/8dc00d05-f4bb-4e20-8cb9-295a55336e69'
            }
        ]
    },
    {
        institution: 'Natural History Collection University of Tartu',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/dbc0a132-5aaa-4b09-a49d-16a4a2aaf20d'
            }
        ]
    },
    {
        institution: 'Natural History Museum of Denmark',
        dataCoverage: 'General entomological collection and Bombus subcollection - Europe.',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/1caa6488-5c47-4bed-8258-23155b269bd3'
            }
        ]
    },
    {
        institution: 'Naturalis Biodiversity Center',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/c05a365e-880d-40bb-b528-f75024b2e0e6'
            }
        ]
    },
    {
        institution: 'Royal Belgian Institute of Natural Sciences',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/e9d2c520-d9fc-4331-9ed8-73bea2b22af0'
            }
        ]
    },
    {
        institution: 'Royal museum for Central Africa',
        dataCoverage: 'General entomological collection and Pieridae subcollection - Europe.',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/e520659d-a58c-46bb-84cf-48613a3673af'
            }
        ]
    },
    {
        institution: 'Senckenberg Museum of National History Gorlitz',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/2be41326-50e7-4115-bbe1-023181ec4780'
            }
        ]
    },
    {
        institution: 'State Museum of Natural History',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/7f6438b9-fe77-41f3-8858-155f3c18690b'
            }
        ]
    },
    {
        institution: 'Tel Aviv University - Steinhardt Museum of Natural History',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Pieridae, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/fa140a6d-a1cd-46ea-95b9-1980418eb908'
            }
        ]
    },
    {
        institution: 'Sede della Specola del Museo di Storia Naturale di Firenze',
        dataCoverage: 'General entomological collection and pollinator-focused subcollections (Bombus, Platycheirus).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/09eb17a2-b14c-4c0b-93ee-ed178546b968'
            }
        ]
    },
    {
        institution: 'Museu Nacional de Historia Natural e da Ciencia',
        project: 'ARCADE project',
        dataCoverage: 'General entomological collection and Portuguese pollinator subcollections (Apoidea, Syrphidae, Papilionoidea).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/40091655-14a3-4558-a7b8-640e2e156a92'
            }
        ]
    },
    {
        institution: 'Museu de Historia Natural e da Ciencia da Universidade do Porto',
        project: 'ARCADE project',
        dataCoverage: 'General entomological collection and Portuguese pollinator subcollections (Apoidea, Syrphidae, Papilionoidea).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/68783460-2ade-4590-8075-b66d8f8ce2c2'
            }
        ]
    },
    {
        institution: 'University of Madeira',
        project: 'ARCADE project',
        dataCoverage: 'General entomological collection and Portuguese pollinator subcollections (Apoidea, Syrphidae, Papilionoidea).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/e05728e5-e180-49ef-b65b-18dd03cc1758'
            }
        ]
    },
    {
        institution: 'CFE - Centre for Functional Ecology, University of Coimbra',
        project: 'ARCADE project',
        dataCoverage: 'General entomological collection and Portuguese pollinator subcollections (Apoidea, Syrphidae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/6a250fb5-6de7-4f1d-9843-db5f3182850c'
            }
        ]
    },
    {
        institution: 'University of Navarra',
        project: 'INC-STEP project',
        dataCoverage: 'General entomological collection and Spanish pollinator subcollections (Bombus, Colletes, Xylocopa, Eristalinae, Papilionidae, Hesperiidae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/4e9836ac-5b95-46af-a9bb-455e0625b3d7'
            }
        ]
    },
    {
        institution: 'Museo Nacional de Ciencias Naturales (MNCN-CSIC)',
        project: 'INC-STEP project',
        dataCoverage: 'General entomological collection and Spanish pollinator subcollections (Bombus, Colletes, Xylocopa, Eristalinae, Papilionidae, Hesperiidae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/983b9e39-37ca-49e9-a834-d306f88984bd'
            }
        ]
    },
    {
        institution: 'Museu de Ciencies Naturals de Barcelona',
        project: 'INC-STEP project',
        dataCoverage: 'General entomological collection and Spanish pollinator subcollections (Bombus, Colletes, Xylocopa, Eristalinae, Papilionidae, Hesperiidae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/85408065-e13c-4503-967e-6a547fe8497d'
            }
        ]
    },
    {
        institution: 'Universidad Complutense de Madrid',
        project: 'INC-STEP project',
        dataCoverage: 'General entomological collection and Spanish pollinator subcollections (Bombus, Colletes, Xylocopa, Eristalinae, Papilionidae, Hesperiidae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/a6ded141-166b-4828-a57e-128ef98cf0ba'
            }
        ]
    },
    {
        institution: 'Museu de la Universitat de Valencia d Historia Natural (MUVHN)',
        project: 'INC-STEP project',
        dataCoverage: 'General entomological collection and Spanish pollinator subcollections (Bombus, Xylocopa, Eristalinae, Papilionidae, Hesperiidae).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/30f14fc9-9bfc-4f8d-ae8e-29a3a5f832c8'
            }
        ]
    },
    {
        institution: 'Natural History Museum of Montenegro',
        project: 'Balkan PolliS project',
        dataCoverage: 'General entomological collection and Syrphidae subcollection - Balkans.',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/59a8755c-9ca4-47fa-a2e0-7b854714532e'
            }
        ]
    },
    {
        institution: 'University of Novi Sad - Faculty of Sciences, Department of Biology and Ecology',
        project: 'Balkan PolliS project',
        dataCoverage: 'General entomological collection and Syrphidae-focused subcollections (Syrphidae, Cheilosia, Merodon).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/59093a0f-9471-4182-9e56-455d9ce85672'
            }
        ]
    },
    {
        institution: 'University of the Aegean',
        project: 'Balkan PolliS project',
        dataCoverage: 'General entomological collection and Balkans pollinator subcollections (Syrphidae, Apoidea).',
        links: [
            {
                label: 'collection data',
                url: 'https://scientific-collections.gbif.org/collection/d192e26e-6fc8-46d0-b295-da98474e93b9'
            }
        ]
    }
];

import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';

// URL to the TopoJSON world map
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const europeanCountries = [
  "Albania",
  "Andorra",
  "Austria",
  "Belarus",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Kosovo",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "San Marino",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Ukraine",
  "United Kingdom",
  "Vatican City",
];

const africanCountries = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Ivory Coast",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
];

const antarctica = ["Antarctica"];

const asiaTemperateCountries = [
  "China",
  "Japan",
  "Mongolia",
  "North Korea",
  "South Korea",
  "Taiwan",
];

const asiaTropicalCountries = [
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Cambodia",
  "India",
  "Indonesia",
  "Laos",
  "Malaysia",
  "Maldives",
  "Myanmar",
  "Nepal",
  "Pakistan",
  "Philippines",
  "Singapore",
  "Sri Lanka",
  "Thailand",
  "Timor-Leste",
  "Vietnam",
];

const australasianCountries = [
  "Australia",
  "New Zealand",
  "Papua New Guinea",
  "Fiji",
  "Solomon Islands",
  "Vanuatu",
  "Samoa",
  "Tonga",
  "Kiribati",
  "Micronesia",
  "Palau",
  "Marshall Islands",
  "Nauru",
  "Tuvalu",
];

const northAmericanCountries = [
  "Canada",
  "United States",
  "Mexico",
  "Guatemala",
  "Belize",
  "Honduras",
  "El Salvador",
  "Nicaragua",
  "Costa Rica",
  "Panama",
  "Bahamas",
  "Cuba",
  "Jamaica",
  "Haiti",
  "Dominican Republic",
  "Barbados",
  "Saint Lucia",
  "Grenada",
  "Saint Vincent and the Grenadines",
  "Saint Kitts and Nevis",
  "Antigua and Barbuda",
  "Dominica",
  "Trinidad and Tobago",
];

const southAmericanCountries = [
  "Argentina",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Guyana",
  "Paraguay",
  "Peru",
  "Suriname",
  "Uruguay",
  "Venezuela",
];

const pacificIslands = [
  "Fiji",
  "Kiribati",
  "Marshall Islands",
  "Micronesia",
  "Nauru",
  "Palau",
  "Papua New Guinea",
  "Samoa",
  "Solomon Islands",
  "Tonga",
  "Tuvalu",
  "Vanuatu",
];

const worldMarine = [
  "Arctic Ocean",
  "Indian Ocean",
  "Southern Ocean",
  "North Atlantic: unknown",
  "North Atlantic: deep sea",
  "North Atlantic: shelf area & adjacent sea",
  "South Atlantic: unknown",
  "South Atlantic: deep sea",
  "South Atlantic: shelf area & adjacent seas",
  "North Pacific: unknown",
  "North Pacific: deep sea",
  "North Pacific: shelf area & adjacent seas",
  "South Pacific: unknown",
  "South Pacific: deep sea",
  "South Pacific: shelf area & adjacent seas",
];

const worldUnknown = ["World/NA"];

const allRegions = {
  Europe: europeanCountries,
  Africa: africanCountries,
  Antarctica: antarctica,
  AsiaTemperate: asiaTemperateCountries,
  AsiaTropical: asiaTropicalCountries,
  Australasia: australasianCountries,
  NorthAmerica: northAmericanCountries,
  SouthAmerica: southAmericanCountries,
  PacificIslands: pacificIslands,
  WorldMarine: worldMarine,
  WorldUnknown: worldUnknown,
};

interface Props {
  region: Array<string> | null;
}

/**
 * Component that renders a details block for on the taxonomic service page
 * @param properties An object containing all the properties to be show in the details block
 * @returns JSX Component
 */
const WorldMap = (props: Props) => {
  const { region } = props;
  console.log("Region: ", region);
  let selectedRegion: string[] = [];
  if (region) {
    for (const r of region) {
      if (r in allRegions) {
        selectedRegion = selectedRegion.concat(allRegions[r as keyof typeof allRegions]);
      }
    }
  }
  console.log("Selected region: ", selectedRegion);
  return (
    <div className="map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
        }}
        width={800}
        height={300}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
                return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                  region && selectedRegion?.includes(geo.properties.name)
                    ? "#7ba9dc"
                    : "#EAEAEC"
                  } // Fill the selected region with blue, others with gray
                  stroke="#D6D6DA"
                />
                );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

// URL to the TopoJSON world map
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

const europeanCountries = [
  "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herz.",
  "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland",
  "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy",
  "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
  "Moldova", "Monaco", "Montenegro", "Netherlands", "Macedonia", "Norway",
  "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia",
  "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom",
  "Vatican"
];

const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
  "Cameroon", "Cape Verde", "Central African Rep.", "Chad", "Comoros",
  "Congo", "Côte d'Ivoire", "Dem. Rep. Congo", "Djibouti", "Egypt",
  "Eq. Guinea", "Eritrea", "eSwatini", "Ethiopia", "Gabon", "Gambia",
  "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia",
  "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
  "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
  "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone",
  "Somalia", "South Africa", "S. Sudan", "Sudan", "Tanzania", "Togo",
  "Tunisia", "Uganda", "Zambia", "Zimbabwe"
];

const antarctica = ["Antarctica"];

const asiaTemperateCountries = [
  "China", "Japan", "Mongolia", "North Korea", "South Korea", "Taiwan"
];

const asiaTropicalCountries = [
  "Bangladesh", "Bhutan", "Brunei", "Cambodia", "India", "Indonesia", "Laos",
  "Malaysia", "Maldives", "Myanmar", "Nepal", "Pakistan", "Philippines",
  "Singapore", "Sri Lanka", "Thailand", "Timor-Leste", "Vietnam"
];

const australasianCountries = [
  "Australia", "New Zealand", "Papua New Guinea", "Fiji", "Solomon Is.",
  "Vanuatu", "Samoa", "Tonga", "Kiribati", "Micronesia", "Palau",
  "Marshall Islands", "Nauru", "Tuvalu"
];

const northAmericanCountries = [
  "Canada", "United States of America", "Mexico", "Guatemala", "Belize",
  "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Bahamas",
  "Cuba", "Jamaica", "Haiti", "Dominican Rep.", "Barbados", "Saint Lucia",
  "Grenada", "Saint Vincent and the Grenadines", "Saint Kitts and Nevis",
  "Antigua and Barbuda", "Dominica", "Trinidad and Tobago"
];

const southAmericanCountries = [
  "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana",
  "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"
];

const pacificIslands = [
  "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "Palau",
  "Papua New Guinea", "Samoa", "Solomon Is.", "Tonga", "Tuvalu", "Vanuatu"
];

const marineMarkers: { name: string; coordinates: [number, number] }[] = [
  { name: "Arctic Ocean", coordinates: [0, 85] },
  { name: "Indian Ocean", coordinates: [80, -20] },
  { name: "Southern Ocean", coordinates: [0, -60] },
  { name: "North Atlantic: unknown", coordinates: [-40, 45] },
  { name: "North Atlantic: deep sea", coordinates: [-30, 40] },
  { name: "North Atlantic: shelf area & adjacent sea", coordinates: [-10, 50] },
  { name: "South Atlantic: unknown", coordinates: [-20, -20] },
  { name: "South Atlantic: deep sea", coordinates: [-10, -30] },
  { name: "South Atlantic: shelf area & adjacent seas", coordinates: [0, -20] },
  { name :"Pacific", coordinates: [-100, 0] },
  { name: "North Pacific: unknown", coordinates: [-150, 30] },
  { name: "North Pacific: deep sea", coordinates: [-160, 20] },
  { name: "North Pacific: shelf area & adjacent seas", coordinates: [-140, 35] },
  { name: "South Pacific: unknown", coordinates: [-130, -20] },
  { name: "South Pacific: deep sea", coordinates: [-120, -30] },
  { name: "South Pacific: shelf area & adjacent seas", coordinates: [-110, -25] },
];

const worldUnknown = ["World/NA"];

// fix the type of allRegions
const allRegions = {
  Europe: europeanCountries,
  Africa: africanCountries,
  Antarctica: antarctica,
  "Asia Temperate": asiaTemperateCountries,
  "Asia Tropical": asiaTropicalCountries,
  Australasia: australasianCountries,
  "North America": northAmericanCountries,
  "South America": southAmericanCountries,
  "Pacific Islands": pacificIslands,
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
  let selectedRegion: string[] = [];

  if (region) {
    for (const r of region) {
      if (r in allRegions) {
        selectedRegion = selectedRegion.concat(allRegions[r as keyof typeof allRegions]);
      }
    }
  }

  const selectedMarineMarkers = marineMarkers.filter(marker => region?.includes(marker.name));
  
  return (
    <div className="map-container" style={{
            backgroundColor: region?.includes("World Marine") ? "#b3d1ff" : "transparent", // Light blue for marine
            padding: "1rem", // optional styling
            borderRadius: "0.5rem", // optional styling
          }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 70,
        }}
        width={900}
        height={400}
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
        {selectedMarineMarkers.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={10} fill="#7ba9dc" stroke="#fff" strokeWidth={1} />
            <text
              textAnchor="middle"
              y={-10}
              style={{ fontFamily: "system-ui", fill: "#333", fontSize: 40 }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
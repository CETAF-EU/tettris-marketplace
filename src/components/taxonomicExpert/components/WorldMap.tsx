import React from 'react';
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

const WorldMap: React.FC = () => {
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
                  fill={europeanCountries.includes(geo.properties.name) ? "#7ba9dc" : "#EAEAEC"} // Fill Europe with blue, others with gray
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
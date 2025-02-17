import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

// URL to the TopoJSON world map
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

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
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#7BC1DC"
              />
            ))
          }
        </Geographies>

        {/* Example Marker */}
        <Marker coordinates={[-74.006, 40.7128]}>
          <circle r={5} fill="#FF5533" />
          <text
            textAnchor="middle"
            y={-10}
            style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}
          >
            Here
          </text>
        </Marker>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
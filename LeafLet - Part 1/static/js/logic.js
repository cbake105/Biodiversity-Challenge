// Initialize the map object
const map = L.map('map', {
    center: [45.52, -110.67],
    zoom: 4
});

// Create and add a tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    foo: 'bar',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL for GeoJSON data
const GEOJSON_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine the color based on earthquake depth
const getColor = (depth) => {
    if (depth > 90) return '#EA2C2C';
    else if (depth > 70) return '#EA822C';
    else if (depth > 50) return '#EE9C00';
    else if (depth > 30) return '#EECC00';
    else if (depth > 10) return '#D4EE00';
    else return '#98EE00';
};

// Function to determine the radius of the circle marker based on magnitude
const getRadius = (magnitude) => magnitude === 0 ? 1 : magnitude * 4;

// Fetch and process GeoJSON data
d3.json(GEOJSON_URL).then((data) => {
    // Create a GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng),
        style: feature => ({
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`
                <h3>Location: ${feature.properties.place}</h3>
                <h4>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</h4>
                <br>Time: ${new Date(feature.properties.time)}
            `);
        }
    }).addTo(map);

    // Set up and add the legend to the map
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [-10, 10, 30, 50, 70, 90];
        grades.forEach((grade, i) => {
            div.innerHTML += `
                <i style='background: ${getColor(grade + 1)}'></i> 
                ${grade}${grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : '+'}
            `;
        });
        return div;
    };

    legend.addTo(map);
});


// URL for D3 Library
const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch data from URL 
async function fetchData() {
    const response = await d3.json(URL);
    return response;
}

// Display Metadata 
function SampleMetadata(sample, data) {
    const metadata = data.metadata;
    const result = metadata.find(sampleObj => sampleObj.id == sample);
    
    const panelBody = d3.select("#sample-metadata");
    panelBody.html("");

    for (const key in result) {
        panelBody.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    }
}


function buildCharts(sample, data) {
    const samples = data.samples;
    const result = samples.find(sampleObj => sampleObj.id == sample);
    const { otu_ids, otu_labels, sample_values, wfreq } = result;

    // Bar chart
    const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const barChart = [{
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    const barLayout = {
        title: "Top 10 Operational Taxonomic Units",
        margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barChart, barLayout);

    // Bubble chart
    const bubbleChart = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    }];
    const bubbleLayout = {
        title: "Operational Taxonomic Units per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU IDs" },
        margin: { t: 30 }
    };
    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);
}

function buildGauge(wfreq) {
    
}

// Initialize dashboard
async function Dashboard() {
    const selector = d3.select("#selDataset");
    const data = await fetchData();
    const sampleNames = data.names;

    sampleNames.forEach(name => {
        selector.append("option").text(name).property("value", name);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample, data);
    SampleMetadata(firstSample, data);
    buildGauge(firstSample);
}

function OptionChanged(newSample) {
    fetchData().then(data => {
        buildCharts(newSample, data);
        SampleMetadata(newSample, data);
        buildGauge(newSample);
    });
}

// Call function to initialize the dashboard
Dashboard();

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    console.log(metadata);

    // Filter the metadata for the object with the desired sample number
    let filteredID = metadata.filter(item => item.id == sample)[0];
    console.log(filteredID);

    // Use d3 to select the panel with id of `#sample-metadata`
    let demoPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    demoPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredID).forEach((item) => {
      demoPanel.append("p").text(item[0] + ": " + item[1])
    })

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.filter(item => item.id == sample)[0];
    console.log(filteredSample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSample.otu_ids;
    let otu_labels = filteredSample.otu_labels
    let sample_values = filteredSample.sample_values

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    let bubble_layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title: "OTU ID"},
      yaxis:{title: "Number of Bacteria"},
      height: 500,
      width: 1200
    };

    let bubble_data = [bubble_trace];

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let topOTU = otu_ids.slice(0,10).reverse();
    let idMap = topOTU.map(item => "OTU " + item);


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_trace = {
      x: sample_values.slice(0,10).reverse(),
      y: idMap,
      text: otu_labels.slice(0,10),
      type: "bar",
      orientation: "h"
      };

    let bar_data = [bar_trace];

    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"},
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", bar_data, bar_layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value");
    });

    // Get the first sample from the list
    buildMetadata(names[0]);
    console.log(names[0]);

    // Build charts and metadata panel with the first sample
    buildCharts(names[0]);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    buildGauge(result.wfreq)
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = allSamples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var selectedSample = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
     var forIds = selectedSample.otu_ids;
     var forLabels = selectedSample.otu_labels;
     var forValues = selectedSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = forIds.slice(0, 10);
    var desYticks = yticks.map(otu_id => 'OTU '+ otu_id).reverse();
    
    // 8. Create the trace for the bar chart. 
    var barData = [ {
      x: forValues.slice(0, 10).reverse(),
      y: desYticks,
      text: forLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    // 1. Create the trace for the bubble chart.
     var bubbleData = [ {
    x: forIds,
    y: forValues,
    text: forLabels,
    mode: "markers",
    marker: {
      size: forValues, 
      color: forIds,
      colorscale: "Earth"
    }

     }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    xaxis: {title: "OTU ID"}
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
  });
}

function buildGauge(wfreq) { 
var data = [{
  value: wfreq,
  type: "indicator",
  domain: {x:[0, 1], y:[0, 1]}, 
  mode: "gauge+number",
  gauge: {
    axis: {range: [null, 10], tickmode: "linear"},
    threshold: {
      line: {width: 7},
      value: wfreq
    },
    steps: [
      {range: [0, 1], color: 'red'},
      {range: [1, 2], color: 'red'},
      {range: [2, 3], color: 'orange'},
      {range: [3, 4], color: 'orange'},
      {range: [4, 5], color: 'yellow'},
      {range: [5, 6], color: 'yellow'},
      {range: [6, 7], color: 'lime'},
      {range: [7, 8], color: 'lime'},
      {range: [8, 9], color: 'darkgreen'},
      {range: [9, 10], color: 'darkgreen'},
    ]
  }
}] 
var layout = {
  width: 450, height: 350,
  title: "Belly Button Washing Frequency",
}
Plotly.newPlot("gauge", data, layout)
}

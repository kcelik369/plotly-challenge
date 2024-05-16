// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    const meta = data['metadata'];

    // Filter the metadata for the object with the desired sample number
    const sampleObj = meta.filter((m) => m.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key of Object.keys(sampleObj)) {
      panel.append('p').text(`${key}: ${sampleObj[key]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    const samples = data['samples'];

    // Filter the samples for the object with the desired sample number
    const sampleObj = samples.filter((s) => s.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = sampleObj['otu_ids'];
    const otu_labels = sampleObj['otu_labels'];
    const sample_values = sampleObj['sample_values'];

    // Build a Bubble Chart
    const layout = {
      title: 'Bacteria Cultures per Sample',
      height: 600,
      width: 1200,
      xaxis: { title: { text: 'OTU ID' } },
      yaxis: { title: { text: 'Number of Bacteria' } }
    };
    const plot_data = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [plot_data], layout);

    // Create list of consolidated objects for the current sample based on OTUs
    const otus = [];
    for (let i = 0; i < otu_ids.length; i++) {
      otus.push({
        id: otu_ids[i],
        value: sample_values[i],
        label: otu_labels[i]
      })
    }

    // get top ten OTUs by sample value; reverse for graph ordering
    const top10 = otus.sort((a, b) => b['value'] - a['value']).slice(0,11).reverse();

    // map out x values and y ticks
    const yticks = top10.map((otu) => "OTU " + otu['id'].toString());
    const x = top10.map((otu) => otu.value);

    // Build a Bar Chart
    const bar_layout = {
      y: yticks,
      x: x,
      type: 'bar',
      orientation: 'h',
      title: 'Top 10 Bacteria Cultures Found'
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [bar_layout]);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data)
    // Get the names field
    const names = data['names'];

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    for (let name of names) {
      dropdown.append('option').text(name); // .value(name)
    }

    // Get the first sample from the list
    const first = dropdown.property('value');

    // Build charts and metadata panel with the first sample
    buildCharts(first);
    buildMetadata(first);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

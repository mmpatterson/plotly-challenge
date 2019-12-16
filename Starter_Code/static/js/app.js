filePath = 'samples.json';

var fileData;

// Load in data from csv
d3.json(filePath).then(info => {
    fileData = info;
    console.log('Printing filePath data:');
    console.log(fileData);
    console.log('Names:');
    console.log(fileData.names);
    d3.selectAll("body").on("change", init());
});

/*
* Function initializes the data that appear in the dropdown
*/
function init() {
    var dropNames = fileData.names;
    // console.log('Printing dropNames:')
    // console.log(dropNames);
    var selector = d3.select("#selDataset");
    dropNames.forEach(individual => {
        selector
            .append("option")
            .text(individual)
            .property("value", individual);
    });
    optionChanged(fileData.names[0]);
}
   


/*
* Function populates the Demographic Information cell
*/
function metaData(subject) {
    // Demographic Info
    var sampleMeta = fileData.metadata.filter(obj => obj.id == subject)[0];
    // console.log(sampleMeta);
    var selection = d3.select('#sample-metadata');
    selection.html("");
    Object.entries(sampleMeta).forEach(([key, value]) => {
        selection.append('div').text(`${key}: ${value}`)
    })
}

/*
* Creates the horizontal bar chart and the bubble chart
*/
function buildPlot(subject) {
        //  console.log("The Data:")
        //  console.log(fileData);
         var individual = fileData.samples.filter(tester => tester.id == subject)[0];
        //  Get the top 10 OTUs
         var otuIDS = individual.otu_ids.slice(0,10);
         otuIDSString = otuIDS.map(d => "OTU " + d);
        //  console.log('OTU IDs:');
        //  console.log(otuIDS);

        // Flip the top 10 so that #1 appears first
         var sampleValues = individual.sample_values.slice(0,10).reverse();
        //  console.log('Sample Values:');
        //  console.log(sampleValues);

        // Flip the labels so #1 appears first
         var otuLabels = individual.otu_labels.slice(0,10).reverse();
        //  console.log('OTU Labels:');
        //  console.log(otuLabels);

        // Create Horizontal Bar Chart trace
         var trace1 = {
             type: "bar",
             x: sampleValues,
             y: otuIDSString,
             text: otuLabels,
             marker: {
                // Picked seafoam green because I like it 
                color: 'rgb(113, 238, 184)'
             },
             orientation: 'h'
         };

        //  Put the data in an array
         var data = [trace1];

        //  Define the layout
         var layout = {
             title: 'Bar Char of Top OTUs',
             height: 600,
             width: 400,
             xaxis: {title:'Count'
             },
             yaxis: {title:'OTU ID'
             }
         };

        // Create the bar chart
         Plotly.newPlot("bar", data, layout);


         
        // Create Bubble Chart trace
        var trace2 = {
            x: individual.otu_ids,
            y: individual.sample_values,
            mode: 'markers',
            marker: 
            {
                size: individual.sample_values,
                // Define scaled bubble size (idea taken from Plotly website)
                sizeref: 2.0 * Math.max(individual.sample_values) / (100**2),
                color: individual.otu_ids
            }
        }

        // Put the data in a array
        var dataBubble = [trace2];

        // Create layout
        var layout = {
            title: 'OTU Bubble Chart',
            showlegend: false,
            // Define height by the max value
            height: 2 * Math.max(individual.sample_values),
            // Define width by the max value
            width: Math.max(individual.otu_ids),
            xaxis: {title:'OTU Number'
             },
             yaxis: {title:'Count'
             }
          };

        // Plot data
        Plotly.newPlot("bubble", dataBubble, layout);
}
        
// Function to run when data changes (used above)
function optionChanged(sample) {
    metaData(sample);
    buildPlot(sample);

}

// Initialize data
init();
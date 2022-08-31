

console.log("test")
// CSV2JSON
const csv = `album, year, US_peak_chart_post
The White Stripes, 1999, -
De Stijl, 2000, -
White Blood Cells, 2001, 61
Elephant, 2003, 6
Get Behind Me Satan, 2005, 3
Icky Thump, 2007, 2
Under Great White Northern Lights, 2010, 11
Live in Mississippi, 2011, -
Live at the Gold Dollar, 2012, -
Nine Miles from the White City, 2013, -`;

    const json = CSVJSON.csv2json(csv, {parseNumbers: true});
    console.log(json);



// Opening JSON file
fetch("./data_en.json")
.then(response => {
   return response.json();
})
.then((jsondata) => {
    // Selecting data
    console.log("jsondata")
    console.log(jsondata)
   
    let data_string = []
    for (let x of jsondata) {
        data_string += x["Max Temp (�C)"]  + ","
    }
    console.log("data_string")
    console.log(data_string)

    // String to array
    data_array = data_string.split(",")
    
    console.log("data_array")
    console.log(data_array)
    


    // Graphic (Chart.js)
    const labels = Object.keys(data_array)
    const data = {
        labels: labels,
        datasets: [{
            label: "temp",
            backgroundColor: 'rgb(255, 99, 132)',
            data: data_array,
        }]
    }

    const config = {
        type: "line",
        data: data,
        options: {}
    };

    const mtChart = new Chart(
        document.getElementById("myChart"),
        config
    );
});






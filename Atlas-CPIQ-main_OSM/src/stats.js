// Opening JSON file

function yearSelection(yearID) {


  //year = '2019'
  
  fetch(`./data/CYUL ${yearID}_EN.json`)
  .then(response => {
     return response.json();
  })
  .then((jsondata) => {
      // Selecting data
  
      // Generate a string of strings
      let data_string = []
      for (let x of jsondata) {
          data_string += x["Max Temp (�C)"]  + ","
      }
  

  
      // Generate an array of strings
      var data_array = data_string.split(",")
  
  
      // Array to use for graphs and not for stats (NaNs do not work in stats)
  

  
      // Replace undefined data by NaNs 
      function getAllIndexes(arr, val) {
          var indexes = [], i;
          for(i = 0; i < arr.length; i++)
              if (arr[i] === val)
                  indexes.push(i);
          return indexes;
      }
  
      var indexes = getAllIndexes(data_array, "");
  
      function myFunction(item, index) {
          if (item !== -1) {
              data_array[item] = NaN;
          }
      }
      indexes.forEach(myFunction);
  
      
  
      // Array to use for stats and not graphs (NaNs are removed and it changes the index/value order)
  
  
      
      // // Generate an array of numbers
      var arrOfNum = data_array.map(str => {
          return Number(str);
      })
  
  
      // Data arranged by months (must be done before removing NaNs otherwise days and values will be out of sync)
  
      // Done automatically
      
      // Date array
      var getDateArray = function(start, end) {
  
      var
        arr = new Array(),
        dt = new Date(start);
    
      while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
      }
  
  
      var startDate = new Date("2019-01-01"); //YYYY-MM-DD
      var endDate = new Date("2019-12-31"); //YYYY-MM-DD
  
      var yearData = getDateArray(startDate, endDate)
  
      
  
  
  
      // Generate a string of strings
      var month = [];
      for (let i = 0; i < yearData.length; i++) {
          month += yearData[i].getMonth() + 1 + ',';
      };
  
  
      // Generate an array of strings
      var monthNum = month.split(",");
  
      // Generate an array of numbers
      var monthArray = monthNum.map(str => {
          return Number(str);
      });
  

  
      var Data_month = [], i = -1
      for ( var i = 0; i < arrOfNum.length; i++ ) {
          Data_month.push( [ arrOfNum[i], monthArray[i] ] );
        }
  
      const cols = [1];
  
  
  
      const januaryData = Data_month.filter((x) => x[1] === 1);
      const january = januaryData.map(x => x[0]);
  
      const februaryData = Data_month.filter((x) => x[1] === 2);
      const february = februaryData.map(x => x[0]);
  
      const marchData = Data_month.filter((x) => x[1] === 3);
      const march = marchData.map(x => x[0]);
  
      const aprilData = Data_month.filter((x) => x[1] === 4);
      const april = aprilData.map(x => x[0]);
  
      const mayData = Data_month.filter((x) => x[1] === 5);
      const may = mayData.map(x => x[0]);
  
      const juneData = Data_month.filter((x) => x[1] === 6);
      const june = juneData.map(x => x[0]);
  
      const julyData = Data_month.filter((x) => x[1] === 7);
      const july = julyData.map(x => x[0]);
  
      const augustData = Data_month.filter((x) => x[1] === 8);
      const august = augustData.map(x => x[0]);
  
      const septemberData = Data_month.filter((x) => x[1] === 9);
      const september = septemberData.map(x => x[0]);
  
      const octoberData = Data_month.filter((x) => x[1] === 10);
      const october = octoberData.map(x => x[0]);
  
      const novemberData = Data_month.filter((x) => x[1] === 11);
      const november = novemberData.map(x => x[0]);
  
      const decemberData = Data_month.filter((x) => x[1] === 12);
      const december = decemberData.map(x => x[0]);
      
      
  
  
  
  
      // remove NaNs for the stats
  
      
  
      var statArray = arrOfNum.filter(function(value) {
          return !isNaN(parseFloat(value)) && isFinite(value);
      });
  
  
  
      // sum and average (can be done with mathjs via nmp)
  
      const sum = statArray.reduce((a, b) => a + b, 0);
      const avg = (sum / statArray.length) || 0;
  
  
  
  
      // Graphic (Chart.js)
  
  /*
      let chartStatus = Chart.getChart("analyseCanvas"); // <canvas> id
      if (chartStatus != undefined) {
          chartStatus.destroy();
      }
      
      */

  });
  };



function makeGraphic(allData) {
  let labels = Object.keys(allData)
  labels = labels.map(str => {
    return Number(str) + 1;
})


  const data = {
      labels: labels,
      datasets: [{
          label: "temp",
          backgroundColor: 'rgb(255, 0, 0)',
          borderColor: 'rgb(255, 0, 0)',
          data: allData,
          tension: 0.4,
          fill: {
            target: 'origin',
            below: 'rgb(0, 0, 255)',
            above: 'rgb(255, 0, 0)'
          }               
      }]
  }

  const config = {
      type: "line",
      data: data,
      options: {
        responsive: false
      }
  };

  new Chart(
    document.getElementById("analyseCanvas"),
    config
  );
};


function makePie(dataArray) {


  const data = {
      labels: ['D', 'MF', 'Mpi', 'MT', 'MA', 'Mp0', 'F', 'U', 'i'],
      datasets: [{
          label: "temp",
          backgroundColor: [
            'rgb(0, 0, 120)',
            'rgb(0, 0, 160)',
            'rgb(0, 0, 200)',
            'rgb(0, 0, 240)',
            'rgb(200, 0, 0)',
            'rgb(240, 0, 0)',
            'rgb(0, 200, 0)',
            'rgb(0, 240, 0)',
            'rgb(200, 200, 200)',
          ],
          data: dataArray,   
          datalabels: {
            anchor: 'end',
            align: 'end',
          }            
      }]
  }

  const config = {
      type: "pie",
      
      data: data,
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: true,
            anchor: 'end',
            align: 'end',
            color: 'rgb(0, 240, 0)',
            backgroundColor: 'rgba(200, 0, 0, 0.75)',
            formatter: value => `${Math.round(value / sum * 100)}%`,
            labels: {
              color: 'rgb(255, 99, 132)',
              title: {
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            }
          }
        }
      }
  };


  new Chart(
    document.getElementById("analyseCanvas"),
    config
  );
};




async function getXMLinfo(modelVariable) {
  const parser = new DOMParser();

  let response = await fetch(`https://geo.weather.gc.ca/geomet/?LANG=en&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&LAYERS=${modelVariable}`)
  let data = await response.text().then(
    data => {
      let xml = parser.parseFromString(data, 'text/xml');
      console.log("INFO")
      console.log(xml.getElementsByTagName('Dimension')[0].innerHTML.split('/'))
      let [start, end, timestep] = xml.getElementsByTagName('Dimension')[0].innerHTML.split('/');
      console.log(start)
      console.log(end)
      console.log(timestep)

      let default_ = xml.getElementsByTagName('Dimension')[0].getAttribute('default');
      return [start, end, timestep, default_];
    }
  )

  
  return [new Date(data[0]), new Date(data[1]), data[2], new Date(data[3])];
  
}





function updateLayers(layer, currentTime) {
  layer.getSource().updateParams({'TIME': currentTime.toISOString().split('.')[0]+"Z"});
}




function setTime() {
  currentTime = new Date(currentTime);
  currentTime.setHours(currentTime.getHours() + timestep);
  updateLayers();
}


function setBackTime() {
  if (currentTime >= endTime) {
    currentTime = endTime;
  } else {
    currentTime = new Date(currentTime);
    currentTime.setHours(currentTime.getHours() - timestep);
  }
  updateLayers();
}


function stepForward(layer, layerName, currentTime) {
  getXMLinfo(layerName).then((data) => {
    let startTime = data[0];
    let endTime = data[1];
    let preTimeStep = data[2];
    let defautTime = data[3];

    let timeStepString = preTimeStep.replace(/[^\d]/g,'');
    let timestep = parseInt(timeStepString);

    if (currentTime < endTime || currentTime == null) {
      currentTime = new Date(currentTime);
      currentTime.setHours(currentTime.getHours() + timestep);
      updateLayers(layer, currentTime);
      console.log("LKLKL")
      console.log(currentTime)
    } else {
      currentTime = currentTime
    }
  })


}


function stepBackward(modelVariable) {
  getXMLinfo(modelVariable).then((data) => {
    startTime = data[0];
    endTime = data[1];
    preTimeStep = data[2];
    timeStepString = preTimeStep.replace(/[^\d]/g,'');

    if (currentTime > startTime) {
      currentTime = new Date(currentTime);
      currentTime.setHours(currentTime.getHours() - timestep);
      updateLayers();
    } else {
      currentTime = currentTime
    }
  })
}






function retrieveData(stationID, variable, firstYear, lastYear) {
  return new Promise(function (resolve, reject) {

  
  //let monthOrPeriod = event.target.id;
  
  
  // Construct array of path to data files
  let yeardifference = lastYear - firstYear
  yeardifference = yeardifference + 1

 
  
  //let startYear = 2002 //Correspond to oldest year of data files
  
  //let myString = myString.replace(/\D/g,'');
  let allYears = Array.from(Array(yeardifference).keys())

  let period = []
 

  for (var i = 0; i < allYears.length; i++) {
      period += Number(allYears[i]) + Number(firstYear) + ","
  }
 
  
  // Create array of strings
  period = period.split(",")
  period = period.splice(0, period.length-1); // Remove the last empty item due to "," in the for loop

  
  // Create array of numbers
  period = period.map(str => {
      return Number(str);
  })
  
  
  
  let urls = []
  for (var i = 0; i < period.length; i++) {
    urls += `./data/meteo/${stationID}/${stationID} ${period[i]}_EN.json` + ','
  }

  // utiliser NODE.JS/ require pour acceder aux fichiers
 

  
  urls = urls.split(",")
  urls = urls.splice(0, urls.length-1);

  
  
  
  
  // // Load geoJSON data from every files
  
  Promise.all(urls.map(u=>fetch(u).then(responses => responses.json())
      )
  
  ).then(data => {
      let loadedData = data.flat();
  
  
  
  // Test pour mettre la recherche d'une variable dans une fonction //
    
  
      let dataArray = []
      for (let x of loadedData) {
        dataArray += x[variable] + "," 
      }
      dataArray = dataArray.split(",")
      dataArray = dataArray.splice(0, dataArray.length-1);



      function getAllIndexes(arr, val) {
        var dataIndexes = [], i;
        for(var i = 0; i < arr.length; i++)
            if (arr[i] === val)
            dataIndexes.push(i);
        return dataIndexes;
      }




      var dataIndexes = getAllIndexes(dataArray, "");
    
      function insertNaN(item, index) {
        if (item !== -1) {
          dataArray[item] = NaN;
        }
      }
      dataIndexes.forEach(insertNaN);

      dataArray = dataArray.map(str => {
        return Number(str);
      });

     
      resolve(dataArray)
      reject("error")
    });

  });
};




function retrieveAdvData(stName, wx) {
  return new Promise(function (resolve, reject){

    fetch("data/warning/alldata.json")
    .then(response => response.json())
    .then(data => {
      console.log("dataaaaaaaaaaaaaaaaaaaa")
      console.log(data)

 


      let dataPerSt = []
      for (let x of data) {
        if (x['rgn'] == stName) {
          dataPerSt.push(x)
        }
      }


    

      let wxArray = []
      for (let x of dataPerSt) {
        if (x['WX'] == wx) {
          wxArray.push(x)
        } 
      }



      let cote = []
      for (let x of wxArray) {
        cote.push(x['Cote'])
      }

      const counts = {};

      for (const num of cote) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }

      console.log(counts)

      let D = counts['D']
      let F = counts['F']
      let MA = counts['MA']
      let MP0 = counts['MP0']
      let Mpi = counts['Mpi']
      let MT = counts['MT']
      let MQ = counts['MQ']
      let U = counts['U']
      let i = counts['i']

      D = D || 0
      F = F || 0
      MA = MA || 0
      MP0 = MP0 || 0
      Mpi = Mpi || 0
      MT = MT || 0
      MQ = MQ || 0
      U = U || 0
      i = i || 0 


      let succes = D + MQ + Mpi + MT
      let manque = MA + MP0

      let POD = succes/(succes + manque)

      let fausseAlerte = F + U
      
      let FAR = fausseAlerte/(succes + fausseAlerte)


      let coteArray = [D, MQ, Mpi, MT, MA, MP0, F, U, i]



      console.log('PREMIER TEST')
      console.log(coteArray)


     
      resolve(coteArray)
      reject("error")

    });
  });
};








    function selectFullPeriod(years, months, days, dataArray, periodSelected) {
  
  

      let periodDataArray = []
      for ( var i = 0; i < dataArray.length; i++ ) {
        periodDataArray.push([years[i], months[i], days[i], dataArray[i]]);
        };
    


      if (isNaN(Number(periodSelected[0]))) {
        periodDataArray = periodDataArray
      } 
      else {
        periodDataArray = periodDataArray.filter((x) => x[0] === Number(periodSelected[0]));
      }


      console.log('yearSelected')
      console.log(periodDataArray)

  



      if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='allmonths') {
        periodDataArray = periodDataArray
        console.log('1')
      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='winter') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 1 || x[1] === 2 || x[1] === 3);
        console.log('2')

      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='spring') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 4 || x[1] === 5 || x[1] === 6);
        console.log('3')

      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='summer') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 7 || x[1] === 8 || x[1] === 9);
        console.log('4')

      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='fall') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 10 || x[1] === 11 || x[1] === 12);
        console.log('5')

      }
      else {
        periodDataArray = periodDataArray.filter((x) => x[1] === Number(periodSelected[1]));
        console.log('6')

      }




      console.log('monthSelected')
      console.log(periodDataArray)




      if (isNaN(Number(periodSelected[2]))) {
        periodDataArray = periodDataArray
      } 
      else {
        periodDataArray = periodDataArray.filter((x) => x[2] === Number(periodSelected[2]));
      //  periodDataArray = periodDataArray.map(x => x[0]);
      } 
     



      console.log('daySelected')
      console.log(periodDataArray)


      periodDataArray = periodDataArray.map(x => x[3]);

      console.log('finalArray')
      console.log(periodDataArray)


      return periodDataArray

    }

  

  
  

  
        


  // Function to return wind speed for each direction 

  
  

  function windGraphic (windDirectionArray, windSpeedArray) {

 
    
      
      function createWindData(degree) {
        
        let mergedWind = []
        for (var i = 0; i < windDirectionArray.length; i++) {
          mergedWind.push([windDirectionArray[i], windSpeedArray[i]]);  // vérifier par rapport à ce que j'avais avant (windDirectionArray[i], windSpeedArray[i])
        }

      
        const arrayLength = mergedWind.length

        const degreesNum = mergedWind.filter((x) => x[0] === degree);  // Keeping only rows that match a specific direction 
        

        // For one direction, create multiple arrays according to wind gust speed

        const degreesNum_30 = degreesNum.filter((x) => x[1] < 40);
        const degreesNum_40 = degreesNum.filter((x) => x[1] < 50 && x[1] >= 40);
        const degreesNum_50 = degreesNum.filter((x) => x[1] < 60 && x[1] >= 50);
        const degreesNum_60 = degreesNum.filter((x) => x[1] < 70 && x[1] >= 60);
        const degreesNum_70 = degreesNum.filter((x) => x[1] < 80 && x[1] >= 70);
        const degreesNum_80 = degreesNum.filter((x) => x[1] < 90 && x[1] >= 80);
        const degreesNum_90 = degreesNum.filter((x) => x[1] < 100 && x[1] >= 90);
        const degreesNum_100 = degreesNum.filter((x) => x[1] < 110 && x[1] >= 100);
        const degreesNum_up110 = degreesNum.filter((x) => x[1] >= 100);


        // Occurrence in percent for each of these array 

        const percent_30 = (degreesNum_30.length / arrayLength) * 100
        const percent_40 = (degreesNum_40.length / arrayLength) * 100
        const percent_50 = (degreesNum_50.length / arrayLength) * 100
        const percent_60 = (degreesNum_60.length / arrayLength) * 100
        const percent_70 = (degreesNum_70.length / arrayLength) * 100
        const percent_80 = (degreesNum_80.length / arrayLength) * 100
        const percent_90 = (degreesNum_90.length / arrayLength) * 100
        const percent_100 = (degreesNum_100.length / arrayLength) * 100
        const percent_up110 = (degreesNum_up110.length / arrayLength) * 100

        

        

      return [percent_30, percent_40, percent_50, percent_60]

    }


    

    
    // Loop the functions for every 360 degrees with an increment of 10
    
    for (var i = 1; i < 37; i++) { 
      window["percent" + i] = createWindData(i);
    }; 
    
   






    // Create array with angles to make the chart

    const angle = Array.from(Array(36).keys())

    
    const angle2 = angle.map(x => x+1)
    
    const angle3 = angle2.flatMap(i => [i,i,i,i]);  // Numbers of i must be the same as the number of element returned with the createWindData function
    

  

    // Create an array with the speed ranges 

    var speeds = ['30-39', '40-49', '50-59', '60-69']; // Numbers of item must be the same as the number of element returned with the createWindData function
    var speedsArray = [];
    for (var i = 0; i < 36; i++) {
        speedsArray = speedsArray.concat(speeds);
    }
    

    // Combine all data by angles into one array

    var percentArray = percent1.concat(percent2,percent3,percent4,percent5,percent6,percent7,percent8,percent9,percent10,percent11,percent12,percent13,percent14,percent15,percent16,percent17,percent18,percent19,percent20,percent21,percent22,percent23,percent24,percent25,percent26,percent27,percent28,percent29,percent30,percent31,percent32,percent33,percent34,percent35,percent36);


    
    
    // Create array that regroup all variables needed to make the chart

    var finalArray = [];
    for (var i = 0; i < angle3.length; i++) {
        finalArray.push([angle3[i]*10, speedsArray[i], percentArray[i]]);
      };




    var windObj = finalArray.map(x => ({
        angle: x[0],
        speed: x[1],
        percent: x[2]
    }));


    
  



      
      


      function renderChart(data) { 
        let myChart =  JSC.chart('toggles', {         // remettre 'toggles' si je veux que ça prenne toute la place dans le 'div' 'toggles'
          debug: true, 
          type: 'radar column', 
          animation_duration: 1000, 
          title: { 
            label_text: 'Rose des vents', 
            position: 'center',
            
          }, 
          legend: { 
            title_label_text: 'Vitesse des rafales (en km/h)', 
            position: 'bottom', 
            template: '%icon %name', 
            reversed: true,
          }, 
          annotations: [ 
            { 
              label: { 
                text: '', 
                style_fontSize: 10 
              }, 
              position: 'inside bottom right'
            } 
          ], 
          defaultSeries_shape_padding: 0.02, 
          yAxis: { 
            defaultTick_label_text: '%value%', 
            scale: { type: 'stacked' }, 
            alternateGridFill: 'none'
          }, 
          xAxis: { 
            scale: { range: [0, 360], interval: 45 }, 
            customTicks: [ 
              { value: 360, label_text: 'N' }, 
              { value: 45, label_text: 'NE' }, 
              { value: 90, label_text: 'E' }, 
              { value: 135, label_text: 'SE' }, 
              { value: 180, label_text: 'S' }, 
              { value: 225, label_text: 'SW' }, 
              { value: 270, label_text: 'W' }, 
              { value: 315, label_text: 'NW' } 
            ] 
          }, 
          palette: [ 
            '#c62828', 
            '#ff7043', 
            '#fff176', 
            '#aed581', 
            '#80cbc4', 
            '#bbdefb'
          ], 
          
          defaultPoint: { 
            tooltip: 
              '<b>%seriesName</b> %xValue° %yValue%'
          }, 
          series: JSC.nest() 
            .key('speed') 
            .key('angle') 
            .rollup('percent') 
            .series(data)
            .reverse() 
        }); 
        return myChart
      } 

      renderChart(windObj);

    }
      
/*

      if (monthOrPeriod === '1' || monthOrPeriod === '2' || monthOrPeriod === '3' || monthOrPeriod === '4' || monthOrPeriod === '5' || monthOrPeriod === '6' || monthOrPeriod === '7' || monthOrPeriod === '8' || monthOrPeriod === '9' || monthOrPeriod === '10' || monthOrPeriod === '11' || monthOrPeriod === '12' || monthOrPeriod === 'Year' || monthOrPeriod === 'Winter' || monthOrPeriod === 'Spring' || monthOrPeriod === 'Summer' || monthOrPeriod === 'Fall') {
        renderChart(windObj); 
      } 


      if (monthOrPeriod === 'tempJanuary' || monthOrPeriod === 'tempFebruary' || monthOrPeriod === 'tempMarch' || monthOrPeriod === 'tempApril' || monthOrPeriod === 'tempMay' || monthOrPeriod === 'tempJune' || monthOrPeriod === 'tempJuly' || monthOrPeriod === 'tempAugust' || monthOrPeriod === 'tempSeptember' || monthOrPeriod === 'tempOctober' || monthOrPeriod === 'tempNovember' || monthOrPeriod === 'tempDecember' || monthOrPeriod === 'tempYear' || monthOrPeriod === 'tempWinter' || monthOrPeriod === 'tempSpring' || monthOrPeriod === 'tempSummer' || monthOrPeriod === 'tempFall') {
        renderChart(tempObj); 
      }

*/

    

//document.getElementById('January').addEventListener('click', retrieveData)



    
      //   let windSpeed = []
    //    for (let x of jsondata) {
      //      windSpeed += x["Spd of Max Gust (km/h)"]  + ","
    //    }

  
 

          // Function to return the average temperature by month for specifics wind directions

          /*

          for (var i = 1; i < 37; i++) {
            window['tempAvg' + i] = createWindTempData(i)
          }


          var tempByWindDirArray = [tempAvg1];
          var tempByWindDirArray = tempByWindDirArray.concat(tempAvg2,tempAvg3,tempAvg4,tempAvg5,tempAvg6,tempAvg7,tempAvg8,tempAvg9,tempAvg10,tempAvg11,tempAvg12,tempAvg13,tempAvg14,tempAvg15,tempAvg16,tempAvg17,tempAvg18,tempAvg19,tempAvg20,tempAvg21,tempAvg22,tempAvg23,tempAvg24,tempAvg25,tempAvg26,tempAvg27,tempAvg28,tempAvg29,tempAvg30,tempAvg31,tempAvg32,tempAvg33,tempAvg34,tempAvg35,tempAvg36);
      
      
  
          function createWindTempData (degree) {
            const windTempArray = periodDataArray.map(x => [x[0],x[2]]);     // x[0] is the wind direction, x[2] is the temperature in the periodDataArray matrice 
            const degreesNum = windTempArray.filter((x) => x[0] === degree);  // keeping only rows that match a specific direction 
            
            const tempByMonth = degreesNum.map(x => x[1])  // Due to the 'map' functionnality that deleted column, the temperature of the matrice mergedWind2 was x[1]
            console.log('tempByMonth')
            console.log(tempByMonth)
            const sum = tempByMonth.reduce((a, b) => a + b, 0);
            const avg = (sum / tempByMonth.length) || 0;
    
            console.log('avg')
            console.log(avg)
            return avg
          }


          // Create object with names for the columns (needed for the chart)
    var tempObj = finalTempByWindDirArray.map(x => ({
      angle: x[0],
      speed: x[1],
      percent: x[2]
    }));



    
    // Need a third column in array for the temp by wind so the code for the chart can work
    let cheat = Array(36).fill(0.1);
    cheat = cheat.map(String);


    var finalTempByWindDirArray = [];
    for (var i = 0; i < angle2.length; i++) {
      finalTempByWindDirArray.push([angle2[i]*10, cheat[i], tempByWindDirArray[i]]);
    };

    */







    // Fonction dans laquelle je récupère une variable et je la divise par mois. Donc j'ai un 2D array. C'est facile d'enlever les NaN dans les simples array 
    // mais pour les 2D array c'est plus compliqué. La méthode est utilisée ici. 
    // De manière plus générale, on y voit comment effectuer des opérations avec map et filter sur des arrays multidimensionnels en maintenant leur structure.
function getRidOfNaN (promise3, promise4) {

    Promise.all([promise3, promise4]).then(values => {
      console.log('temperature values')
      console.log(values);
      let values0 = values[0];
      let values1 = values[1];
      let newnew = []
      for (let i = 0; i<=values0.length; i++) {
        newnew.push([values0[i], values1[i]])
      }
      console.log("newnew")
      console.log(newnew)
      let newValues = newnew.filter((x) => x[0] === 10);
      console.log(newValues)
      let inputArray = newValues.map(x => x[1]);
      console.log(inputArray);
      
      let perChunk = 31 // items per chunk 
      
      console.log('inputArray')
      console.log(inputArray)
      
      
      

      for (let x of inputArray) {
        x = x || 0
      }
      console.log('inputArray')
      console.log(inputArray)
     

let result = inputArray.reduce((resultArray, item, index) => { 
  let chunkIndex = Math.floor(index/perChunk)

  if(!resultArray[chunkIndex]) {
    resultArray[chunkIndex] = [] // start a new chunk
  }

  resultArray[chunkIndex].push(item)

  return resultArray
}, [])



let po = []
for (let i = 0; i < result.length; i++) {
  console.log('result[i]')
  console.log(result[i])
  po += result[i].filter(function(n){
    return n || n === 0;
  })
}

let finalResult = result.map(x => {
  return x.map(obj => obj = obj || -999)
})

let finalResult2 = finalResult.map(x => {
  return x.filter(function(val){
    return val !== -999
  })
})



finalResult2.forEach(function(e) {
 
  let sum = e.reduce((a, b) => a + b, 0);
  
  let avg = (sum / e.length) || 0;
  console.log('avg')
  console.log(avg)

})
      
    })
};


function getVerif(verifFile, verifVariable) {
  return new Promise(function (resolve, reject){



  console.log(verifFile)
  fetch(verifFile)
    .then((response) => response.json())
    
    .then((json) => {




/*
      for (let i in json) {
        json[i]['Critereatteint'] = json[i]['Crit�re atteint']
        json[i]['Debut'] = json[i]['D�but']
        json[i]['Debut2'] = json[i]['D�but2']
        json[i]['Details'] = json[i]['D�tails']
        json[i]['Extreme'] = json[i]['Extr�me']
        json[i]['Moderee'] = json[i]['Mod�r�e']
        json[i]['Preavis'] = json[i]['Pr�avis']
        json[i]['Region'] = json[i]['R�gion']
        json[i]['Termine'] = json[i]['Termin�']
        json[i]['Elevee'] = json[i]['�lev�e']
        json[i]['Emis'] = json[i]['�mis']
        json[i]['Evenementsdetails'] = json[i]['�v�nements (d�tails)']


        json[i]['Dateconvertie'] = json[i]['Date convertie']
        json[i]['ImpactsCommentaires'] = json[i]['Impacts/Commentaires']
        json[i]['NiveaudImpact'] = json[i]['Niveau d\'impact']
        json[i]['WXconvertie'] = json[i]['WX convertie']
        json[i]['WXconvImpacts'] = json[i]['WX conv. Impacts']


        delete json[i]['Crit�re atteint']
        delete json[i]['D�but']
        delete json[i]['D�but2']
        delete json[i]['D�tails']
        delete json[i]['Extr�me']
        delete json[i]['Mod�r�e']
        delete json[i]['Pr�avis']
        delete json[i]['R�gion']
        delete json[i]['Termin�']
        delete json[i]['�lev�e']
        delete json[i]['�mis']
        delete json[i]['�v�nements (d�tails)']
        
        delete json[i]['Date convertie']
        delete json[i]['Impacts/Commentaires']
        delete json[i]['Niveau d\'impact']
        delete json[i]['WX convertie']
        delete json[i]['WX conv. Impacts']
      }
*/


console.log(json)


      let verifArray = []
      console.log('verifVariable')
      console.log(verifVariable)

      for (let i = 0; i < json.length; i++) {
        verifArray += json[i][verifVariable] + ","
      }
      verifArray = verifArray.split(",")
      console.log('verifArray')
      console.log(verifArray)

    resolve(verifArray)
    reject("error")

    });
  });
};



function statVerif (array) {
  array = array.split(",")
  let counts = {}
  for (let num of array) {
    counts[num] = counts[num] ? counts[num] + 1: 1;
    console.log('coucou')
    console.log(counts)

    //if (array = array_WX) {
     // console.log()
   // }
  }
}


//window["percent" + i] = createWindData(i);
  
export { makeGraphic, makePie, getXMLinfo, updateLayers, stepForward, stepBackward, retrieveData, retrieveAdvData, windGraphic, selectFullPeriod, yearSelection, getVerif, statVerif }
  
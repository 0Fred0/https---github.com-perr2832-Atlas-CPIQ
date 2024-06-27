// Opening JSON file





function makeGraphic(dataArray, canvasId, variableSCD) {



  var dataValues = dataArray.map(x => x[3]);   // on prend les veleurs en se débarrassant des jours, mois, années


  console.log(dataValues[0])

/*
  let labels = Object.keys(dataValues)
  labels = labels.map(str => {
    return Number(str) + 1;
})
*/



var monthSelection = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]


console.log(dataArray)
if (isNaN(Number(yearSelectorX.value))) {
  var labels = dataArray.map(x => x[0]);
} else if (isNaN(Number(monthSelectorX.value))) {
  var labels = monthSelection;
} else if (isNaN(Number(daySelectorX.value))) {
  var labels = dataArray.map(x => x[2]);
}

console.log(labels)



  if (variableSCD == 'MAX_TEMPERATURE') {
    var yLabel = '°C'
    var graphColor = 'red'
    var type = 'line'
    var backgroundColor = 'white'

  } else if (variableSCD == 'MIN_TEMPERATURE') {
    var yLabel = '°C'
    var graphColor = 'blue'
    var type = 'line'
    var backgroundColor = 'white'

  } else if (variableSCD == 'MEAN_TEMPERATURE') {
    var yLabel = '°C'
    var graphColor = 'rgb(215, 0, 255)'
    var type = 'line'
    var backgroundColor = 'white'

  } else if (variableSCD == 'SPEED_MAX_GUST') {
    var yLabel = 'km/h'
    var graphColor = 'rgb(170, 100, 100)'
    var type = 'bar'
    var backgroundColor = 'rgb(170, 100, 100)'

  } else if (variableSCD == 'DIRECTION_MAX_GUST') {
    var yLabel = '10\'s deg'
    var graphColor = 'rgb(170, 100, 100)'
    var type = 'bar'
    var backgroundColor = 'rgb(170, 100, 100)'

  } else if (variableSCD == 'SNOW_ON_GROUND') {
    var yLabel = 'cm'
    var graphColor = 'blue'
    var type = 'bar'
    var backgroundColor = 'blue'

  } else if (variableSCD == 'TOTAL_RAIN') {
    var yLabel = 'mm'
    var graphColor = 'green'
    var type = 'bar'
    var backgroundColor = 'green'

  } else if (variableSCD == 'TOTAL_SNOW') {
    var yLabel = 'cm'
    var graphColor = 'blue'
    var type = 'bar'
    var backgroundColor = 'blue'

  } else if (variableSCD == 'TOTAL_PRECIPITATION') {
    var yLabel = 'mm'
    var graphColor = 'green'
    var type = 'bar'
    var backgroundColor = 'green'

  } else if (variableSCD == 'MAX_REL_HUMIDITY') {
    var yLabel = '%'
    var graphColor = 'rgb(168, 100, 134)'
    var type = 'line'
    var backgroundColor = 'rgb(168, 100, 134)'

  } else if (variableSCD == 'MIN_REL_HUMIDITY') {
    var yLabel = '%'
    var graphColor = 'rgb(168, 100, 134)'
    var type = 'line'
    var backgroundColor = 'rgb(168, 100, 134)'
  }






  const data = {
      labels: labels,
      datasets: [{
          label: "valeur",   // voir ce qui est le mieux... mettre une variable différente à chaque fois ou juste laisser valeur ?
          backgroundColor: backgroundColor,
          borderColor: graphColor,
          data: dataValues,
          tension: 0.4,
          fill: {
            target: 'origin',
            below: 'rgb(0, 0, 255)',
            above: 'rgb(255, 0, 0)'
          }               
      }]
  }
     
  const config = {
      type: type,
      data: data,
      options: {
        maintainAspectRatio: true,
        responsive: false,
        scales: {
          xAxes: [{
            id: 'x',
            stacked: false,
            scaleLabel: {
              display: true,
              labelString: 'Jour',
            }
          }],
          yAxes: [{
            id: 'y',
            stacked: false,
            scaleLabel: {
              
              display: true,
              labelString: yLabel
          }
          }]
        }
      }
  };

  const myChart = new Chart(
    document.getElementById(canvasId),
    config
  );

  var image64 = myChart.toBase64Image();
};





function makePie(array, canvasAdvId) {

  // https://quickchart.io/documentation/chart-js/patterned-backgrounds/ 
  // https://github.com/ashiguruma/patternomaly

 let dataArray = array[0]

 let CSI_array = array[1]



  const data = {
      //labels: ['BL', 'BN', 'BV', 'MT', 'NA', 'PA', 'PO', 'PV', 'RE', 'RS', 'TNA', 'TPO', 'TPV', 'TVV', 'VBN', 'VTH', 'VV'],
      labels: ['Blizzard', 'Bourrasque de neige', 'Neige abondante', 'Pluie abondante', 'Poudrerie', 'Pluie verglaçante', 'Bruine verglaçante', 'Refroidissement éolien', 'Refroidissement soudain', 'Vent violent'],


      datasets: [{
          label: "D",
          backgroundColor: ['rgb(255, 0, 0)', 'rgb(234, 140, 255)', 'rgb(0, 255, 255)', 'rgb(79, 236, 134)', 'rgb(255, 255, 155)', 'rgb(255, 90, 90)', 'rgb(255, 183, 194)', 'rgb(0, 0, 255)', 'rgb(255, 165, 0)', 'rgb(108, 72, 0)'],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[0],   
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "F",
          backgroundColor: [pattern.draw('cross', 'rgb(255, 0, 0)'), pattern.draw('cross', 'rgb(234, 140, 255)'), pattern.draw('cross', 'rgb(0, 255, 255)'), pattern.draw('cross', 'rgb(79, 236, 134)'), pattern.draw('cross', 'rgb(255, 255, 155)'), pattern.draw('cross', 'rgb(255, 90, 90)'), pattern.draw('cross', 'rgb(255, 183, 194)'), pattern.draw('cross', 'rgb(0, 0, 255)'), pattern.draw('cross', 'rgb(255, 165, 0)'), pattern.draw('cross', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[1], 
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "MA",
          backgroundColor: [pattern.draw('dash', 'rgb(255, 0, 0)'), pattern.draw('dash', 'rgb(234, 140, 255)'), pattern.draw('dash', 'rgb(0, 255, 255)'), pattern.draw('dash', 'rgb(79, 236, 134)'), pattern.draw('dash', 'rgb(255, 255, 155)'), pattern.draw('dash', 'rgb(255, 90, 90)'), pattern.draw('dash', 'rgb(255, 183, 194)'), pattern.draw('dash', 'rgb(0, 0, 255)'), pattern.draw('dash', 'rgb(255, 165, 0)'), pattern.draw('dash', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[2],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "MP0",
          backgroundColor: [pattern.draw('diagonal', 'rgb(255, 0, 0)'), pattern.draw('diagonal', 'rgb(234, 140, 255)'), pattern.draw('diagonal', 'rgb(0, 255, 255)'), pattern.draw('diagonal', 'rgb(79, 236, 134)'), pattern.draw('diagonal', 'rgb(255, 255, 155)'), pattern.draw('diagonal', 'rgb(255, 90, 90)'), pattern.draw('diagonal', 'rgb(255, 183, 194)'), pattern.draw('diagonal', 'rgb(0, 0, 255)'), pattern.draw('diagonal', 'rgb(255, 165, 0)'), pattern.draw('diagonal', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[3],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "Mpi",
          backgroundColor: [pattern.draw('zigzag', 'rgb(255, 0, 0)'), pattern.draw('zigzag', 'rgb(234, 140, 255)'), pattern.draw('zigzag', 'rgb(0, 255, 255)'), pattern.draw('zigzag', 'rgb(79, 236, 134)'), pattern.draw('zigzag', 'rgb(255, 255, 155)'), pattern.draw('zigzag', 'rgb(255, 90, 90)'), pattern.draw('zigzag', 'rgb(255, 183, 194)'), pattern.draw('zigzag', 'rgb(0, 0, 255)'), pattern.draw('zigzag', 'rgb(255, 165, 0)'), pattern.draw('zigzag', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[4],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "MT0",
          backgroundColor: [pattern.draw('diagonal-right-left', 'rgb(255, 0, 0)'), pattern.draw('diagonal-right-left', 'rgb(234, 140, 255)'), pattern.draw('diagonal-right-left', 'rgb(0, 255, 255)'), pattern.draw('diagonal-right-left', 'rgb(79, 236, 134)'), pattern.draw('diagonal-right-left', 'rgb(255, 255, 155)'), pattern.draw('diagonal-right-left', 'rgb(255, 90, 90)'), pattern.draw('diagonal-right-left', 'rgb(255, 183, 194)'), pattern.draw('diagonal-right-left', 'rgb(0, 0, 255)'), pattern.draw('diagonal-right-left', 'rgb(255, 165, 0)'), pattern.draw('diagonal-right-left', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[5],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "MQ",
          backgroundColor: [pattern.draw('line-vertical', 'rgb(255, 0, 0)'), pattern.draw('line-vertical', 'rgb(234, 140, 255)'), pattern.draw('line-vertical', 'rgb(0, 255, 255)'), pattern.draw('line-vertical', 'rgb(79, 236, 134)'), pattern.draw('line-vertical', 'rgb(255, 255, 155)'), pattern.draw('line-vertical', 'rgb(255, 90, 90)'), pattern.draw('line-vertical', 'rgb(255, 183, 194)'), pattern.draw('line-vertical', 'rgb(0, 0, 255)'), pattern.draw('line-vertical', 'rgb(255, 165, 0)'), pattern.draw('line-vertical', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[6],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "U",
          backgroundColor: [pattern.draw('square', 'rgb(255, 0, 0)'), pattern.draw('square', 'rgb(234, 140, 255)'), pattern.draw('square', 'rgb(0, 255, 255)'), pattern.draw('square', 'rgb(79, 236, 134)'), pattern.draw('square', 'rgb(255, 255, 155)'), pattern.draw('square', 'rgb(255, 90, 90)'), pattern.draw('square', 'rgb(255, 183, 194)'), pattern.draw('square', 'rgb(0, 0, 255)'), pattern.draw('square', 'rgb(255, 165, 0)'), pattern.draw('square', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[7],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "i",
          backgroundColor: [pattern.draw('dot', 'rgb(255, 0, 0)'), pattern.draw('dot', 'rgb(234, 140, 255)'), pattern.draw('dot', 'rgb(0, 255, 255)'), pattern.draw('dot', 'rgb(79, 236, 134)'), pattern.draw('dot', 'rgb(255, 255, 155)'), pattern.draw('dot', 'rgb(255, 90, 90)'), pattern.draw('dot', 'rgb(255, 183, 194)'), pattern.draw('dot', 'rgb(0, 0, 255)'), pattern.draw('dot', 'rgb(255, 165, 0)'), pattern.draw('dot', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[8],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "W",
          backgroundColor: [pattern.draw('weave', 'rgb(255, 0, 0)'), pattern.draw('weave', 'rgb(234, 140, 255)'), pattern.draw('weave', 'rgb(0, 255, 255)'), pattern.draw('weave', 'rgb(79, 236, 134)'), pattern.draw('weave', 'rgb(255, 255, 155)'), pattern.draw('weave', 'rgb(255, 90, 90)'), pattern.draw('weave', 'rgb(255, 183, 194)'), pattern.draw('weave', 'rgb(0, 0, 255)'), pattern.draw('weave', 'rgb(255, 165, 0)'), pattern.draw('weave', 'rgb(108, 72, 0)')],
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0, 0.5)',
          data: dataArray[9],
          yAxisID: 'y',
          type: 'bar',
          order: 2
      }, {
          label: "CSI(A)",
          backgroundColor: 'rgb(0, 0, 255, 0.5)',
          borderWidth: 4,
          borderColor: 'rgb(0, 0, 0)',
          data: CSI_array[0],
          yAxisID: 'y1',
          type: 'scatter',
          order: 1,
          pointRadius: 4,
      }, {
        label: "CSI(B)",
        backgroundColor: 'rgb(0, 0, 0)',
        borderWidth: 4,
        borderColor: 'rgb(75, 150, 255, 0.5)',
        data: CSI_array[1],
        yAxisID: 'y1',
        type: 'scatter',
        order: 1,
        pointRadius: 4,
    }
    ]
  }

  const config = {
      type: "bar",
      
      data: data,
      options: {
        responsive: true,
        legend: {
            position: 'top',
            labels: {

              
              //usePointStyle: false,
              //boxWidth: 20,
              

              generateLabels: function(chart) {
                
                let labels = Chart.defaults.global.legend.labels.generateLabels(chart);
                console.log(labels)
                labels[0].pointStyle  = 'circle';

                labels[1].pointStyle  = 'circle';

                labels[2].pointStyle  = 'rect';
                labels[2].fillStyle  = 'rgb(0, 0, 0, 0.3)';

                labels[3].pointStyle  = 'rect';
                labels[3].fillStyle  = pattern.draw('cross', 'rgb(0, 0, 0, 0.3)');

                labels[4].pointStyle  = 'rect';
                labels[4].fillStyle  = pattern.draw('dash', 'rgb(0, 0, 0, 0.3)');

                labels[5].pointStyle  = 'rect';
                labels[5].fillStyle  = pattern.draw('diagonal', 'rgb(0, 0, 0, 0.3)');

                labels[6].pointStyle  = 'rect';
                labels[6].fillStyle  = pattern.draw('zigzag', 'rgb(0, 0, 0, 0.3)');

                labels[7].pointStyle  = 'rect';
                labels[7].fillStyle  = pattern.draw('diagonal-right-left', 'rgb(0, 0, 0, 0.3)');

                labels[8].pointStyle  = 'rect';
                labels[8].fillStyle  = pattern.draw('line-vertical', 'rgb(0, 0, 0, 0.3)');

                labels[9].pointStyle  = 'rect';
                labels[9].fillStyle  = pattern.draw('square', 'rgb(0, 0, 0, 0.3)');

                labels[10].pointStyle  = 'rect';
                labels[10].fillStyle  = pattern.draw('dot', 'rgb(0, 0, 0, 0.3)');
                
                labels[11].pointStyle  = 'rect';
                labels[11].fillStyle  = pattern.draw('weave', 'rgb(0, 0, 0, 0.3)');


                return labels;
              }
            }
        },
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              maxRotation: 45,
              minRotation: 45
            },
            scaleLabel: {
              display: true,
              labelString: 'Type d\'événement'
            }
          }],
          yAxes: [{
            id: 'y',
            position: 'left',
            ticks: {
              callback: function(value) {
                return -value; // Inversion des valeurs pour les rendre négatives
              }
            },
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Nombre de cas'
            },
            ticks: {
              suggestedMax: 40,
              suggestedMin: -20,
              stepSize: 10
            }
          }, {
            id: 'y1',
            position: 'right',
            stacked: false,
            ticks: {
              suggestedMax: 1.0,
              suggestedMin: -0.5,
              stepSize: 0.25
            },
            scaleLabel: {
              display: true,
              labelString: 'CSI',
            }
          }
        ],
        }
      }
  };



  new Chart(
    document.getElementById(canvasAdvId),
    config
  );
};



/*        

/////// avant dans config...ne semble pas changer grand chose //////
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
*/




function retrieveData(stationID, variable, startYear, endYear) {
  return new Promise(function (resolve, reject) {

  
  var foo = [];

  for (var i = startYear; i <= endYear; i++) {
      foo.push(i);
  }
 
  
  let urls = []
  for (var i = 0; i < foo.length; i++) {
    urls += `https://api.weather.gc.ca/collections/climate-daily/items?f=json&CLIMATE_IDENTIFIER=${stationID}&LOCAL_YEAR=${foo[i]}` + ','
  }


  
  urls = urls.split(",")
  urls = urls.splice(0, urls.length-1);

  
  // // Load geoJSON data from every files
  
  Promise.all(urls.map(u=>fetch(u).then(responses => responses.json())
      )
  
  ).then(data => {


    console.log(data)


     // let loadedData = data.flat();

      // console.log(loadedData)

      let feat = []

    //  console.log(typeof loadedData)
     // console.log(loadedData)

      for (let x of data) {
        feat.push(x.features)
      }

      feat = feat.flat()


      let variableData = []

      for (let x of feat) {
        variableData.push(x.properties[variable])
      }

     
      resolve(variableData)
      reject("error")
    });

  });
};
  






function retrieveAdvData(rgnName, month) {
  return new Promise(function (resolve, reject){

    fetch("data/warning/alldata.json")
    .then(response => response.json())
    .then(data => {


      console.log(rgnName)
      console.log(month)



      // pour que le nom dans le colonne selecte match avec le nom de la region sur la couche avertissement

      for (let x of data) {
        if (x['rgn'] == 'DEG') {
          x['Nom région'] = 'Témiscouata'
        } else if (x['rgn'] == 'DOR') {
          x['Nom région'] = 'réserve faunique La Vérendrye'
        } else if (x['rgn'] == 'ESC') {
          x['Nom région'] = 'Les Escoumins - Forestville'
        } else if (x['rgn'] == 'HYA') {
          x['Nom région'] = 'vallée du Richelieu - Saint-Hyacinthe'
        } else if (x['rgn'] == 'LAN' || x['rgn'] == 'WEW') {
          x['Nom région'] = 'Lanaudière'
        } else if (x['rgn'] == 'LAU') {
          x['Nom région'] = 'Mont-Laurier'
        } else if (x['rgn'] == 'MAT') {
          x['Nom région'] = 'Matane'
        } else if (x['rgn'] == 'MUR') {
          x['Nom région'] = 'parc national de la Gaspésie - Murdochville'
        } else if (x['rgn'] == 'TRM') {
          x['Nom région'] = 'parc du Mont-Tremblant - Saint-Michel-des-Saints'
        } else if (x['rgn'] == 'WBA') {
          x['Nom région'] = 'Témiscamingue'
        } else if (x['rgn'] == 'WBY' || x['rgn'] == 'wby') {
          x['Nom région'] = 'Anticosti'
        } else if (x['rgn'] == 'WBZ') {
          x['Nom région'] = 'Vaudreuil - Soulanges - Huntingdon'
        } else if (x['rgn'] == 'WDM') {
          x['Nom région'] = 'Chevery'
        } else if (x['rgn'] == 'WDQ') {
          x['Nom région'] = 'La Tuque'
        } else if (x['rgn'] == 'WHV') {
          x['Nom région'] = 'Beauce'
        } else if (x['rgn'] == 'WIS') {
          x['Nom région'] = 'Charlevoix'
        } else if (x['rgn'] == 'WJT') {
          x['Nom région'] = 'Laurentides'
        } else if (x['rgn'] == 'YKQ' || x['rgn'] == 'WKQ') {
          x['Nom région'] = 'Waskaganish'
        } else if (x['rgn'] == 'WMJ') {
          x['Nom région'] = 'Haute-Gatineau - Lièvre - Papineau'
        } else if (x['rgn'] == 'WNH') {
          x['Nom région'] = 'Kamouraska - Rivière-du-Loup - Trois-Pistoles'
        } else if (x['rgn'] == 'WNQ') {
          x['Nom région'] = 'Drummondville - Bois-Francs'
        } else if (x['rgn'] == 'WOC') {
          x['Nom région'] = 'New Carlisle - Chandler'
        } else if (x['rgn'] == 'WPD') {
          x['Nom région'] = 'rÃ©serve faunique des Laurentides'
        } else if (x['rgn'] == 'WPK') {
          x['Nom région'] = 'Parent - réservoir Gouin'
        } else if (x['rgn'] == 'YQB' || x['rgn'] == 'WQB') {
          x['Nom région'] = 'Québec'
        } else if (x['rgn'] == 'WSF') {
          x['Nom région'] = 'Sainte-Anne-des-Monts - Grande-Vallée'
        } else if (x['rgn'] == 'WSG') {
          x['Nom région'] = 'Matane'
        } else if (x['rgn'] == 'WST') {
          x['Nom région'] = 'Montmagny - L\'Islet'
        } else if (x['rgn'] == 'WTY') {
          x['Nom région'] = 'Mauricie'
        } else if (x['rgn'] == 'WUL' || x['rgn'] == 'YUL') {
          x['Nom région'] = 'Montréal métropolitain - Laval'
        } else if (x['rgn'] == 'WZS') {
          x['Nom région'] = 'Amqui - vallée de la Matapédia'
        } else if (x['rgn'] == 'YAH') {
          x['Nom région'] = 'LG Quatre - Laforge et Fontanges'
        } else if (x['rgn'] == 'YBC') {
          x['Nom région'] = 'Baie-Comeau'
        } else if (x['rgn'] == 'YBG') {
          x['Nom région'] = 'Saguenay'
        } else if (x['rgn'] == 'YBX') {
          x['Nom région'] = 'Blanc-Sablon'
        } else if (x['rgn'] == 'YCL') {
          x['Nom région'] = 'Restigouche - Bonaventure'
        } else if (x['rgn'] == 'YGL') {
          x['Nom région'] = 'baie James et rivière La Grande'
        } else if (x['rgn'] == 'YGP') {
          x['Nom région'] = 'parc national de Forillon - Gaspé - Percé'
        } else if (x['rgn'] == 'YGV') {
          x['Nom région'] = 'Minganie'
        } else if (x['rgn'] == 'YKL') {
          x['Nom région'] = 'Schefferville'
        } else if (x['rgn'] == 'YMT') {
          x['Nom région'] = 'Chibougamau'
        } else if (x['rgn'] == 'YMX') {
          x['Nom région'] = 'Lachute - Saint-Jérôme'
        } else if (x['rgn'] == 'YNA') {
          x['Nom région'] = 'Natashquan'
        } else if (x['rgn'] == 'YNM') {
          x['Nom région'] = 'Matagami'
        } else if (x['rgn'] == 'YRJ') {
          x['Nom région'] = 'Lac-Saint-Jean'
        } else if (x['rgn'] == 'YSC') {
          x['Nom région'] = 'Estrie'
        } else if (x['rgn'] == 'YVO') {
          x['Nom région'] = 'Abitibi'
        } else if (x['rgn'] == 'YVP') {
          x['Nom région'] = 'Kuujjuaq'
        } else if (x['rgn'] == 'YWA') {
          x['Nom région'] = 'Pontiac'
        } else if (x['rgn'] == 'YWK') {
          x['Nom région'] = 'Fermont'
        } else if (x['rgn'] == 'YYY') {
          x['Nom région'] = 'Rimouski - Mont-Joli'
        } else if (x['rgn'] == 'YZV') {
          x['Nom région'] = 'Sept-Îles - Port-Cartier'
        } else if (x['rgn'] == 'ZMV') {
          x['Nom région'] = 'rivière Manicouagan'
        }                       
      }



/*
      let dataPerSt = []
      for (let x of data) {
        if (x['Nom région'] == rgnName) {
          dataPerSt.push(x)
        }
      }

      console.log(dataPerSt)

      let wxArray = []
      for (let x of dataPerSt) {
        if (x['WX2'] == wx) {
          wxArray.push(x)
        } 
      }

      console.log(wxArray)



      let cote = []
      for (let x of wxArray) {
        cote.push(x['Cote'])
      }

      console.log(cote)
*/



      let inLetter = []

      if (month == 1) {
        inLetter = 'janv'
      } else if (month == 2) {
        inLetter = 'févr'
      } else if (month == 3) {
        inLetter = 'mars'
      } else if (month == 4) {
        inLetter = 'avr'
      } else if (month == 5) {
        inLetter = 'mai'
      } else if (month == 6) {
        inLetter = 'juin'
      } else if (month == 7) {
        inLetter = 'juil'
      } else if (month == 8) {
        inLetter = 'août'
      } else if (month == 9) {
        inLetter = 'sept'
      } else if (month == 10) {
        inLetter = 'oct'
      } else if (month == 11) {
        inLetter = 'nov'
      } else if (month == 12) {
        inLetter = 'déc'
      }


      let dataPerSt = []

      for (let x of data) {
        if (x['Nom région'] == rgnName) {
          dataPerSt.push(x)
        }
      }







      let dataPerMonth = []

      for (let x of dataPerSt) {
        if (x['Date'].split("-")[1] == month || x['Date'].split("-")[1] == inLetter) {


          dataPerMonth.push(x)
        }
      }

      console.log(dataPerMonth)

      let D = []
      let F = []
      let MA = []
      let MP0 = []
      let Mpi = []
      let MT0 = []
      let MQ = []
      let U = []
      let i = []
      let W = []



      for (let x of dataPerMonth) {
        if (x['Cote'] == "D") {
          D.push(x)
        }
      }
      for (let x of dataPerMonth) {
        if (x['Cote'] == "F") {
          F.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "MA") {
          MA.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "MP0") {
          MP0.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "Mpi") {
          Mpi.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "MT") {
          MT0.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "MQ") {
          MQ.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "U") {
          U.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "i") {
          i.push(x)
        }
      }for (let x of dataPerMonth) {
        if (x['Cote'] == "W") {
          W.push(x)
        }
      }


      // Pour l'instant je ne vais pas mettre VBN et VTH psk peut-être qu'un VBN correspond à chaque fois à un BN. Demander à Bessam.

      // Ou mettre les i dans l'équation

      // Demander ce qu'es MF (dans l'image envoyée par Bessam sur Scribe)

      function findWX2 (cote) {


        let BL = []
        let VBN = []
        let BN = []
        let VTH = []
        let NA = []
        let PA = []
        let PO = []
        let PV = []
        let BV = []
        let RE = []
        let RS = []
        let VV = []
        let MT = []

        // NA et TNA, PO et TPO, PV et TPV, VV et TVV vont ensembles, 
  
  
  
  
        for (let x of cote) {
          if (x["WX2"] == "BL") {
            BL.push(x)
          } else if (x["WX2"] == "VBN") {
            VBN.push(x)
          } else if (x["WX2"] == "BN") {
            BN.push(x)
          } else if (x["WX2"] == "VTH") {
            VTH.push(x)
          } else if (x["WX2"] == "NA" || x["WX2"] == "TNA") {
            NA.push(x)
          } else if (x["WX2"] == "PA") {
            PA.push(x)
          } else if (x["WX2"] == "PO" || x["WX2"] == "TPO") {
            PO.push(x)
          } else if (x["WX2"] == "PV" || x["WX2"] == "TPV") {
            PV.push(x)
          } else if (x["WX2"] == "BV") {
            BV.push(x)
          } else if (x["WX2"] == "RE") {
            RE.push(x)
          } else if (x["WX2"] == "RS") {
            RS.push(x)
          } else if (x["WX2"] == "VV" || x["WX2"] == "TVV") {
            VV.push(x)
          } else if (x["WX2"] == "MT") {
            MT.push(x)
          }
        }
    
       // let final = [BL.length, BN.length, BV.length, MT.length, NA.length, PA.length, PO.length, PV.length, RE.length, RS.length, TNA.length, TPO.length, TPV.length, TVV.length, VBN.length, VTH.length, VV.length]
        let final = [BL.length, BN.length, NA.length, PA.length, PO.length, PV.length, BV.length, RE.length, RS.length, VV.length]

  

        return final
  
      }


      let final_D = findWX2 (D)
      let final_F = findWX2 (F)
      let final_MA = findWX2 (MA)
      let final_MP0 = findWX2 (MP0)
      let final_Mpi = findWX2 (Mpi)
      let final_MT0 = findWX2 (MT0)
      let final_MQ = findWX2 (MQ)
      let final_U = findWX2 (U)
      let final_i = findWX2 (i)
      let final_W = findWX2 (W)


      let negative_F = final_F.map(x => x * -1);
      let negative_MA = final_MA.map(x => x * -1);
      let negative_MP0 = final_MP0.map(x => x * -1);



      console.log(final_D)
      console.log(negative_F)
      console.log(negative_MA)
      console.log(negative_MP0)
      console.log(final_Mpi)
      console.log(final_MT0)
      console.log(final_MQ)
      console.log(final_U)
      console.log(final_i)
      console.log(final_W)

      // Calcul de CSI(A)

      let CSI_A = []

      let CSI_B = []

      for (i in final_D) {
        CSI_A.push(final_D[i] / (final_D[i] + final_F[i] + final_MA[i] + final_MP0[i] + final_Mpi[i] + final_MT0[i] + final_U[i]))

        CSI_B.push((final_D[i] + final_U[i]) / (final_D[i] + final_F[i] + final_MA[i] + final_MP0[i] + final_Mpi[i] + final_MT0[i] + final_U[i]))

      }

      console.log(CSI_A)

      console.log(CSI_B)



      // Calcul de CSI(B)



      let final_combine = [[final_D, negative_F, negative_MA, negative_MP0, final_Mpi, final_MT0, final_MQ, final_U, final_i, final_W], [CSI_A, CSI_B]] 





/*
      if ([num["WX2"] == "PV"]) {
        console.log("PA")
        countsVV[num] = countsVV[num] ? countsVV[num] + 1 : 1;
      } else if ([num["WX2"] == "VV"]) {
        countsPA[num] = countsPA[num] ? countsPA[num] + 1 : 1;
      }
*/






      resolve(final_combine)
      reject("error")

    });
  });
};








    function selectFullPeriod(years, months, days, dataArray, periodSelected) {

      console.log(periodSelected)

      console.log(Number(periodSelected[1]))
      console.log(isNaN(Number(periodSelected[1])))


  

      let periodDataArray = []
      for ( var i = 0; i < dataArray.length; i++ ) {
        periodDataArray.push([years[i], months[i], days[i], dataArray[i]]);
        };
    


      if (isNaN(Number(periodSelected[0]))) {               // pas besoin de mettre && periodSelected[0]=='allyears' puisque les autres options ne sont que des nombres
        periodDataArray = periodDataArray
      } 
      else {
        periodDataArray = periodDataArray.filter((x) => x[0] === Number(periodSelected[0]));
        console.log('Years: Number')
      }





      //// paragraphe à garder si jamais je veux définir des périodes hivernales ////

/*
      if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='allmonths') {
        periodDataArray = periodDataArray
        console.log('Months: NaN')

      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='winter') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 1 || x[1] === 2 || x[1] === 3);

      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='spring') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 4 || x[1] === 5 || x[1] === 6);

      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='summer') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 7 || x[1] === 8 || x[1] === 9);

      }
      else if (isNaN(Number(periodSelected[1])) && periodSelected[1]=='fall') {
        periodDataArray = periodDataArray.filter((x) => x[1] === 10 || x[1] === 11 || x[1] === 12);

      }
      else {
        periodDataArray = periodDataArray.filter((x) => x[1] === Number(periodSelected[1]));
        console.log('Months: Number')
      }
*/



  

      if (isNaN(Number(periodSelected[1]))) {
        periodDataArray = periodDataArray
        console.log('Months: NaN')
      } else {
        periodDataArray = periodDataArray.filter((x) => x[1] === Number(periodSelected[1]));
        console.log('Months: Number')
      }



      if (isNaN(Number(periodSelected[2]))) {
        periodDataArray = periodDataArray
      } 
      else {
        periodDataArray = periodDataArray.filter((x) => x[2] === Number(periodSelected[2]));
      //  periodDataArray = periodDataArray.map(x => x[0]);
      console.log('Days: Number')

      } 

   
     


      periodDataArray.sort(function(a, b) {
        return a[0] - b[0];
      });

      periodDataArray.sort(function(a, b) {
        return a[1] - b[1];
      });


      periodDataArray.sort(function(a, b) {
        return a[2] - b[2];
      });




      let thisElement = []

      for (let i = 1; i < periodDataArray.length; i++) {
        if (periodDataArray[i][2] - periodDataArray[i-1][2] > 1) {    // si c'est = 2 la suite du code est ok mais si c'est x >= 3 (= plusieurs données d'affiléés qui manquent, faire une nouvelle ligne pour marquer un truc du style erreur et on développera un code en fonction si on tombe sur un tel cas)
          thisElement.push(periodDataArray[i])


          thisElement = thisElement[0]
        

          let thisIndex = []

          for (var j = 0; j < periodDataArray.length; j++) {
            if (periodDataArray[j] == thisElement) {
              thisIndex.push(j);
            }
          }


          let newIndex = thisIndex // on veut remplacer par l'index au même endroit

       
          
          let newElement = [thisElement[0], thisElement[1], thisElement[2] - 1, null]

          periodDataArray.splice(newIndex, 0 , newElement)

         
        }
      }


    

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
        let myChart =  JSC.chart('graphics', {         // remettre 'toggles' si je veux que ça prenne toute la place dans le 'div' 'toggles'
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


      let windGraph = document.getElementById('graphics')
      windGraph.style['display'] = 'block'

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
      let values0 = values[0];
      let values1 = values[1];
      let newnew = []
      for (let i = 0; i<=values0.length; i++) {
        newnew.push([values0[i], values1[i]])
      }
      let newValues = newnew.filter((x) => x[0] === 10);
      let inputArray = newValues.map(x => x[1]);
      
      let perChunk = 31 // items per chunk 
      
      
      
      
      

      for (let x of inputArray) {
        x = x || 0
      }
    
     

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
 

})
      
    })
};






function getTempRecordData (stationName, day, month) {
  return new Promise(function (resolve, reject) {
    fetch(`https://api.weather.gc.ca/collections/ltce-temperature/items?f=json&VIRTUAL_STATION_NAME_E=${stationName}`)
        .then(function (response) {
          return response.json();           
        })
        .then(function (json) {
          var lat = json.features[0].geometry.coordinates[0]
          var lon = json.features[0].geometry.coordinates[1]


        // roberval record mensuel max temp en juillet = le 2 et pas le 6 (jour)
        // Regarder le 4 janvier 1950 : il a fait 16,7 à Lennoxville et 15 à Sherbrooke. Les étudiants ont pris 16,7 comme record mensuel tandis que l'API geomet donne 15 pour cette journée. Normalement API a raison puisque étudiant comme API devraient prendre les données de Sherbrooke en 1950 (ça passe à Lennoxville en 1972)
        // 28 janvier 1925, aussi pris à lennoxville. Devrait etre -37,2 en 1918
        // 1er fervrier 1920, record min temp pris je sais pas ou. Devrait etre -37,8 a sherbrooke
          // mars. bas minimum devrait -29,8 à lennoxville le 7 mars 2007
          // bas minimum de mai...rien de correspond. Si on prend lennoxville (ce qu'on devrait pas), ça devrait être le 3 mai 1966 avec -6.1. 

          for (let x in json.features) {


            if (json.features[x].properties.LOCAL_DAY == day && json.features[x].properties.LOCAL_MONTH == month) {

          

              var highMax = json.features[x].properties.RECORD_HIGH_MAX_TEMP
              var highMin = json.features[x].properties.RECORD_HIGH_MIN_TEMP
              var lowMax = json.features[x].properties.RECORD_LOW_MAX_TEMP
              var lowMin  = json.features[x].properties.RECORD_LOW_MIN_TEMP
    
              var highMax_year = json.features[x].properties.RECORD_HIGH_MAX_TEMP_YR
              var highMin_year = json.features[x].properties.RECORD_HIGH_MIN_TEMP_YR
              var lowMax_year = json.features[x].properties.RECORD_LOW_MAX_TEMP_YR
              var lowMin_year  = json.features[x].properties.RECORD_LOW_MIN_TEMP_YR
    
              var localDay = json.features[x].properties.LOCAL_DAY
              var localMonth = json.features[x].properties.LOCAL_MONTH
    
            }
          }
      

        var cooObject = [
          { lat: lat, lon: lon, id: stationName, hmax: highMax, yearhMax: highMax_year, hmin: highMin, yearhMin: highMin_year, lmax: lowMax, yearlMax: lowMax_year, lmin: lowMin, yearlMin: lowMin_year, day: localDay, month: localMonth }
        ]


          resolve(cooObject)

        })
  })
}






function createTable (jsonArr, drawTitles, records, drawValues, drawYears, drawID, units, captionText) {

  let LTCE_content = document.getElementById('LTCE_popup-content')

  var table = document.createElement('TABLE')
  table.class = "data-table"
  table.style["borderCollapse"] = "collapse"
  table.style["width"] = "100%"
  table.id = drawID


  var tableBody = document.createElement('TBODY')
  tableBody.id = "table-content"
  var thead = document.createElement('thead')
  var caption = document.createElement('caption')

  caption.innerHTML = captionText
  // table.appendChild(caption)

  table.appendChild(thead);
  table.appendChild(tableBody);

  LTCE_content.appendChild(table)

  const tableContent = document.getElementById("table-content")
  var keys = Object.keys(drawTitles)
  var tr = document.createElement('TR');
  tr.style["border"] = "1px solid black"

  for (let i = 0; i < keys.length; i++) {

      var th = document.createElement('TH')
      th.style["border"] = "1px solid black"

  //    th.width = '75';
      tr.appendChild(th)
      th.appendChild(document.createTextNode(drawTitles[i]));
  }
  thead.appendChild(tr);


/*
  for (let i = 0; i < jsonArr.length; i++) {
    var tr = document.createElement('TR');
    for (let j = 0; j < jsonArr[i].length; j++) {
        var td = document.createElement('TD')
        td.appendChild(document.createTextNode(jsonArr[i][j]));
        tr.appendChild(td)
    }
    tableContent.appendChild(tr);
}
*/



  const createRow = (obj) => {
    const row = document.createElement("tr");
    const objKeys = Object.keys(obj);
    objKeys.map((key) => {
      const cell = document.createElement("td");
      cell.setAttribute("data-attr", key);
      cell.innerHTML = obj[key];
      cell.style["border"] = "1px solid black"
      cell.style["textAlign"] = "center"


      row.appendChild(cell);
    });
    return row;
  };


  const getTableContent = (data) => {
    data.map((obj) => {
      const row = createRow(obj);
      tableBody.appendChild(row);
    });
  };

  getTableContent(jsonArr)
  

}






function getSnowfallRecordData (stationName, day, month) {
  return new Promise(function (resolve, reject) {
    fetch(`https://api.weather.gc.ca/collections/ltce-snowfall/items?f=json&VIRTUAL_STATION_NAME_E=${stationName}`)
        .then(function (response) {
          return response.json();           
        })
        .then(function (json) {
          var lat = json.features[0].geometry.coordinates[0]
          var lon = json.features[0].geometry.coordinates[1]



          for (let x in json.features) {


            if (json.features[x].properties.LOCAL_DAY == day && json.features[x].properties.LOCAL_MONTH == month) {


              var snowfall = json.features[x].properties.RECORD_SNOWFALL
              var snowfall2 = json.features[x].properties.SECOND_SNOWFALL
              var snowfall3 = json.features[x].properties.THIRD_SNOWFALL
    
              var snowfall_year = json.features[x].properties.RECORD_SNOWFALL_YR
              var snowfall2_year = json.features[x].properties.SECOND_SNOWFALL_YEAR
              var snowfall3_year = json.features[x].properties.THIRD_SNOWFALL_YEAR
    
              var localDay = json.features[x].properties.LOCAL_DAY
              var localMonth = json.features[x].properties.LOCAL_MONTH
    
            }
          }
      

        var cooObject = [
          { lat: lat, lon: lon, id: stationName, rdSnowfall: snowfall, rdSnowfall_year: snowfall_year, rdSnowfall2: snowfall2, rdSnowfall2_year: snowfall2_year, rdSnowfall3: snowfall3, rdSnowfall3_year: snowfall3_year, day: localDay, month: localMonth }
        ]


          resolve(cooObject)

        })
  })
}





function getPrecipRecordData (stationName, day, month) {
  return new Promise(function (resolve, reject) {
    fetch(`https://api.weather.gc.ca/collections/ltce-precipitation/items?f=json&VIRTUAL_STATION_NAME_E=${stationName}`)
        .then(function (response) {
          return response.json();           
        })
        .then(function (json) {
          var lat = json.features[0].geometry.coordinates[0]
          var lon = json.features[0].geometry.coordinates[1]



          for (let x in json.features) {


            if (json.features[x].properties.LOCAL_DAY == day && json.features[x].properties.LOCAL_MONTH == month) {


              var precip = json.features[x].properties.RECORD_PRECIPITATION
              var precip2 = json.features[x].properties.SECOND_PRECIPITATION
              var precip3 = json.features[x].properties.THIRD_PRECIPITATION
    
              var precip_year = json.features[x].properties.RECORD_PRECIPITATION_YR
              var precip2_year = json.features[x].properties.SECOND_PRECIPITATION_YEAR
              var precip3_year = json.features[x].properties.THIRD_PRECIPITATION_YEAR
    
              var localDay = json.features[x].properties.LOCAL_DAY
              var localMonth = json.features[x].properties.LOCAL_MONTH
    
            }
          }
      

        var cooObject = [
          { lat: lat, lon: lon, id: stationName, rdPrecip: precip, rdPrecip_year: precip_year, rdPrecip2: precip2, rdPrecip2_year: precip2_year, rdPrecip3: precip3, rdPrecip3_year: precip3_year, day: localDay, month: localMonth }
        ]


          resolve(cooObject)

        })
  })
}




function getVerif(verifFile, verifVariable) {
  return new Promise(function (resolve, reject){



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




      let verifArray = []
      

      for (let i = 0; i < json.length; i++) {
        verifArray += json[i][verifVariable] + ","
      }
      verifArray = verifArray.split(",")
      

    resolve(verifArray)
    reject("error")

    });
  });
};





function makeAdvCanvas(rgnContent) {

  while (rgnContent.firstChild) {
    rgnContent.removeChild(rgnContent.firstChild);
  }

  var newAdvCanvas = document.createElement('canvas');
  newAdvCanvas.id = 'advCanvas'

  
  newAdvCanvas.style["backgroundColor"] = "white"
  newAdvCanvas.style["display"] = "block"
  newAdvCanvas.style["marginTop"] = "5%"
  newAdvCanvas.style["borderRadius"] = "10px"
  newAdvCanvas.style["width"]='100%';
  newAdvCanvas.style["height"]='130%';


  rgnContent.appendChild(newAdvCanvas)

  return newAdvCanvas
}




function makeCanvas(stationsclkdContent) {


  while (stationsclkdContent.firstChild) {
    stationsclkdContent.removeChild(stationsclkdContent.firstChild);
  }

  var newCanvas = document.createElement('canvas');
  newCanvas.id = 'analyseCanvas'
  newCanvas.style["backgroundColor"] = "white"
  newCanvas.style["margin"] = "auto"
  newCanvas.style["display"] = "block"


  newCanvas.style["height"] = '90%';
  newCanvas.style["width"] = '100%';
  newCanvas.style["margin-top"] = '3%';
  newCanvas.style["borderRadius"] = "10px"


  //canvas.width  = canvas.offsetWidth;
  //canvas.height = canvas.offsetHeight;

  stationsclkdContent.appendChild(newCanvas)

  return newCanvas
}








//window["percent" + i] = createWindData(i);
  
export { createTable, getPrecipRecordData, getSnowfallRecordData, getTempRecordData, makeGraphic, makePie, retrieveData, retrieveAdvData, windGraphic, selectFullPeriod, getVerif, makeAdvCanvas, makeCanvas }
  
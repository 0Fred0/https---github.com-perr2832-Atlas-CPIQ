




import { makeGraphic, makePie, getXMLinfo, updateLayers, stepForward, stepBackward, retrieveData, retrieveAdvData, windGraphic, selectFullPeriod, yearSelection, getVerif, statVerif } from "./stats.js";







let layers_to_add = new ol.layer.Tile({
  source: new ol.source.OSM(),
  zIndex: 0
})


let regionLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './data/public_zones.json',
    format: new ol.format.GeoJSON() 
  }),
  zIndex: 1,
  title: 'regionLayer',
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0)'
    }), 
    stroke: new ol.style.Stroke({
      color: 'black'
    })
  })
})


let markerLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './data/stations.json',
    format: new ol.format.GeoJSON() 
  }),
  zIndex: 2,
  title: 'markerLayer',
  style: function(feature, resolution){


    var nonactive = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 1,
          fill: new ol.style.Fill({
              color: 'red'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });
    
    var brown = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'brown'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });

    var red = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'red'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });

    var yellow = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'yellow'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });

    var blue = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'blue'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });

    var orange = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'orange'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });

    

    var green = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'green'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });

    var orange = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'orange'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });

    var purple = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'purple'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });


    var cyan = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'cyan'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });


    var beige = new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'beige'
          }),
          stroke: new ol.style.Stroke({
            color: 'black'
          })
      })
    });


    if (feature.get("active") == 0) {
      return [nonactive]
    } else if (feature.get("provider") == "SMC / MSC") {
      return [brown]
    } else if (feature.get("provider") == "MDN / DND") {
      return [red]
    } else if (feature.get("provider") == "NAV Canada") {
      return [yellow]
    } else if (feature.get("provider") == "MELCC") {
      return [blue]
    } else if (feature.get("provider") == "ALCAN") {
      return [orange]
    } else if (feature.get("provider") == "DCF") {
      return [green]
    } else if (feature.get("provider") == "HYDRO") {
      return [purple]
    } else if (feature.get("provider") == "SOPFEU") {
      return [cyan]
    } else if (feature.get("provider") == "FADQ") {
      return [beige]
    }
}
})


let map = new ol.Map({
  target: 'map',
  layers: [layers_to_add, markerLayer, regionLayer],
  view: new ol.View({
    center: ol.proj.fromLonLat([-70, 50]),
    zoom: 5
  })
})



let GDPS_TT = new ol.layer.Tile({
  opacity: 0.4,
  source: new ol.source.TileWMS({
    url: "https://geo.weather.gc.ca/geomet",
    params: { LAYERS: "GDPS.ETA_TT", TILED: true },
    transition: 0
  }),
  title: "surfaceTemp",
  visible: false
})



let GDPS_HR = new ol.layer.Tile({
  opacity: 0.4,
  source: new ol.source.TileWMS({
    url: "https://geo.weather.gc.ca/geomet",
    params: { LAYERS: "GDPS.ETA_HR", TILED: true },
    transition: 0
  }),
  title: "surfaceHR",
  visible: false
});





let layerMaps = new ol.layer.Group({
  layers: [
    GDPS_TT, GDPS_HR
  ]
})

map.addLayer(layerMaps)








/**
 * Créer un élément "Overlay" pour ancrer la fenêtre contextuelle sur la carte
 */



/**

 */





    fetch("data/stations2.json")
       .then(response => response.json())
       .then(data => {

       var way = data.features
   
       var allVariables = []
       var stNames = []
       var stActivity = []

    


       for (var i = 0; i < way.length; i++ ) {
        allVariables.push([way[i].properties.name, way[i].properties.provider, way[i].geometry.coordinates[0], way[i].geometry.coordinates[1], way[i].properties.code.TC, way[i].properties.firstyearofactivity, way[i].properties.lastyearofactivity])
        stNames.push(way[i].properties.name)

        stActivity.push(way[i].properties.active)
       }

      
/*     ////// pour un tableau 1D //////
       function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
      }

*/  

      ////// pour un tableau mulit-D //////
      const res = allVariables.reduce((a, c) => {
        if (!a.find(v => v[0] === c[0])) {
          a.push(c);
        }
        return a;
      }, []);


      //var resr = allVariables.filter(onlyUnique);
      //var oneStNames = stNames.filter(onlyUnique);
  
      

      
     
    
      var airportStNames = []
      var nonairportStNames = []

      for (let i=0; i<res.length; i++) {
        if (res[i][0][0] == "✈") {
          airportStNames.push([res[i][0].slice(2) + " ✈", res[i][1], res[i][2], res[i][3], res[i][4], res[i][5], res[i][6]])
        } else {
          nonairportStNames.push([res[i][0],res[i][1],res[i][2],res[i][3], res[i][4], res[i][5], res[i][6]])
        }
        
      }
      //airportStNames = airportStNames.split(",")
      //nonairportStNames = nonairportStNames.split(",")

      //airportStNames = airportStNames.splice(0, airportStNames.length-1);
      //nonairportStNames = nonairportStNames.splice(0, nonairportStNames.length-1);



      


      var uniqueStNames = airportStNames.concat(nonairportStNames);

      

      function sortFunction(a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
      }


      uniqueStNames.sort(sortFunction)

      //uniqueStNames = uniqueStNames.sort();

     

      
      
    
      var stNamesOptions = ""

      for (let x of uniqueStNames) {
        if (x[0] == "Montréal - P.-E.-Trudeau ✈") {
          stNamesOptions += "<option selected=\"selected\"> " + x[0] + " </option>" + ","
        } else {
          stNamesOptions += "<option> " + x[0] + " </option>" + ","
        }
      }




      stNamesOptions = stNamesOptions.split(",")
      stNamesOptions = stNamesOptions.splice(0, stNamesOptions.length-1);

      console.log(stNamesOptions)


      document.getElementById("selectSt").innerHTML = stNamesOptions;




              /* 
        ************
        1. POUR L'OUVERTURE DE PAGE,
        ALLEZ CHERCHER DANS LE FICHIER LES INFOS SUR CYUL (BELLE MANIERE)
        MAIS ÇA DEMANDE D'OUVRIR LES FICHIERS DONC CERTAINEMENT PLUS DE CHARGEMENT
        ************

          fetch("data/stations2.json")
            .then(response => response.json())
            .then(data => {
            console.log(data)
            var way = data.features
            console.log(way.length)
            var cyulInfo = []
            for (var i = 0; i < way.length; i++ ) {
              if (way[i].properties.code.TC == "CYUL") {
              cyulInfo.push(way[i])
              } 
              
            } 
            
            console.log(cyulInfo)
            var cyulCoordinate = cyulInfo[1].geometry.coordinates;
            var cyullat = cyulCoordinate[0];
            var cyullon = cyulCoordinate[1];
            var cyulCode = cyulInfo[1].properties.code.TC
            var cyulProvider = cyulInfo[1].properties.provider

            });
      */

      // SI JE MET LA LIGNE stValue=...ici, et que je met stValue en variable pour la fonction, l'action 'change' ne fonctionne plus. Voir sur Internet pourquoi par curiosité
      function newInfo() {
        var stValue = document.getElementById("selectSt").value
        console.log('ETDE0')
        console.log(stValue)

    
        var newNetwork = []
        var newLng = []
        var newLat = []
        var newCode = []

        for (let i = 0; i < uniqueStNames.length; i++) {
          if (stValue == uniqueStNames[i][0]) {
            var newNetwork = uniqueStNames[i][1]
            var newLng = uniqueStNames[i][2]
            var newLat = uniqueStNames[i][3]
            var newCode = uniqueStNames[i][4]
          }
        }

        map.getView().setCenter(ol.proj.transform([newLng, newLat], 'EPSG:4326', 'EPSG:3857'));


        document.getElementById("lat").innerHTML = newLat
        document.getElementById("lng").innerHTML = newLng
        document.getElementById("ntw").innerHTML = newNetwork
        if (newCode == '') {
        document.getElementById("code").innerHTML = '/'
        } else {
        document.getElementById("code").innerHTML = newCode
        }


        makeWindGraph(stValue);


        return newLat, newLng, newNetwork, newCode
      }

      


    

        
/*
        markerLayer.setStyle(function(feature) {
     
          let stName     = feature.getProperty('name')
          let stProvider = feature.getProperty('provider')
          let stActive   = feature.getProperty('active')
          
          let scale, fillColor, symbol
          symbol = {
            path: 'circle',
            scale: 3,
            strokeColor: "red",
            strokeWeight: 1,
            fillColor: fillColor,
            fillOpacity: 1
          }
          return {
            icon: symbol,
            title: stName
        }

          })

*/


      

    var filter = document.getElementById("selectSt")
    filter.addEventListener("change", newInfo)
  


    


    
    
    
    var graph = document.getElementById("toggles");
   
   // var windChart = document.createElement("div");
   // windChart.id = "windChartID";
   // windChart.style.height = "100%";
   // div2.appendChild(windChart);
   graph.style.paddingLeft = "10px";
   graph.style.paddingRight = "10px";
   graph.style.paddingBottom = "10px";
   //graph.style.height = "90%";

    

    
    
  
    var stValue = document.getElementById("selectSt").value



    function makeWindGraph (stValue) {

      let windSpeedVariable = 'Spd of Max Gust (km/h)';
      let windDirectionVariable = 'Dir of Max Gust (10s deg)';

      let dayVariable = 'Day'
      let monthVariable = 'Month'
      let yearVariable = 'Year'


      var period = ['allyears','allmonths','alldays'];


      var newCode = []
      var firstYear = []
      var lastYear = []
      
      for (let i = 0; i < uniqueStNames.length; i++) {
        if (stValue == uniqueStNames[i][0]) {
          newCode = uniqueStNames[i][4]
          firstYear = uniqueStNames[i][5]
          lastYear = uniqueStNames[i][6]
        }
      }
      var dirPromise = retrieveData(newCode, windDirectionVariable, firstYear, lastYear)
      var spdPromise = retrieveData(newCode, windSpeedVariable, firstYear, lastYear)    
      var yearPromise = retrieveData(newCode, yearVariable, firstYear, lastYear)
      var monthPromise = retrieveData(newCode, monthVariable, firstYear, lastYear)
      var dayPromise = retrieveData(newCode, dayVariable, firstYear, lastYear)
   


      Promise.all([yearPromise, monthPromise, dayPromise, dirPromise, spdPromise])
      .then(values => {
        let values0 = values[0]
        let values1 = values[1]
        let values2 = values[2]
        let values3 = values[3]
        let values4 = values[4]

        


        let windDirectionPeriod = selectFullPeriod(values0, values1, values2, values3, period)
        let windSpeedPeriod = selectFullPeriod(values0, values1, values2, values4, period)

        let mergedWind = [windDirectionPeriod, windSpeedPeriod];
        
        return mergedWind
      
      })
      .then(result => {
        windGraphic(result[0],result[1])
      });
  }

  makeWindGraph(stValue);


  var mapHMTL = document.getElementById("map")

  var analyseSection = document.getElementById("analyse")

  var quitAnalyse = document.getElementById("close")
  
  var analyseBtn = document.getElementById("analyseBtn")
  var advBtn = document.getElementById("warningBtn")
  var SelectBtn = document.getElementsByClassName("selectButton")
  var SelectAdvBtn = document.getElementsByClassName("selectAdvButton")

  var variableBtn = document.getElementById("variableSelector")
  var variableAdvBtn = document.getElementById("variableAdvSelector")

  var yearSelector = document.getElementById("yearSelector")

  var goBtn = document.getElementById("goButton")
  var goAdvBtn = document.getElementById("goAdvButton")
  var analyseG = document.getElementById("analyseGraphs")




  analyseBtn.addEventListener("mouseover", (event) => {
    analyseBtn.style["cursor"] = "pointer"
  });

  
  analyseBtn.addEventListener("click", (event) => {

    console.log("analyseClicked")
    mapHMTL.style["grid-area"] = "2 / 2 / span 1 / span 1"
    mapHMTL.style["border-width"] = "0px 0px 2px 0px"
    mapHMTL.style["border-style"] = "solid"
    mapHMTL.style["border-color"] = "rgb(56, 101, 134)"


    analyseSection.style["visibility"] = "visible"
    variableBtn.style["visibility"] = "visible"
    variableAdvBtn.style["visibility"] = "hidden"
  //  yearSelector.style["marginLeft"] = "350px"





  var analyseSCN = document.getElementById("analyseGraphs")
  var columnLeft = document.getElementById("column-left")
  var columnRight = document.getElementById("column-right")

  while (columnLeft.firstChild) {
    columnLeft.removeChild(columnLeft.firstChild);
  }

  while (columnRight.firstChild) {
    columnRight.removeChild(columnRight.firstChild);
  }



  analyseSCN.style["gridTemplateColumns"] = "0% 100% 0%"


  var canvasSCN = document.getElementById('column-canvas')
  while (canvasSCN.firstChild) {
    canvasSCN.removeChild(canvasSCN.firstChild);
  }


  var newCanvas = document.createElement('canvas');
  newCanvas.id = 'analyseCanvas'
  newCanvas.style["backgroundColor"] = "white"
  newCanvas.style["margin"] = "auto"
  newCanvas.style["display"] = "block"


  newCanvas.style.width='80%';
  newCanvas.style.height='95%';

  canvasSCN.appendChild(newCanvas)

  
  });




  quitAnalyse.addEventListener("mouseover", (event) => {
    quitAnalyse.style["backgroundColor"] = "rgb(113, 121, 131, 0.2)"
  });

  quitAnalyse.addEventListener("mouseout", (event) => {
    quitAnalyse.style["backgroundColor"] = "rgb(113, 121, 131, 0)"
  });


  quitAnalyse.addEventListener("click", (event) => {
   
    mapHMTL.style["grid-area"] = "2 / 2 / span 2 / span 1"
    mapHMTL.style["border-width"] = "0px 0px 0px 0px"



    analyseSection.style["visibility"] = "hidden"
    variableBtn.style["visibility"] = "hidden"
    variableAdvBtn.style["visibility"] = "hidden"



    /*
    for (var i=0; i < SelectBtn.length; i++) {
      SelectBtn[i].style["visibility"] = "hidden"
    }
    */

  });



  goBtn.addEventListener("mouseover", (event) => {
    goBtn.style["cursor"] = "pointer"
  });










  advBtn.addEventListener("mouseover", (event) => {
    advBtn.style["cursor"] = "pointer"
  });


  advBtn.addEventListener("click", (event) => {
    mapHMTL.style["grid-area"] = "2 / 2 / span 1 / span 1"
    mapHMTL.style["border-width"] = "0px 0px 2px 0px"
    mapHMTL.style["border-style"] = "solid"
    mapHMTL.style["border-color"] = "rgb(56, 101, 134)"



    analyseSection.style["visibility"] = "visible"
    variableAdvBtn.style["visibility"] = "visible"
    variableBtn.style["visibility"] = "hidden"



    var analyseSCN = document.getElementById("analyseGraphs")
    var columnLeft = document.getElementById("column-left")
    var columnRight = document.getElementById("column-right")



    analyseSCN.style["gridTemplateColumns"] = "30% 40% 30%"




    var canvasSCN = document.getElementById('column-canvas')
    while (canvasSCN.firstChild) {
      canvasSCN.removeChild(canvasSCN.firstChild);
    }


    var newCanvas = document.createElement('canvas');
    newCanvas.id = 'analyseCanvas'
    newCanvas.style["backgroundColor"] = "white"
    newCanvas.style["margin"] = "auto"
    newCanvas.style["display"] = "block"


    newCanvas.style.width='100%';
    newCanvas.style.height='95%';
    //canvas.width  = canvas.offsetWidth;
    //canvas.height = canvas.offsetHeight;

      

    canvasSCN.appendChild(newCanvas)

    
    // yearSelector.style["marginLeft"] = "435px"
    //variableAdvBtn.style["marginLeft"] = "150px"


  });









  var canvas = document.querySelector('canvas');
  function fitToContainer(canvas) {
    var analyseG = document.getElementById("analyseGraphs")

    canvas.style.width = '80%';
    canvas.style.height = '95%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
   // analyseG.style.textAlign = "center";
  }
  fitToContainer(canvas);


  var stValue = document.getElementById("selectSt").value


  var newCode = []
  var firstYear = []
  var lastYear = []
  
  for (let i = 0; i < uniqueStNames.length; i++) {
    if (stValue == uniqueStNames[i][0]) {
      newCode = uniqueStNames[i][4]
      firstYear = uniqueStNames[i][5]
      lastYear = uniqueStNames[i][6]
    }
  }




  goBtn.addEventListener('click', (event) => {

    /*
    var canvas = document.getElementById('analyseCanvas')
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    */

    if (variableBtn.style["visibility"] == "visible") {
      console.log("OUI OUI")



      var canvasSCN = document.getElementById('column-canvas')
      while (canvasSCN.firstChild) {
        canvasSCN.removeChild(canvasSCN.firstChild);
      }

      var newCanvas = document.createElement('canvas');
      newCanvas.id = 'analyseCanvas'
      newCanvas.style["backgroundColor"] = "white"
      newCanvas.style["margin"] = "auto"
      newCanvas.style["display"] = "block"


      newCanvas.style.width='80%';
      newCanvas.style.height='95%';
      //canvas.width  = canvas.offsetWidth;
      //canvas.height = canvas.offsetHeight;

      canvasSCN.appendChild(newCanvas)

    

      var stValue = document.getElementById("selectSt").value
      var variableSCD = document.getElementById("variableSelector").value
      var yearSCD = document.getElementById("yearSelector").value
      var monthSCD = document.getElementById("monthOrPeriodSelector").value
      var daySCD = document.getElementById("daySelector").value

      var newCode = []
      var firstYear = []
      var lastYear = []
    
      for (let i = 0; i < uniqueStNames.length; i++) {
        if (stValue == uniqueStNames[i][0]) {
          newCode = uniqueStNames[i][4]
          firstYear = uniqueStNames[i][5]
          lastYear = uniqueStNames[i][6]
        }
      }
    
    

      let dayVariable = 'Day'
      let monthVariable = 'Month'
      let yearVariable = 'Year'

    
      var period = [yearSCD,monthSCD,daySCD]


    
      var yearPromise = retrieveData(newCode, yearVariable, firstYear, lastYear)
      var monthPromise = retrieveData(newCode, monthVariable, firstYear, lastYear)
      var dayPromise = retrieveData(newCode, dayVariable, firstYear, lastYear)
      var variablePromise = retrieveData(newCode, variableSCD, firstYear, lastYear)
      


    
    
    
    
      Promise.all([yearPromise, monthPromise, dayPromise, variablePromise])
      .then(values => {
        let values0 = values[0]
        let values1 = values[1]
        let values2 = values[2]
        let values3 = values[3]
        
      
    
        var dataArray = selectFullPeriod(values0, values1, values2, values3, period)

        makeGraphic(dataArray)
    
      });

    } else if (variableBtn.style["visibility"] == "hidden") {
      console.log("VICTOIRE")

      var analyseSCN = document.getElementById("analyseGraphs")
      var columnLeft = document.getElementById("column-left")
      var columnRight = document.getElementById("column-right")

      var textRight = document.getElementById("text-right")
      textRight.style["visibility"] = "visible" 

      columnLeft.style["visibility"] = "visible"


      var PODquestion = document.getElementById("PODquestion")
      var FARquestion = document.getElementById("FARquestion")
      var CSIquestion = document.getElementById("CSIquestion")
      var BIAISquestion = document.getElementById("BIAISquestion")


      var podSCN = document.getElementById("POD")
      var farSCN = document.getElementById("FAR")
      var csiSCN = document.getElementById("csi")
      var biaisSCN = document.getElementById("biais")





      /*
      var PODoverlay = document.getElementById("PODoverlay")
      var FARoverlay = document.getElementById("FARoverlay")
      var CSIoverlay = document.getElementById("CSIoverlay")
      var BIAISoverlay = document.getElementById("BIAISoverlay")

*/


      PODquestion.addEventListener("mouseover", (event) => {
        console.log("FONE")

        var PODoverlay = document.createElement("div")
        PODoverlay.innerHTML = "HDHHDHDHD"
        analyseSCN.appendChild(PODoverlay)
      })


      
      FARquestion.addEventListener("mouseover", (event) => {
        FARoverlay.style["visibility"] = "visible"
      })

      CSIquestion.addEventListener("mouseover", (event) => {
        CSIoverlay.style["visibility"] = "visible"
      })

      BIAISquestion.addEventListener("mouseover", (event) => {
        BIAISoverlay.style["visibility"] = "visible"
      })





      /*
      var textRight = document.createElement("div")
      textRight.innerHTML = 
      "D: succès" + "<br>" +
      "F: fausse alerte" + "<br>" +
      "MA: manqué (aucun WW émis)" + "<br>" +
      "MP0: manqué  ww émis trop tard" + "<br>" +
      "Mpi: manqué préavis insuffisant" + "<br>" +
      "MT: manqué timing" + "<br>" +
      "MQ: manqué quantité" + "<br>" +
      "U: Quasi succès" + "<br>" +
      "i: ignoré (quasi événement ou VTH/VBN) "

      columnRight.appendChild(textRight)
      textRight.style["padding"] = "20px"



      var buttonsContainer = document.createElement("div")
      buttonsContainer.style["width"] = "10px"
      
      var buttonOneLeft = document.createElement("button")
      buttonOneLeft.innerHTML = "POD"
      var questionmark = document.createElement("p")
      questionmark.innerHTML = "?"
      var buttonTwoLeft = document.createElement("button")
      buttonTwoLeft.innerHTML = "FAR"
      var buttonThreeLeft = document.createElement("button")
      buttonThreeLeft.innerHTML = "CSI"
      var buttonFourLeft = document.createElement("button")
      buttonFourLeft.innerHTML = "BIAIS"


      buttonsContainer.appendChild(buttonOneLeft)
      buttonsContainer.appendChild(questionmark)
      buttonsContainer.appendChild(buttonTwoLeft)
      buttonsContainer.appendChild(buttonThreeLeft)
      buttonsContainer.appendChild(buttonFourLeft)

      columnLeft.appendChild(buttonsContainer)

*/


      var canvasSCN = document.getElementById('column-canvas')
      while (canvasSCN.firstChild) {
        canvasSCN.removeChild(canvasSCN.firstChild);
      }


      var newCanvas = document.createElement('canvas');
      newCanvas.id = 'analyseCanvas'
      newCanvas.style["backgroundColor"] = "white"
      newCanvas.style["margin"] = "auto"
      newCanvas.style["display"] = "block"


      newCanvas.style.width='100%';
      newCanvas.style.height='95%';
      //canvas.width  = canvas.offsetWidth;
      //canvas.height = canvas.offsetHeight;

      

      canvasSCN.appendChild(newCanvas)


      var stValue = document.getElementById("selectSt").value
      var variableSCD = document.getElementById("variableAdvSelector").value
      var yearSCD = document.getElementById("yearSelector").value
      var monthSCD = document.getElementById("monthOrPeriodSelector").value
      var daySCD = document.getElementById("daySelector").value

      var newCode = []
      
    
      for (let i = 0; i < uniqueStNames.length; i++) {
        if (stValue == uniqueStNames[i][0]) {
          newCode = uniqueStNames[i][4]
        }
      }

      newCode = newCode.slice(1);  // pour matcher avec les codes de la verif

      // changer certains nom de stations dans le verif file pour que ça marche


      var coteArray = retrieveAdvData(newCode, variableSCD)
      console.log("DEUXIEME TEST")
      console.log(coteArray)
      coteArray
      .then(values => {
        console.log('valuestralala')
        console.log(values)


        let D = values[0]
        let MQ = values[1]
        let Mpi = values[2]
        let MT = values[3]
        let MA = values[4]
        let MP0 = values[5]
        let F = values[6]
        let U = values[7]
        let i = values[8]


        console.log("BCBCCBBC")

        let succes = D + MQ + Mpi + MT
        let manque = MA + MP0
  
        let POD = succes/(succes + manque)
        // let restPOD = 1 - POD
  
        let fausseAlerte = F + U
        
        let FAR = fausseAlerte/(succes + fausseAlerte)
        // let restFAR = 1 = FAR


        console.log(values)
        console.log(POD)
        console.log(FAR)

        makePie(values)




        var podNumber = document.createElement("div")
        podNumber.id = "podNumber"

        var farNumber = document.createElement("div")
        farNumber.id = "farNumber"


        if (document.contains(document.getElementById("podNumber"))) {
          document.getElementById("podNumber").remove();
        }


        if (document.contains(document.getElementById("farNumber"))) {
          document.getElementById("farNumber").remove();
        }


        var csiNumber = document.createElement("div")
        var biaisNumber = document.createElement("div")

        podNumber.innerHTML = POD + "%"
        farNumber.innerHTML = FAR + "%"


        podSCN.appendChild(podNumber)
        farSCN.appendChild(farNumber)





        
      })
    }
  });




  //yearSelection(yearID)

    
  let popupContainer = document.getElementById("popup");
  let content = document.getElementById("popup-content");
  let closer = document.getElementById("popup-closer");
  let cmdButtons = document.getElementById("cmdBtn");
  let geometSCN = document.getElementById("selectGeomet");
  let selectTime = document.getElementById("selectTime");






map.on("singleclick", function(event) {
  console.log("event")
  console.log(event)


  



  map.forEachFeatureAtPixel(event.pixel, function (feat, layer) {
    console.log("1")
    console.log(feat)
    console.log(layer)
    
    
    if (layer.values_.title == 'markerLayer') {

    
    let stationName = feat.values_.name;
    console.log(feat)
    console.log('stationName')

    console.log(stationName)

  


    var StNameModified = "" 

    if (stationName[0] == "✈") {
      StNameModified = stationName.slice(2) + " ✈"
    } else {
      StNameModified = stationName
    }
 

    var changeSelect = ""

    for (let x of uniqueStNames) {
      if (x[0] == StNameModified) {
        changeSelect += "<option selected=\"selected\"> " + x[0] + " </option>" + ","
        var newNetwork = x[1]
        var newLng = x[2]
        var newLat = x[3]
        var newCode = x[4]
        
        
      } else {
        changeSelect += "<option> " + x[0] + " </option>" + ","
      }
    }

    changeSelect = changeSelect.split(",")
    changeSelect = changeSelect.splice(0, changeSelect.length-1);


    // newLat = stationLat mais pris autrement etc...

    document.getElementById("selectSt").innerHTML = changeSelect;
    document.getElementById("lat").innerHTML = newLat
    document.getElementById("lng").innerHTML = newLng
    document.getElementById("ntw").innerHTML = newNetwork
    if (newCode == '') {
      document.getElementById("code").innerHTML = '/'
    } else {
      document.getElementById("code").innerHTML = newCode
    }



    console.log("ETDE1")
    console.log(StNameModified)


    makeWindGraph(StNameModified);


  } else if (layer.values_.title == 'regionLayer') {
    console.log("NNN")

    


  popupContainer.style["visibility"] = "visible"

  let overlay = new ol.Overlay({
    element: popupContainer,
    autoPan: false,
    autoPanAnimation: {
      duration: 250
    }
  });
  

  map.addOverlay(overlay)



  closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
}


  
    let coordinate = event.coordinate;
    let xy_coordinates = ol.coordinate.toStringXY(
      ol.proj.toLonLat(event.coordinate),
      4
    );
  
  
    layerMaps.getLayers().forEach(function(element, index, array) {
      if (element.getVisible() == true) {
        console.log("ELEMENT")
        console.log(element)
  
  
  
  
        let viewResolution = map.getView().getResolution();
        let wms_source = element.getSource();
        let url = wms_source.getFeatureInfoUrl(
          coordinate,
          viewResolution,
          "EPSG:3857",
          { INFO_FORMAT: "application/json" }
        );
       
        content.innerHTML = '<p align="center">Chargement...</p>';
        
        overlay.setPosition(event.coordinate);
  
  
          var title = element.get("title")
          var unity;
          var text;
          if (title == "surfaceTemp") {
            unity = "°C"
            text = "Température de l'air à la surface"
          } else if (title == "surfaceHR") {
            unity = "%";
            text = "Humidité relative à la surface"
          }
  
  
  
        if (url) {
          fetch(url)
            .then(function (response) {
              return response.json();           
            })
            .then(function (json) {
              console.log(Math.round(json.features[0].properties.value))
              content.innerHTML = 
              `${text}<br>
              Coordonnées (Lon/Lat): </> <code>${xy_coordinates}</code><br>
              Valeur: </b><code>${Math.round(json.features[0].properties.value)} ${unity}</code>`;
              
            });
        }

  
      }
    })
 
  
  };
});
});












 
  
    
    // Add a listener for the click event. Display the elevation for the LatLng of
    // the click inside the infowindow.
 
 


    // Function to retrieve elevation according to LatLon (URL : https://developers.google.com/maps/documentation/elevation/overview)
    // Needs specific google API to work (https://developers.google.com/maps/documentation/elevation/get-api-key)
  /*
  function displayLocationElevation(location, elevator) {
    // Initiate the location request
    elevator
      .getElevationForLocations({
        locations: [location],
      })
      .then(({ results }) => {
     //   infowindow.setPosition(location);
        // Retrieve the first result
        if (results[0]) {
        
          // Open the infowindow indicating the elevation at the clicked position.
          console.log("Results found")
        } else {
          console.log("No results found");
        }
      })
      .catch((e) =>
        console.log("Elevation service failed due to: " + e)
      );

      return results[0];

  }

*/

console.log('testVerif')
let verifFile = './data/verif/JSON/CWUL.json' 
let verifVariable = 'Crit�re atteint'


function critereAtteint () {
  let verifArray = getVerif(verifFile, verifVariable);
  console.log(verifArray)
}

let verifArray = getVerif(verifFile, verifVariable);
  console.log(verifArray)


console.log("MAAAAAAAP")
console.log(typeof map)










let goStartBtn = document.getElementById("goStartBtn")
let preStepBtn = document.getElementById("preStepBtn")
let nextStepBtn = document.getElementById("nextStepBtn")
let goEndBtn = document.getElementById("goEndBtn")
let timeSelector = document.getElementById("timeSelector")
let selectLayer = document.getElementById("selectLayer")
let geometLayers = 'off'




var geoMetBtn = document.getElementById("geometBtn");
geoMetBtn.addEventListener('click', (event) => {

  console.log(event)



  




 if (geometLayers == "off") {


  goStartBtn.style["visibility"] = "visible"
  preStepBtn.style["visibility"] = "visible"
  nextStepBtn.style["visibility"] = "visible"
  goEndBtn.style["visibility"] = "visible"
  selectLayer.style["visibility"] = "visible"
  timeSelector.style["visibility"] = "visible"

  console.log("AGAAAIN")

  console.log('haaaaaaaaa')





  layerMaps.getLayers().forEach(function(element, index, array) {
    let layerName = element.get("title");
    element.setVisible(layerName === selectLayer.value)
    console.log(element)
  });



selectLayer.addEventListener("change", (event) => {
  console.log("CNAHGES")


  layerMaps.getLayers().forEach(function(element, index, array) {
    let layerName = element.get("title");
    element.setVisible(layerName === selectLayer.value)
    console.log(element)
  });
})





  layerMaps.getLayers().forEach(function(element, index, array) {
  if (element.getVisible() == true) {
    let layerName = element.getSource().getParams().LAYERS

    
  getXMLinfo(layerName).then((data) => {
    let startTime = data[0];
    let endTime = data[1];
    let preTimeStep = data[2];
    let defautTime = data[3];




  if (currentTime == null) {
    currentTime = defautTime
  } else {
    currentTime = currentTime
  }
  console.log('layerName')

console.log(layerName)
  console.log(currentTime)
  console.log(element.getSource().getParams())

  updateLayers(element, currentTime);


})
  }
})








let currentTime = null;


function selectElement(id, valueToSelect) {    
  let element = document.getElementById(id);
  element.value = valueToSelect;
}



layerMaps.getLayers().forEach(function(element, index, array) {
  if (element.getVisible() == true) {

    let layerName = element.getSource().getParams().LAYERS


    getXMLinfo(layerName).then((data) => {
      let startTime = data[0];
      let endTime = data[1];
      let preTimeStep = data[2];
      let defautTime = data[3];
    
      let timeStepString = preTimeStep.replace(/[^\d]/g,'');
      let timestep = parseInt(timeStepString);
      let timeInZ = defautTime.toISOString().split('.')[0]+"Z"

      console.log(preTimeStep)
      console.log(timeStepString)
      console.log(timestep)

      console.log("DAAAAAAAAAAATE")
      console.log(data)

      console.log(startTime)
      console.log(endTime)
      console.log(preTimeStep)
      console.log(defautTime)



      var evoTime = new Date(data[0]);
      var el = []


      for (let i=0; i<250; i++) {
        if (el.length === 0) {
          el.push(evoTime.toISOString())
        } else {
          el.push(new Date (evoTime.setHours(evoTime.getHours() + 3)).toISOString());
        }
        if (el[i] == endTime.toISOString()) { break; }
      }

      console.log("HELLS")

      console.log(startTime)
      console.log(evoTime)

      console.log(el)

      let le = []
      for (let x of el) {
        le.push(x.split('.')[0]+"Z")
      }

      console.log(le)
      console.log(defautTime)
      console.log(timeInZ)


      let timeList = []
      for (let x of le) {

        if (x == timeInZ) {
          timeList.push("<option selected=\"selected\">" + x + "</option>")

        } else {
          timeList.push("<option>" + x + "</option>")
        }
      }

      console.log("thats GDPS_TT")
      console.log(GDPS_TT)
      console.log(currentTime)
  

      console.log(timeList)


      timeSelector.innerHTML = timeList

    })
  }
})



timeSelector.addEventListener('change', (event) => {


  layerMaps.getLayers().forEach(function(element, index, array) {
    if (element.getVisible() == true) {


  let timeSelected = new Date(timeSelector.value) 

  

  console.log('timeSelected')
  console.log(timeSelected)

  currentTime = timeSelected;

  console.log(currentTime)

  
  
  updateLayers(element, timeSelected);
  container.style["visibility"] = "hidden"



    }
  })
})






      goStartBtn.addEventListener("click", (event) => {


        layerMaps.getLayers().forEach(function(element, index, array) {
          if (element.getVisible() == true) {
            let layerName = element.getSource().getParams().LAYERS
            getXMLinfo(layerName).then((data) => {
              let startTime = data[0];
              let endTime = data[1];
              let preTimeStep = data[2];
              let defautTime = data[3];
              console.log("front")
              console.log(element)
              console.log('layename')
              console.log(layerName)
              let timeStepString = preTimeStep.replace(/[^\d]/g,'');
              let timestep = parseInt(timeStepString);

              let startTimeInZ = startTime.toISOString().split('.')[0]+"Z"

              currentTime = startTime;


        updateLayers(element, startTime);

        selectElement('timeSelector', startTimeInZ);
        popupContainer.style["visibility"] = "hidden"


          })
        }
      })

      })





    
      nextStepBtn.addEventListener("click", (event) => {
        layerMaps.getLayers().forEach(function(element, index, array) {
          if (element.getVisible() == true) {
            let layerName = element.getSource().getParams().LAYERS
     

            getXMLinfo(layerName).then((data) => {
              let startTime = data[0];
              let endTime = data[1];
              let preTimeStep = data[2];
              let defautTime = data[3];
              console.log("front")
              console.log(element)
              console.log('layename')
              console.log(layerName)
              let timeStepString = preTimeStep.replace(/[^\d]/g,'');
              let timestep = parseInt(timeStepString);


              console.log('layers')
              console.log(GDPS_HR)
              console.log(GDPS_TT)


              if (currentTime == null) {
                currentTime = defautTime
              } else {
                currentTime = currentTime
              }


              if (currentTime < endTime) {
                currentTime = new Date(currentTime);
                currentTime.setHours(currentTime.getHours() + timestep);
                updateLayers(element, currentTime);

              let currentTimeInZ = currentTime.toISOString().split('.')[0]+"Z"

              
              selectElement('timeSelector', currentTimeInZ);
              popupContainer.style["visibility"] = "hidden"




              } else {
                currentTime = currentTime
              }

            })

          } 
      
        // stepForward(element, layerName, currentTime)
        })
      })





      preStepBtn.addEventListener("click", (event) => {

        layerMaps.getLayers().forEach(function(element, index, array) {
          if (element.getVisible() == true) {
            let layerName = element.getSource().getParams().LAYERS
              

            getXMLinfo(layerName).then((data) => {
              let startTime = data[0];
              let endTime = data[1];
              let preTimeStep = data[2];
              let defautTime = data[3];
              console.log("front")
              console.log(element)
              console.log('layename')
              console.log(layerName)
              let timeStepString = preTimeStep.replace(/[^\d]/g,'');
              let timestep = parseInt(timeStepString);

        console.log("back")

        console.log(element)


        if (currentTime == null) {
          currentTime = defautTime
          console.log('null')
        } else {
          currentTime = currentTime
        }

        if (currentTime > startTime) {
        console.log("BACK")

          currentTime = new Date(currentTime);
          currentTime.setHours(currentTime.getHours() - timestep);
          updateLayers(element, currentTime);
          console.log(currentTime)
          let currentTimeInZ = currentTime.toISOString().split('.')[0]+"Z"

              
          selectElement('timeSelector', currentTimeInZ);
          popupContainer.style["visibility"] = "hidden"




        } else {
          currentTime = currentTime
        console.log("else")
        console.log(currentTime)
        console.log(startTime)

        }


      })

      } 

      // stepForward(element, layerName, currentTime)
      })
      
      })



      goEndBtn.addEventListener("click", (event) => {


        layerMaps.getLayers().forEach(function(element, index, array) {
          if (element.getVisible() == true) {
            let layerName = element.getSource().getParams().LAYERS
            getXMLinfo(layerName).then((data) => {
              let startTime = data[0];
              let endTime = data[1];
              let preTimeStep = data[2];
              let defautTime = data[3];
              console.log("front")
              console.log(element)
              console.log('layename')
              console.log(layerName)
              let timeStepString = preTimeStep.replace(/[^\d]/g,'');
              let timestep = parseInt(timeStepString);

              let endTimeInZ = endTime.toISOString().split('.')[0]+"Z"
              currentTime = endTime;


        updateLayers(element, endTime);

        selectElement('timeSelector', endTimeInZ);
        popupContainer.style["visibility"] = "hidden"


          })
        }
      })

      })






      


     // document.getElementById("timeSelector").innerHTML = "<option selected=\"selected\">" + timeInZ + "</option>"
     // console.log("TIIIME")


console.log('1')
console.log(geometLayers)

geometLayers = 'on'

console.log('2')
console.log(geometLayers)



 } else if (geometLayers == "on") {

  layerMaps.getLayers().forEach(function(element, index, array) {
    element.setVisible(false)
  });

  console.log("Thisishidden")
  goStartBtn.style["visibility"] = "hidden"
  preStepBtn.style["visibility"] = "hidden"
  nextStepBtn.style["visibility"] = "hidden"
  goEndBtn.style["visibility"] = "hidden"
  selectLayer.style["visibility"] = "hidden"
  timeSelector.style["visibility"] = "hidden"
  geometLayers = 'off'


 }

});




       


//console.log(newVariables[0])

/*
async function asyncCall() {
  console.log('calling');
  const result = await getVerif(verifFile);
  console.log(result);
  // expected output: "resolved"
}

asyncCall();
*/

//let { array_WX, array_Fin, array_Date, array_rgn, array_WX2, array_Cote, array_Vigie, array_Source, array_Fin2, array_texte, array_Faible, array_Cote2, array_WOCN, array_Dateconvertie, array_Critereatteint, array_Debut, array_Debut2, array_Details, array_Extreme, array_Moderee, array_Preavis, array_Region, array_Termine, array_Elevee, array_Emis, array_Evenementsdetail, array_ImpactsCommentaires, arrayNiveaudImpact, array_WXconvertie, array_WXconvImpacts } = getVerif(verifFile)



});



//statVerif(array_WX)






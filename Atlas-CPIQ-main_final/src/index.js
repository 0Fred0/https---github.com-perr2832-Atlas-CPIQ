

/*
 Ce script est construit pour avoir un seul singleClick et pointerMove que j'utilise indépendemment de chaque bouton en assignant un code si une couche est active.
 Un autre moyen serait de faire plusieurs singleClick et pointerMove qui sont écrit à l'intérieur de chaque bouton. Voir si c'est plus efficace. 
 pour que la 2ème solution fonctionne, il faut apparemment que les couches soient également définie à l'intérieur des boutons.
*/


// regarder Matagami A avril 2014 pour les données historiques. Trouver une solution pour les dates manquantes...


// demander à Bessam si pour les avertissements on sépare PO et TPO, VV et TVV etc...


// Revoir pourquoi on intègre pas la couche maritime dès le début


import { createTable, getPrecipRecordData, getSnowfallRecordData, getTempRecordData, makeGraphic, makePie, retrieveData, retrieveAdvData, windGraphic, selectFullPeriod, getVerif, makeAdvCanvas, makeCanvas } from "./stats.js";






///////// Ajout des couches à la map ///////////


// couche de fond
console.log(document.getElementById("container"))

let OSM_layer = new ol.layer.Tile({
  source: new ol.source.OSM(),
  zIndex: 0
})


// couche pour les stations ltce 


var stationsCoo = [{lon: -77.78, lat: 48.1, id: "Val-d'or"}, {lon: -75.58, lat: 45.33, id: "Ottawa"}, {lon: -73.65, lat: 45.52, id: "Montréal"}, {lon: -71.9, lat: 45.4, id: "Sherbrooke"}, {lon: -71.22, lat: 46.82, id: "Québec"}, {lon: -71.07, lat: 48.42, id: "Saguenay"}, {lon: -72.27, lat: 48.52, id: "Roberval"}, {lon: -68.53, lat: 48.45, id: "Rimouski"}, {lon: -66.38, lat: 50.2, id: "Sept-îles"}, {lon: -64.48, lat: 48.83, id: "Gaspé"}]


  let LTCE_layer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    zIndex: 2,
    title: 'LTCE_layer',
    style: new ol.style.Style({
      image: new ol.style.Icon({
      anchor: [0.5, 1],
      crossOrigin: 'anonymous',
      //src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
      src: 'https://raw.githubusercontent.com/maptiler/openlayers-samples/main/default-marker/marker-icon.png',
      scale: 1

      })  
  })
    })


    for (let i = 0; i < stationsCoo.length; i++) {
      LTCE_layer.getSource().addFeature(createMarker(stationsCoo[i].lon, stationsCoo[i].lat, stationsCoo[i].id));
  }
  
  function createMarker(lng, lat, id) {
      return new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
          id: id
      });
  }




// couche pour les stations maritimes 

const maritimeStationFile = './data/maritimeStations.json';
getData();

async function getData () {
   await fetch(maritimeStationFile)
  .then(response => response.json())
  .then(data => {




  let maritimeStationLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    zIndex: 1,
    visible: false,
    title: 'maritimeStationLayer',
    style: new ol.style.Style({
      text: new ol.style.Text({
        text: "textBox", 
        font: '15px',
        backgroundStroke: new ol.style.Stroke({
          color: 'blue',
          width: 2
        })
      }),   
    })
  })


    for (let i = 0; i < data.length; i++) {
      maritimeStationLayer.getSource().addFeature(createMarMarker(data[i].longitude, data[i].latitude, data[i].id, data[i].code, data[i].officialName, data[i].type));
  }



  
  function createMarMarker(lng, lat, id, code, officialName, type) {
      return new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
          id: id, 
          latitude: lat,
          longitude: lng,
          code: code,
          name: officialName,
          type: type
      });
  }

  map.addLayer(maritimeStationLayer)

})
}





// couche pour les régions administratives du Québec


let region_layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './data/public_zones.json',
    format: new ol.format.GeoJSON() 
  }),
  zIndex: 1,
  title: 'region_layer',
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0)'
    }), 
    stroke: new ol.style.Stroke({
      color: 'black'
    })
  })
})


// style avec une couleur grise quand on passe au dessus des régions et que l'on activera dans la section vérification

const styleHover = new ol.style.Style({
  fill: new ol.style.Fill ({
    color: 'rgba(128, 128, 128, 0.6)',
  }),
  stroke: new ol.style.Stroke ({
    color: 'black',
    width: 2,
  }),
});



// style avec une couleur rouge quand on clique sur une région et que l'on activera dans la section vérification

const styleClicked = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255,0,0,0.4)'
  }), 
  stroke: new ol.style.Stroke({
    color: 'black',
    width: 2
  })
})




// couche avec toutes les stations météo du Québec que l'on visualise dans la section analyse 

let stations_layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './data/station_list.json',
    format: new ol.format.GeoJSON() 
  }),
  zIndex: 2,
  title: 'stations_layer',
  visible: false,
  style: function allStations (feature, resolution) {


    
    
    var orange = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 2,
        fill: new ol.style.Fill({
            color: 'orange'
        }),
        stroke: new ol.style.Stroke({
          color: 'black'
        })
      })
    }) 



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
    })

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
    })


  // afin de ne pas afficher toutes les stations en même temps, on les discrimine suivant leur date et on peut sélectionner celles qu'on désire afficher

    let box1 = document.getElementById("checkbox1")
    let box2 = document.getElementById("checkbox2")
    let box3 = document.getElementById("checkbox3")


    if (parseInt(feature.get("LAST_DATE").slice(0,4)) == 2024 && box1.checked) {
      return [blue]
    } else if (parseInt(feature.get("LAST_DATE").slice(0,4)) >= 2000 && box2.checked) {
      return [green]
    } else if (parseInt(feature.get("LAST_DATE").slice(0,4)) < 2000 && box3.checked) {
      return [orange]
    }
  }
})



// style rouge pour la station quand on clique dessus

var circleClicked = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 4,
    fill: new ol.style.Fill({
      color: 'red'
    }),
    stroke: new ol.style.Stroke({
      color: 'black'
    })
  })
})



var hideCircle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 4,
    fill: new ol.style.Fill({
      color: 'rgb(0,0,0,0)',
    }),
    stroke: new ol.style.Stroke({
      color: 'rgb(0,0,0,0)'
    }),
  })
})




/*
var circleMover = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 4,
    fill: new ol.style.Fill({
      color: 'yellow'
    }),
    stroke: new ol.style.Stroke({
      color: 'black'
    })
  })
})
*/



// Intégration des différentes couches à la map

let map = new ol.Map({
  controls : ol.control.defaults.defaults()
                .extend([ new ol.control.FullScreen() ]),
  interactions : ol.interaction.defaults.defaults({doubleClickZoom :false}),
  layers: [OSM_layer, LTCE_layer, stations_layer, region_layer],
  target: 'map',
  
  view: new ol.View({
    center: ol.proj.fromLonLat([-70, 50]),
    zoom: 5
  })
})


// A peu près sûr que cette section ne sert à rien, à enlever

/*
// Fetch all the details element.
const details = document.querySelectorAll("details");

// Add the onclick listeners.
details.forEach((targetDetail) => {
  targetDetail.addEventListener("click", () => {
    // Close all the details that are not targetDetail.
    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute("open");
      }
    });
  });
});
*/


/////////////////////////////////////////////////////////////////

/*
    Cette section sert uniquement à comparer les records déterminer par les étudiants (et que l'on retrouve dans la section records mensuels) 
    avec les records journaliers récupérer avec l'API GeoMet-OGC-API. Le but est de vérifier si le record mensuel est accordé à la bonne journée dans le document fait par les étudiants
    (quelques différence ont été trouvée car les stations LTCE n'étaient pas construites de la même façon)
    Cette section n'est donc pas utile en sois pour l'application. La comparaison sera vue dans la console.
*/

    function lookForMaxTemp (testStation, theMonth) {
      return new Promise(function (resolve, reject) {
        fetch(`https://api.weather.gc.ca/collections/ltce-temperature/items?f=json&VIRTUAL_STATION_NAME_E=${testStation}`)
            .then(function (response) {
              return response.json();           
            })
            .then(function (json) {
              let dataMax = []
              let dataMaxDay = []
              let dataMaxYear = []


              let dataMin = []
              let dataMinDay = []
              let dataMinYear = []

              let dataList = json.features

        
              for (let x of dataList) {
                if (x.properties["LOCAL_MONTH"] == theMonth) {
                  dataMax.push(x.properties["RECORD_HIGH_MAX_TEMP"])
                  dataMin.push(x.properties["RECORD_LOW_MIN_TEMP"])
                }
              }

              let max = Math.max(...dataMax)
              let min = Math.min(...dataMin)

         

              for (let x of dataList) {
                if (x.properties["RECORD_HIGH_MAX_TEMP"] == max && x.properties["LOCAL_MONTH"] == theMonth) {
                  dataMaxDay.push(x.properties["LOCAL_DAY"])
                  dataMaxYear.push(x.properties["RECORD_HIGH_MAX_TEMP_YR"])
                }
              }


              for (let x of dataList) {
                if (x.properties["RECORD_LOW_MIN_TEMP"] == min && x.properties["LOCAL_MONTH"] == theMonth) {
                  dataMinDay.push(x.properties["LOCAL_DAY"])
                  dataMinYear.push(x.properties["RECORD_LOW_MIN_TEMP_YR"])
                }
              }



              let maxArr = [max, dataMaxDay, dataMaxYear]
              let minArr = [min, dataMinDay, dataMinYear]



              let data = [maxArr, minArr]
              resolve(data)
            })
          })
        }

        function cities (city, month) {
          let testTempMax = lookForMaxTemp(city, month)

          Promise.all([testTempMax])
          .then(values => {

      
          })
        }



        cities("Ottawa", 1)
        cities("Ottawa", 2)
        cities("Ottawa", 3)
        cities("Ottawa", 4)
        cities("Ottawa", 5)
        cities("Ottawa", 6)
        cities("Ottawa", 7)
        cities("Ottawa", 8)
        cities("Ottawa", 9)
        cities("Ottawa", 10)
        cities("Ottawa", 11)
        cities("Ottawa", 12)

////////////////////////////////////////////////////////////////////////////







    /* 
    Après avoir crée les couches au moyen du code au-dessus, on veut maintenant pouvoir remplir la section "informations" (code des stations, années d'activités etc...).
    On a 4 sections qui afficheront chacune des informations différentes (LTCE, stations météo, régions administratives et stations maritimes)
    Nous récupéront ici les données des 3 fichiers correspondant (pour les stations LTCE, n'ayant pas de fichier, nous construiront les informations nous-mêmes). 
    On les appelle en même temps pour tout mettre dans une même variable à plusieurs dimensions. Chaque dimension de la variable correspond à un fichier que l'on appellera quand on en aura besoin. 
    Ainsi, tout le code est contenu dans cette promesse.
    */


    const stations = fetch("data/stations2.json").then(res => res.json())
    const regionList = fetch("data/public_zones.json").then(res => res.json())
    const stationList = fetch("data/station_list.json").then(res => res.json())
    const maritimeList = fetch("data/maritimeStations.json").then(res => res.json())

    // stations n'est pas utilisé


    Promise.all([stations, regionList, stationList, maritimeList]).then(values => {



    //// Création de la variable pour les régions administratives ////

   var rgnFeatures = values[1].features

   var rgnVariables = []

   for (var i = 0; i < rgnFeatures.length; i++ ) {
    if (rgnFeatures[i].properties.PROVINCE_C == 'QC') {
       // on prend uniquement les régions québecoises pour ne pas surcharger la page
     rgnVariables.push([rgnFeatures[i].properties.NAME, rgnFeatures[i].properties.PERIM_KM, rgnFeatures[i].properties.AREA_KM2, rgnFeatures[i].properties.NOM, rgnFeatures[i].properties.LAT_DD, rgnFeatures[i].properties.LON_DD, rgnFeatures[i].properties.PROVINCE_C, rgnFeatures[i].properties.POLY_ID])
    }
   }



    ////  Création la variable pour les stations météo ////

      let stationFeat = values[2].features

      let stationVariables = []
      let firstYear = []
      let lastYear = []
      let lng = []
      let lat = []

      for (let i = 0; i < stationFeat.length; i++) {  
       // on prend uniquement les stations québecoises pour ne pas surcharger la page
        lng = Math.round(stationFeat[i].geometry.coordinates[0] * 100) / 100
        lat = Math.round(stationFeat[i].geometry.coordinates[1] * 100) / 100
        firstYear = parseInt(stationFeat[i].properties.FIRST_DATE.slice(0,4))
        lastYear = parseInt(stationFeat[i].properties.LAST_DATE.slice(0,4))
        stationVariables.push([stationFeat[i].properties.STATION_NAME, stationFeat[i].properties.PROV_STATE_TERR_CODE, stationFeat[i].properties.CLIMATE_IDENTIFIER, stationFeat[i].properties.TC_IDENTIFIER, lng, lat, firstYear, lastYear, stationFeat[i].properties.ELEVATION])
      }

      

      console.log(stationVariables)



      //// Création de la variable pour les stations maritimes ////

      let maritimeFeat = values[3]    // le fichier maritimeStations n'est pas un GeoJSON et est construit différemment. Pas de .features ici.

      let maritimeVariables = []

      for (let i = 0; i < maritimeFeat.length; i++) {
        maritimeVariables.push([maritimeFeat[i].code, maritimeFeat[i].id, maritimeFeat[i].latitude, maritimeFeat[i].longitude, maritimeFeat[i].officialName, maritimeFeat[i].operating, maritimeFeat[i].timeSeries, maritimeFeat[i].type])
      }




  //// Création de la variable pour les stations LTCE ////

  var LTCE_name = ['Saguenay', 'Gaspé', 'Montréal', 'Ottawa', 'Québec', 'Rimouski', 'Roberval', 'Sept-îles', 'Sherbrooke', 'Val-d\'or']
 
  var LTCE_lat = ['48.33', '48.78', '45.47', '45.32', '46.79', '48.61', '48.52', '50.22', '45.44', '48.05']
  var LTCE_lng = ['-71', '-64.48', '-73.74', '-75.67', '-71.39', '-68.21', '-72.27', '-66.27', '-71.69', '-77.78']
  var LTCE_alt = ['159.1', '34.1', '36', '114.9', '74.4', '52.4', '178.6', '54.9', '241.4', '337.4']

  let LTCE_variables = []

  for (let i = 0; i < LTCE_name.length; i++) {
    LTCE_variables.push([LTCE_name[i], LTCE_lat[i], LTCE_lng[i], LTCE_alt[i]])
  }



    /*
  Quand on ouvre une section en cliquant sur son bouton, on veut faire apparaître dans la barre de sélection la liste des éléments correspondant à cette couche.
  Au-delà de l'utilité sur le site, on utilisera cette barre de sélection dans le code pour définir quelle couche est actuellement active, ce qui sera primordiale pour les section "click" et "pointermove".
  Ici, on commence par créer les 4 variables, correspondantes aux 4 boutons, que l'on mettra ensuite dans la barre de sélection. 
  */


  function sortFunction(a, b) {     // Cette fonction permet de trier les variables dans l'ordre alphabétique
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
  }


  function createSelecList (variable, index) {
    variable.sort(sortFunction)

    var selecList = "<option selected=\"selected\"> </option>"
    
    for (let x of variable) {
      selecList += "<option> " + x[index] + " </option>" + ","     // dans rgnVariables, x[3] correspond à .NOM
    }

    return selecList
  }

  let rgn_selecList = createSelecList(rgnVariables, 3)   // dans rgnVariables, x[3] correspond à .NOM
  let QCst_selecList = createSelecList(stationVariables, 0)   // dans stationVariables, x[0] correspond à .STATION_NAME
  let maritime_selecList = createSelecList(maritimeVariables, 4)   // dans maritimeVariables, x[4] correspond à .officialName
  let LTCE_selecList = createSelecList(LTCE_variables, 0)   // dans LTCE_variables, x[0] correspond à .name







  
  // Sur la page d'accueil du site, on se trouve dans la section "station LTCE". C'est donc celle-ci que l'on met initiallement dans la barre de sélection.
     document.getElementById("selectSt").innerHTML = LTCE_selecList
  
  /*
   Les 4 variables définies rgn_selecList, QCst_selecList, maritime_selecList, LTCE_selecList seront donc utilisées 
   dans la barre de sélection lorsque la section sera activée en appuyant sur le bouton correspondant
  */


//////////////////////////////////////////////////////////////////



      var dataBtn = document.getElementById("dataBtn")
      var verifBtn = document.getElementById("verifBtn")
      var LTCEBtn = document.getElementById("LTCEBtn")
      var maritimeBtn = document.getElementById("maritimeBtn")
      var goBtnX = document.getElementById("goButtonX")

      var stationsLegend = document.getElementById("stationsLegend")
      var maritimeLegend = document.getElementById("maritimeLegend")

      let stationPopupContainer = document.getElementById('stationsoverlay')
      let stationContent = document.getElementById('stationsoverlay-content')
    
      let stationsclkdPopupContainer = document.getElementById('stationsclkdpopup')
      let stationsclkdContent = document.getElementById('stationsclkdpopup-content')
    
      let  yearSelectorX = document.getElementById("yearSelectorX");
      let  monthSelectorX = document.getElementById("monthSelectorX");
      let  daySelectorX = document.getElementById("daySelectorX");


      
      //let maritimeStationspopupContainer = document.getElementById('maritimeStationspopup')
      //let maritimeStationspopupContent = document.getElementById('maritimeStationspopup-content')

      let LTCE_popupContainer = document.getElementById('LTCE_popup')
      let LTCE_content = document.getElementById('LTCE_popup-content')

      var effDate = document.getElementById("effective-date")
      var effDateMaritime = document.getElementById("effective-date-maritime")    

      var rdjourBtn = document.getElementById("rdjour")
      var rdmensBtn = document.getElementById("rdmens")

      var link1Btn = document.getElementById("link1")
      var link2Btn = document.getElementById("link2")
      var link3Btn = document.getElementById("link3")


      var link4Btn = document.getElementById("link4")
      var link5Btn = document.getElementById("link5")
      var link6Btn = document.getElementById("link6")
      


      var formQuestion__title = document.getElementById("form-question__title")
      var inputContainer = document.getElementById("input-container")




      //// fonction utilisée pour les stations virtuelles. À voir si je la met dans le singleClick ou pas...
      function addSomeDate(number) {
        var date = new Date();


        date.setDate(date.getDate() + number);

        date.setHours(date.getHours() - 4)    // 5 en hiver, 4 en été


        var SelectedDate = date.toISOString()


        var Arr = SelectedDate.split("-")

        var year = Arr[0]

        var month = Arr[1]

        var dayTime = Arr[2]

        var dayTimeArr = dayTime.split("T")

        var day = dayTimeArr[0]

        day = Number(day)
        month = Number(month)
        year = Number(year)


        return [year, month, day]
      }


      var today = addSomeDate(0)

      var todayYear = today[0]
      var todayMonth = today[1]
      var todayDay = today[2]
    
      let regionSelected = null;
      let circleSelected = null;

      let selected = null;
      let circleHover = null;
    
      const variableIndividualData = {}

      let advSection = 'off'
 
      function makeWindGraph (stValue) {


        /*
              var toggles = document.getElementById('toggles')
              while (toggles.firstChild) {
                toggles.removeChild(toggles.firstChild);
              }
        */
        
              let windSpeedVariable = 'SPEED_MAX_GUST';
              let windDirectionVariable = 'DIRECTION_MAX_GUST';
        
              let dayVariable = 'LOCAL_DAY'
              let monthVariable = 'LOCAL_MONTH'
              let yearVariable = 'LOCAL_YEAR'
        
        
              var period = ['allyears','allmonths','alldays'];   // tant que c'est pas un nombre, on guarde toute la matrice associée à chaque bouton de sélection (voir function selectFullPeriod)
        
        
              var newClimateID = []
              var firstYear = []
              var lastYear = []
              
              for (let i = 0; i < stationVariables.length; i++) {                                       // voir si je peux en faire une fonction comme je l'utilise souvent
                if (stValue == stationVariables[i][0]) {
                  newClimateID = stationVariables[i][2]
                  firstYear = stationVariables[i][6]
                  lastYear = stationVariables[i][7]
                }
              }
              var dirPromise = retrieveData(newClimateID, windDirectionVariable, firstYear, lastYear)
              var spdPromise = retrieveData(newClimateID, windSpeedVariable, firstYear, lastYear)    
              var yearPromise = retrieveData(newClimateID, yearVariable, firstYear, lastYear)
              var monthPromise = retrieveData(newClimateID, monthVariable, firstYear, lastYear)
              var dayPromise = retrieveData(newClimateID, dayVariable, firstYear, lastYear)
           
        
        
              Promise.all([yearPromise, monthPromise, dayPromise, dirPromise, spdPromise])
              .then(values => {
        
                let values0 = values[0]
                let values1 = values[1]
                let values2 = values[2]
                let values3 = values[3]
                let values4 = values[4]
        
                
        
        
                let windDirectionPeriod = selectFullPeriod(values0, values1, values2, values3, period)
                let windSpeedPeriod = selectFullPeriod(values0, values1, values2, values4, period)
        
                windDirectionPeriod = windDirectionPeriod.map(x => x[3]);   // on prend les veleurs en se débarrassant des jours, mois, années
                windSpeedPeriod = windSpeedPeriod.map(x => x[3]);
        
        
        
                let mergedWind = [windDirectionPeriod, windSpeedPeriod];
                
                return mergedWind
              
              })
              .then(result => {
                windGraphic(result[0],result[1])
                document.getElementById('loader').style['display'] = 'none'
                document.getElementById('graphics').style['display'] = 'block'

              });
      }

          
      // SI JE MET LA LIGNE stValue=...ici, et que je met stValue en variable pour la fonction, l'action 'change' ne fonctionne plus. Voir sur Internet pourquoi par curiosité
 
      // La fonction newInfo est utilisée pour mettre à jour la partie "information" lorsque l'on sélectionne (clique) un élément
 
      function newInfo() {



        var stValue = document.getElementById("selectSt").value

        if (document.getElementById("selectSt").innerHTML == rgn_selecList) {

          let rgnPopupContainer = document.getElementById('rgnpopup')
          rgnPopupContainer.style["display"] = "none"
    
    
          var newName = []
          var newPerimeter = []
          var newArea = []
          var newLat = []
          var newLng = []
          var newPolyId = []
     
    
          for (let i = 0; i < rgnVariables.length; i++) {
            if (stValue == rgnVariables[i][3]) {              /// x[3] correspond dans rgnVariables à .NOM
              newName += rgnVariables[i][0]
              newPerimeter += rgnVariables[i][1]
              newArea += rgnVariables[i][2]
              newLat += rgnVariables[i][4]
              newLng += rgnVariables[i][5]
              newPolyId += rgnVariables[i][7]
            }
          }
    
          
          if (stValue.length != 0) {
            map.getView().setCenter(ol.proj.transform([newLng, newLat], 'EPSG:4326', 'EPSG:3857'));
          }
          
       
          document.getElementById("info1").innerHTML = newPerimeter
          document.getElementById("info2").innerHTML = newArea
          document.getElementById("info3").innerHTML = newPolyId
    
    
          // code probablement utile mais que je ne comprend pas. À revoir.
          if (typeof newName == 'string') {
          document.getElementById("code").innerHTML = newName
          } else {
          document.getElementById("code").innerHTML = 'CODE |'
          document.getElementById("info1").innerHTML = ''
          document.getElementById("info2").innerHTML = ''
          document.getElementById("info3").innerHTML = ''
          document.getElementById("info4").innerHTML = ''
          document.getElementById("info5").innerHTML = ''
          }
    
        
          let source = region_layer.getSource()
          let feat = source.getFeatures()
          
          if (regionSelected !== null) {
            regionSelected.setStyle(undefined);
            regionSelected = null;
          }
    
          for (let x of feat) {
            if (x.values_.NOM == stValue) {
                regionSelected = x
                x.setStyle(styleClicked);
                return true
            }
          }
    
    
        } else if (document.getElementById("selectSt").innerHTML == QCst_selecList) {   // pour essayer que le advFilter fonctionne. Faire des essaies puis enlever si ce n'est pas nécessaire


          let stationsclkdPopupContainer = document.getElementById('stationsclkdpopup')
          stationsclkdPopupContainer.style["display"] = "none"

        
      ////////////  reprendre ici avec multipleSt

          if (circleSelected !== null) {
            
            circleSelected.setStyle(undefined);
            circleSelected = null;
          }

          


          var source = stations_layer.getSource()
          var features = source.getFeatures()

          var selectedStation = [] // autre nom ? selectedStation ?


          for (let x of features) {
            if (x.values_.STATION_NAME == stValue) {
              circleSelected = x
              selectedStation.push(x)

              circleSelected.setStyle(circleClicked)
            }
          }


        //  var newmultipleSt = Object.entries(multipleSt)
        

      
          var newNetwork = [] // ajouter ?

          var newName = []
          var newClimateID = []
          var newTCIdentifier = []
          var newLng = []
          var newLat = []
          var newFirstYear = []
          var newLastYear = []
          var newAlt = []

          for (let i = 0; i < stationVariables.length; i++) {
            if (stValue == stationVariables[i][0]) {
              newName += stationVariables[i][0]
              newClimateID += stationVariables[i][2]
              newTCIdentifier += stationVariables[i][3]
              newLng += stationVariables[i][4]
              newLat += stationVariables[i][5]
              newFirstYear += stationVariables[i][6]
              newLastYear += stationVariables[i][7]
              newAlt += stationVariables[i][8]
            }
          }
       
          
          if (stValue.length != 0) {
            map.getView().setCenter(ol.proj.transform([newLng, newLat], 'EPSG:4326', 'EPSG:3857'));
          }
          


          document.getElementById("info1").innerHTML = newLat
          document.getElementById("info2").innerHTML = newLng


          if (newAlt == '' || newAlt == null) {
            document.getElementById("info3").innerHTML = '/'
          } else {
            document.getElementById("info3").innerHTML = newAlt + ' m.'
          }

          // lequel des deux ?
          document.getElementById("info4").innerHTML = `${newFirstYear} - ${newLastYear}`
          document.getElementById("info4").innerHTML = newFirstYear + '-' + newLastYear

          document.getElementById("info5").innerHTML = newClimateID

          if (newTCIdentifier == "" || newTCIdentifier == null) {
            document.getElementById("code").innerHTML = '/'
          } else {
            document.getElementById("code").innerHTML = newTCIdentifier
          }

          makeWindGraph(stValue);

        


        } else if (document.getElementById("selectSt").innerHTML == maritime_selecList) {

          // enlever la coucher des vagues

          var newName = []
          var newLat = []
          var newLng = []
          var newId = []
          var newCode = []
          var newType = []
      
      
          for (let i = 0; i < maritimeVariables.length; i++) {
            
            if (stValue == maritimeVariables[i][4]) {    
              newCode += maritimeVariables[i][0]
              newId += maritimeVariables[i][1]
              newLat += maritimeVariables[i][2]
              newLng += maritimeVariables[i][3]
              newName += maritimeVariables[i][4]
              newType += maritimeVariables[i][7]

            }
          }


          if (stValue.length != 0) {
            map.getView().setCenter(ol.proj.transform([newLng, newLat], 'EPSG:4326', 'EPSG:3857'));
          }
          

          
          document.getElementById("code").innerHTML = newCode

          document.getElementById("info1").innerHTML = newLat
          document.getElementById("info2").innerHTML = newLng
          document.getElementById("info3").innerHTML = ' 0 m.'
          document.getElementById("info4").innerHTML = newType
          document.getElementById("info5").innerHTML = newId


        } else if (document.getElementById("selectSt").innerHTML == LTCE_selecList) {

          //  var stValue = document.getElementById("selectSt").value

          let LTCE_popupContainer = document.getElementById('LTCE_popup')
          LTCE_popupContainer.style["display"] = "none"
  
            var newName = []
            var newLat = []
            var newLng = []
            var newAlt = []
  
      
            for (let i = 0; i < LTCE_variables.length; i++) {
              if (stValue == LTCE_variables[i][0]) {
                newName += LTCE_variables[i][0]
                newLat += LTCE_variables[i][1]
                newLng += LTCE_variables[i][2]
                newAlt += LTCE_variables[i][3]
              }
            }
  
  
            document.getElementById("code").innerHTML = newName
            document.getElementById("info1").innerHTML = newLat
            document.getElementById("info2").innerHTML = newLng
            document.getElementById("info3").innerHTML = newAlt

            if (stValue.length != 0) {
              map.getView().setCenter(ol.proj.transform([newLng, newLat], 'EPSG:4326', 'EPSG:3857'));
            }
      
        }
      }

      var filter = document.getElementById("selectSt")
      filter.addEventListener("change", newInfo)

    
  
    // var toggles = document.getElementById("toggles");
  
  
 // var stValue = document.getElementById("selectSt").value






/*
  dataBtn.addEventListener("mouseover", (event) => {
    dataBtn.style["cursor"] = "pointer"
  });
*/

document.getElementById("checkbox1").onchange = function (){
  stations_layer.getSource().refresh()
}

document.getElementById("checkbox2").onchange = function (){
  stations_layer.getSource().refresh()
}

document.getElementById("checkbox3").onchange = function (){
  stations_layer.getSource().refresh()
}





  
  dataBtn.addEventListener("click", (event) => {

    advSection = 'off'

    document.getElementById("dataBtn").style["backgroundColor"] = "rgb(104, 139, 171)"
    document.getElementById("LTCEBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("verifBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("maritimeBtn").style["backgroundColor"] = "rgb(123, 158, 171)"

    document.getElementById("selectSt").innerHTML = QCst_selecList;


    // On met windGraph.style['display'] = 'none' pour que la rose des vents se réinitialise lorsqu'on revient sur "Données historiques après avoir visité une autre section
    // Il est important de mettre windGraph.style['display'] = 'block' dans la fonction windGraphic pour que la rose des vents réapparaisse quand on clique sur une station.
    let windGraph = document.getElementById('graphics')
    windGraph.style['display'] = 'none'


    let legendForAdv = document.getElementById('legendForAdv')
    legendForAdv.style['display'] = 'none'

    var questionDateMaritime = document.getElementById("form-question__title-maritime")
    var inputContainerMaritime = document.getElementById("input-container-maritime")
    var tooltip = document.getElementById("tooltip")

    inputContainerMaritime.style['display'] = 'none'
    questionDateMaritime.style['display'] = 'none'
    tooltip.style['display'] = 'none'


    LTCE_layer.setVisible(false)
    stations_layer.setVisible(true)
    

    map.getLayers().forEach(layer => {
      if (layer.values_.title == 'waveSurface') {
        map.removeLayer(layer);
      }
    });


    map.getLayers().forEach(layer => {
      if (layer.values_.title == 'maritimeStationLayer') {
        map.removeLayer(layer);
      }
    });


    stationsLegend.style["visibility"] = "visible"
    maritimeLegend.style["visibility"] = "hidden"


   
  let LTCE_popupContainer = document.getElementById('LTCE_popup')
  LTCE_popupContainer.style["display"] = "none"

  let rgnPopupContainer = document.getElementById('rgnpopup')
  rgnPopupContainer.style["display"] = "none"
  
//  let maritimeStationspopupContainer = document.getElementById('maritimeStationspopup')
//  maritimeStationspopupContainer.style["display"] = "none"

/*
  var toggles = document.getElementById('toggles')
  while (toggles.firstChild) {
    toggles.removeChild(toggles.firstChild);
  }
*/

    // si une station est en rouge, elle reprend sa couleur initiale quand on la section "Données historiques"

  let source = stations_layer.getSource()
  source.forEachFeature( function (feature) {
    feature.setStyle(undefined)
  })

  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  if (regionSelected !== null) {
    regionSelected.setStyle(undefined);
    regionSelected = null;
  }




  document.getElementById("text1").innerHTML = 'Latitude :'
  document.getElementById("text2").innerHTML = 'Longitude :'
  document.getElementById("text3").innerHTML = 'Altitude :'
  document.getElementById("text4").innerHTML = 'Activité :'
  document.getElementById("text5").innerHTML = 'Identification :'


  document.getElementById("info1").innerHTML = ''
  document.getElementById("info2").innerHTML = ''
  document.getElementById("info3").innerHTML = ''
  document.getElementById("info4").innerHTML = ''
  document.getElementById("info5").innerHTML = ''

  document.getElementById("code").innerHTML = 'CODE | '


  /*  À revoir, je ne sais pas si ça sert à quelque chose

  var stValue = document.getElementById("selectSt").value


  var firstYear = []
  var lastYear = []

  for (let i = 0; i < stationVariables.length; i++) {
    if (stValue == stationVariables[i][0]) {
      firstYear = stationVariables[i][6]
      lastYear = stationVariables[i][7]
    }
  }

*/


/*
  var activeYears = []

  for (let i=firstYear; i<=lastYear; i++) {
    activeYears += "<option>" + i + "</option>" + ","
  }


  activeYears = activeYears.split(",")
  activeYears = activeYears.splice(0, activeYears.length-1);

  activeYears.unshift("<option selected=\"selected\"> toutes les années </option>")



  document.getElementById("yearSelector").innerHTML = activeYears;
*/


  });


  verifBtn.addEventListener("click", (event) => {


    advSection = 'on'
    
    document.getElementById("verifBtn").style["backgroundColor"] = "rgb(104, 139, 171)"
    document.getElementById("LTCEBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("dataBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("maritimeBtn").style["backgroundColor"] = "rgb(123, 158, 171)"


    document.getElementById("selectSt").innerHTML = rgn_selecList;


    let windGraph = document.getElementById('graphics')
    windGraph.style['display'] = 'none'


    let legendForAdv = document.getElementById('legendForAdv')
    legendForAdv.style['display'] = 'block'

    
    var questionDateMaritime = document.getElementById("form-question__title-maritime")
    var inputContainerMaritime = document.getElementById("input-container-maritime")
    var tooltip = document.getElementById("tooltip")

    inputContainerMaritime.style['display'] = 'none'
    questionDateMaritime.style['display'] = 'none'
    tooltip.style['display'] = 'none'



    stationsLegend.style["visibility"] = "hidden"
    maritimeLegend.style["visibility"] = "hidden"
    

    stations_layer.setVisible(false)
    LTCE_layer.setVisible(false)

    
    map.getLayers().forEach(layer => {
      if (layer.values_.title == 'waveSurface') {
        map.removeLayer(layer);
      }
    });


    map.getLayers().forEach(layer => {
      if (layer.values_.title == 'maritimeStationLayer') {
        map.removeLayer(layer);
      }
    });


    let LTCE_popupContainer = document.getElementById('LTCE_popup')
    LTCE_popupContainer.style["display"] = "none"

    let stationsclkdPopupContainer = document.getElementById('stationsclkdpopup')
    stationsclkdPopupContainer.style["display"] = "none"

  //  let maritimeStationspopupContainer = document.getElementById('maritimeStationspopup')
  //  maritimeStationspopupContainer.style["display"] = "none"


    /*
    var toggles = document.getElementById('toggles')
    while (toggles.firstChild) {
      toggles.removeChild(toggles.firstChild);
    }
*/

    /*
    var legend = 
    "D : succès" + "<br>" +
    "F : fausse alerte" + "<br>" +
    "MA : manqué (aucun WW émis)" + "<br>" +
    "MP0 : manqué (WW émis trop tard)" + "<br>" + 
    "Mpi : manqué (préavis insuffisant)" + "<br>" + 
    "MT : manqué (timing)" + "<br>" +
    "MQ : manqué (quantité)" + "<br>" +
    "U : quasi succès" + "<br>" +
    "i : ignoré (quasi événement ou VTH/VBN)" +

    "<br>" + "<br>" +

    "succès = D + MQ + Mpi + MT" + "<br>" +
    "manqué  = MA + MP0" + "<br>" +
    "fausse alerte = F + U" + "<br>" +
    "POD = succès / (succès + manqué)" + "<br>" +
    
    "FAR = fausse alerte / (succès + fausse alerte)" + "<br>" +
    "CSI = ..." + "<br>" + 
    "biais = ..."

    toggles.innerHTML = legend
*/

    document.getElementById("text1").innerHTML = 'AIR :'
    document.getElementById("text2").innerHTML = 'PÉRIMÈTRE :'
    document.getElementById("text3").innerHTML = 'ID :'

    document.getElementById("text4").innerHTML = ''
    document.getElementById("text5").innerHTML = ''


    document.getElementById("info1").innerHTML = ''
    document.getElementById("info2").innerHTML = ''
    document.getElementById("info3").innerHTML = ''

    document.getElementById("info4").innerHTML = ''
    document.getElementById("info5").innerHTML = ''

    document.getElementById("code").innerHTML = 'CODE | '


    /*
     let newRgnName = []
     let newRgnPerimeter = []
     let newRgnArea = []

    let source = region_layer.getSource()


     for (i = 0; i<rgnVariables.length; i++) {
      if (regionSelected.values_.NAME == rgnVariables[i][0]) {
        newRgnName += rgnVariables[i][0]
        newRgnPerimeter += rgnVariables[i][1]
        newRgnArea += rgnVariables[i][2]
      }
     }

   


     document.getElementById("info1").innerHTML = 'AIR:'
     document.getElementById("info2").innerHTML = 'PERIMETRE:'


     document.getElementById("code").innerHTML = newRgnName
     document.getElementById("lat").innerHTML = newRgnPerimeter
     document.getElementById("lng").innerHTML = newRgnArea

*/
    

//// pour classer par ordre alphabétique ////

 


  });

  // pas sûr d'utiliser, à enlever

  /*
  const normalStyle = new ol.style.Style({
    fill: new ol.style.Fill ({
      color: 'rgba(255,255,255,0)',
    }),
    stroke: new ol.style.Stroke ({
      color: 'black',
    }),
  });
  */

  maritimeBtn.addEventListener("click", (event) => {


    advSection = 'off'

    document.getElementById("maritimeBtn").style["backgroundColor"] = "rgb(104, 139, 171)"
    document.getElementById("LTCEBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("dataBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("verifBtn").style["backgroundColor"] = "rgb(123, 158, 171)"


    map.getLayers().forEach(function (layer) {
      if (layer.values_.title == "LTCE_layer" || layer.values_.title == "stations_layer") {
        layer.setVisible(false)
      } 
    })

    document.getElementById("selectSt").innerHTML = maritime_selecList


    let windGraph = document.getElementById('graphics')
    windGraph.style['display'] = 'none'
  
  
    stationsLegend.style["visibility"] = "hidden"
    maritimeLegend.style["visibility"] = "visible"
  
  
    let toggles = document.getElementById("toggles")
  
  
  
    let legendForAdv = document.getElementById('legendForAdv')
    legendForAdv.style['display'] = 'none'
  
  
    var questionDateMaritime = document.getElementById("form-question__title-maritime")
    var inputContainerMaritime = document.getElementById("input-container-maritime")
    var tooltip = document.getElementById("tooltip")

    inputContainerMaritime.style['display'] = 'block'
    questionDateMaritime.style['display'] = 'block'
    tooltip.style['display'] = 'block'


    
    let rgnPopupContainer = document.getElementById('rgnpopup')
    rgnPopupContainer.style["display"] = "none"

    let stationsclkdPopupContainer = document.getElementById('stationsclkdpopup')
    stationsclkdPopupContainer.style["display"] = "none"
    
    let LTCE_popupContainer = document.getElementById('LTCE_popup')
    LTCE_popupContainer.style["display"] = "none"


    if (selected !== null) {
      selected.setStyle(undefined);
      selected = null;
    }

    if (regionSelected !== null) {
      regionSelected.setStyle(undefined);
      regionSelected = null;
    }
  
  
  // toggles.insertBefore(inputContainerMaritime, toggles.firstChild);
  
  // toggles.insertBefore(chooseAdate, toggles.firstChild);
  
  

  
  
  
  
  //  const maritimeList = './data/maritimeStations.json';
  
  })



  LTCEBtn.addEventListener("click", (event) => {

    advSection = 'off'


    document.getElementById("LTCEBtn").style["backgroundColor"] = "rgb(104, 139, 171)"
    document.getElementById("dataBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("verifBtn").style["backgroundColor"] = "rgb(123, 158, 171)"
    document.getElementById("maritimeBtn").style["backgroundColor"] = "rgb(123, 158, 171)"



    document.getElementById("selectSt").innerHTML = LTCE_selecList

    document.getElementById('graphics').style['display'] = 'none'


    let legendForAdv = document.getElementById('legendForAdv')
    legendForAdv.style['display'] = 'none'


    var questionDateMaritime = document.getElementById("form-question__title-maritime")
    var inputContainerMaritime = document.getElementById("input-container-maritime")
    var tooltip = document.getElementById("tooltip")

    inputContainerMaritime.style['display'] = 'none'
    questionDateMaritime.style['display'] = 'none'
    tooltip.style['display'] = 'none'



    stationsLegend.style["visibility"] = "hidden"
    maritimeLegend.style["visibility"] = "hidden"




    LTCE_layer.setVisible(true)
    stations_layer.setVisible(false)

    map.getLayers().forEach(layer => {
      if (layer.values_.title == 'waveSurface') {
        map.removeLayer(layer);
      }
    });


    map.getLayers().forEach(layer => {
      if (layer.values_.title == 'maritimeStationLayer') {
        map.removeLayer(layer);
      }
    });

  
    let rgnPopupContainer = document.getElementById('rgnpopup')
    rgnPopupContainer.style["display"] = "none"

    let stationsclkdPopupContainer = document.getElementById('stationsclkdpopup')
    stationsclkdPopupContainer.style["display"] = "none"

  //  let maritimeStationspopupContainer = document.getElementById('maritimeStationspopup')
  //  maritimeStationspopupContainer.style["display"] = "none"

/*
    var toggles = document.getElementById('toggles')
    while (toggles.firstChild) {
      toggles.removeChild(toggles.firstChild);
    }
*/


    if (selected !== null) {
      selected.setStyle(undefined);
      selected = null;
    }

    if (regionSelected !== null) {
      regionSelected.setStyle(undefined);
      regionSelected = null;
    }



    document.getElementById("text1").innerHTML = 'Latitude :'
    document.getElementById("text2").innerHTML = 'Longitude :'
    document.getElementById("text3").innerHTML = 'Altitude :'
    document.getElementById("text4").innerHTML = ''
    document.getElementById("text5").innerHTML = ''
  
  
    document.getElementById("info1").innerHTML = ''
    document.getElementById("info2").innerHTML = ''
    document.getElementById("info3").innerHTML = ''
    document.getElementById("info4").innerHTML = ''
    document.getElementById("info5").innerHTML = ''

    document.getElementById("code").innerHTML = 'CODE | '

    


    // trouver une moyen de faire en sorte qu'en quittant le bouton avertissement, les régions en rouge et en gris redevienne automatiquement transparantes
/*
    region_layer.setStyle( function (feature, resolution) {
      feature.setStyle(
        new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0)'
          }), 
          stroke: new ol.style.Stroke({
            color: 'black'
          })
        })
      )
    })
    */
/*
    map.getLayers().forEach(function(element, index, array) {
      if (element.values_.title == 'region_layer')
      {
        feat.setStyle(undefined)
      }
    })


map.forEachFeatureAtPixel(event.pixel, function (feat, layer) {
                                              // .disposed peut etre pas utile...
    if (layer == region_layer) {

      feat.setStyle(undefined);

      return true
      
    }
})
*/


  })



  map.on('pointermove', function (event) {
 



    map.getLayers().forEach(function(layer) {
      if (layer.values_.title == "maritimeStationLayer") {
        let maritimeStationLayer = layer
      }
    })


    


    
    if (document.getElementById("selectSt").innerHTML == QCst_selecList) {


      let stationsOverlay = new ol.Overlay({
        element: stationPopupContainer,
        autoPan: false,
        autoPanAnimation: {
          duration: 250
        }
      });
      
    
      map.addOverlay(stationsOverlay)



/*
      if (circleHover !== null) {                                 // IIIII: fontionne mais fait crash
          circleHover.setStyle(undefined);
          circleHover = null;
      }
*/



      var hit = this.forEachFeatureAtPixel(event.pixel, function(feat, layer) {
        if (layer == stations_layer) {
          console.log(feat)
          stationsOverlay.setPosition(event.coordinate)

          stationContent.innerHTML = feat.values_.STATION_NAME

 //         circleHover = feat                          // IIIII: fontionne mais fait crash
  
 //         feat.setStyle(circleMover);                 // IIIII: fontionne mais fait crash
        return true;
      } else if (layer == region_layer) {
        feat.setStyle(undefined);
      } 


    }); 
    if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
        

    } else {
        this.getTargetElement().style.cursor = '';
    }

  

/*
      map.forEachFeatureAtPixel(event.pixel, function (feat, layer) {
        if (layer == stations_layer) {

          this.getTargetElement().style.cursor = 'pointer'



          stationsOverlay.setPosition(event.coordinate)

          stationContent.innerHTML = feat.values_.StationName
        }
      })
*/



    } else if (document.getElementById("selectSt").innerHTML == rgn_selecList) {
      
      if (selected !== null) {
        if(selected.disposed == false) {                            // .disposed peut etre pas utile...
          selected.setStyle(undefined);
          selected = null;
        }
      }


      map.forEachFeatureAtPixel(event.pixel, function (feat, layer) {
        if (feat.disposed == false) {                                             // .disposed peut etre pas utile...
          if (layer == region_layer && feat.values_.PROVINCE_C == 'QC') {
  
            selected = feat
  
            feat.setStyle(styleHover);
  
            return true
            
          }
        }
        
      })

      var hit = this.forEachFeatureAtPixel(event.pixel, function(feat, layer) {
        if (layer == region_layer && feat.values_.PROVINCE_C == 'QC') {

          return true
        }
      })

      if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
              
        } else {
            this.getTargetElement().style.cursor = '';
      }

    

    } else if (document.getElementById("selectSt").innerHTML == LTCE_selecList) {



      var hit = this.forEachFeatureAtPixel(event.pixel, function(feat, layer) {
        if (layer == LTCE_layer) {

          return true
        }
      })

      if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
              
        } else {
            this.getTargetElement().style.cursor = '';
      }

    } else if (document.getElementById("selectSt").innerHTML == maritime_selecList) {


      var hit = this.forEachFeatureAtPixel(event.pixel, function(feat, layer) {
        if (layer.values_.title == "maritimeStationLayer") {

          return true
        }
      })

      if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
              
        } else {
            this.getTargetElement().style.cursor = '';
      }

    }




  })
  
  

// J'ai enlevé cette partie psk ça cassait le CANVAS du doubleClique. Quand je verrais à quoi ça servait, trouver un autre moyen de le faire, sans casser le CANVAS doubleClique
/*
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
*/



/*     Pas sûr qu'il faille vraiment enlever ça. À revoir

  var stValue = document.getElementById("selectSt").value


  var newTCIdentifier = []
  var firstYear = []
  var lastYear = []
  
  for (let i = 0; i < stationVariables.length; i++) {
    if (stValue == stationVariables[i][0]) {
      newTCIdentifier = stationVariables[i][2]
      firstYear = stationVariables[i][6]
      lastYear = stationVariables[i][7]
    }
  }
*/



//// cette function ne sert plus à grand chose. On devrait pouvoir prendre retrieveAdvData directement (puisque finalement getWarningStat ne fait qu' appeler retrieveAdvData et makePie et rien d'autre)

  function getWarningStat (newCode, month, canvasAdvId) {
    // specifier newCode avant la fonction



      /*
      var stValue = document.getElementById("selectSt").value
      var variableSCD = document.getElementById("variableAdvSelector").value
      var yearSCD = document.getElementById("yearSelector").value
      var monthSCD = document.getElementById("monthOrPeriodSelector").value
      var daySCD = document.getElementById("daySelector").value
      */




    var coteArray = retrieveAdvData(newCode, month)
    

    coteArray
    .then(values => {


      console.log(values)




 /*     
      let cote0 = []
      for (let i of values) {
        cote0.push(i[0])
      }



      const counts = {};

      for (const num of cote0) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }


      // il manque encore MF...

      let D = counts['D']
      let F = counts['F']
      let MA = counts['MA']
      let MP0 = counts['MP0'] + counts['Mp0']
      let Mpi = counts['Mpi']
      let MT = counts['MT']
      let MQ = counts['MQ']
      let U = counts['U']
      let i = counts['i']
      let W = counts['W']

      


      D = D || 0
      F = F || 0
      MA = MA || 0
      MP0 = MP0 || 0
      Mpi = Mpi || 0
      MT = MT || 0
      MQ = MQ || 0
      U = U || 0
      i = i || 0 
      W = W || 0 

      


      let coteArray = [D, MQ, Mpi, MT, MA, MP0, F, U, i, W]



/////////////// Pour ajourter la discrimination temporelle ///////////



      let newCote = values
      for (let i of newCote) {
        if (i[0] == 'D' || i[0] == 'MQ' || i[0] == 'Mpi' || i[0] == 'MT') {
          i[0] = '1'
        } else if (i[0] == 'MA' || i[0] == 'MP0' || i[0] == 'Mp0' || i[0] == 'i' || i[0] == 'F' || i[0] == 'U' || i[0] == 'MF') {
          i[0] = '-1'
        } 
      }

      let newDate = []
      let newYear = []
      let newMonth = []
      let newDay = []



      for (let i in newCote) {
        newDate.push([newCote[i][0], newCote[i][1].replace(/-/g, ",")])
      }




      function dayInYear(newDate) {
        var now = new Date(newDate);
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day
      }



      let dayInYearArray = []

      for (let i in newDate) {
        dayInYearArray.push([newDate[i][0], dayInYear(newDate[i][1])])
      }



      function sortFunction(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }

    dayInYearArray.sort(sortFunction);

    

////////////////////////////







      let succes = D + MQ + Mpi + MT
      let manque = MA + MP0

      let POD = succes/(succes + manque)
      // let restPOD = 1 - POD

      let fausseAlerte = F + U
      
      let FAR = fausseAlerte/(succes + fausseAlerte)
      // let restFAR = 1 = FAR

      POD = Math.round(POD * 100)
      FAR = Math.round(FAR * 100)


*/
      makePie(values, canvasAdvId)
  
    })
  }



  //activeYears(yearID)

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}



// let regionSelected = null;        déjà déclarée plus haut 

map.on("singleclick", function(event) {
  




  if (circleSelected !== null) {
    
      circleSelected.setStyle(undefined);
      circleSelected = null;
    
  }


  map.forEachFeatureAtPixel(event.pixel, function (feat, layer) {
      if (layer == stations_layer) {
        circleSelected = feat
        feat.setStyle(circleClicked);
   
        return true
      }

  })


  


  map.forEachFeatureAtPixel(event.pixel, function (feat, layer) {


  

        if (layer.values_.title == "LTCE_layer") {



/*
          while (toggles.firstChild) {
            toggles.removeChild(toggles.firstChild);
          }
*/

    document.getElementById('loader').style['display'] = 'block'
    document.getElementById('graphics').style['display'] = 'none'

          while (LTCE_content.firstChild) {
            LTCE_content.removeChild(LTCE_content.firstChild);
          }


    let stationName = feat.values_.id;



    document.getElementById("selectSt").value = stationName;    // possible d'insérer cette ligne dans le newInfo

    var newLat = []
    var newLng = []
    var newAlt = []



    for (let i = 0; i < LTCE_variables.length; i++) {
      if (stationName == LTCE_variables[i][0]) {
        
        newLat += LTCE_variables[i][1]
        newLng += LTCE_variables[i][2]
        newAlt += LTCE_variables[i][3]
      }
    }


    document.getElementById("code").innerHTML = stationName
    document.getElementById("info1").innerHTML = newLat
    document.getElementById("info2").innerHTML = newLng
    document.getElementById("info3").innerHTML = newAlt 

    LTCE_popupContainer.style["display"] = "block"
    LTCE_popupContainer.style["cursor"] = "default"



          let LTCE_popup = new ol.Overlay({
            element: LTCE_popupContainer,
            positioning: 'bottom-center',
            autoPan: true,
            autoPanAnimation: {
              duration: 250
            }
          });


          map.addOverlay(LTCE_popup)
          LTCE_popup.setPosition(event.coordinate)



          var closeLTCE_popup = document.getElementById("LTCE_popup-close")
        
        
          closeLTCE_popup.addEventListener("click", (event) => {

            document.getElementById('graphics').style['display'] = 'none'
            LTCE_popupContainer.style["display"] = "none"

/*
            while (toggles.firstChild) {
              toggles.removeChild(toggles.firstChild);
            }
        */
        
        
            document.getElementById('selectSt').value = ''
            document.getElementById('info1').innerHTML = ''
            document.getElementById('info2').innerHTML = ''
            document.getElementById('info3').innerHTML = ''
            document.getElementById('info4').innerHTML = ''
            document.getElementById('info5').innerHTML = ''
            document.getElementById('code').innerHTML = 'CODE |'
        
          });





          ///////////  for windGraph ////////////


          var stationListName = ''

          if (feat.values_.id == 'Val-d\'or') {
            stationListName = 'VAL D\'OR A'
          } else if (feat.values_.id == 'Ottawa') {
            stationListName = 'OTTAWA GATINEAU A'
          } else if (feat.values_.id == 'Montréal') {
            stationListName = 'MONTREAL INTL A'
          } else if (feat.values_.id == 'Sherbrooke') {
            stationListName = 'LENNOXVILLE'
          } else if (feat.values_.id == 'Québec') {
              stationListName = 'QUEBEC INTL A'
          } else if (feat.values_.id == 'Saguenay') {
            stationListName = 'BAGOTVILLE A'
          } else if (feat.values_.id == 'Roberval') {
            stationListName = 'ROBERVAL A'
          } else if (feat.values_.id == 'Rimouski') {
            stationListName = 'MONT JOLI A'
          } else if (feat.values_.id == 'Sept-îles') {
            stationListName = 'SEPT-ILES A'
          } else if (feat.values_.id == 'Gaspé') {
            stationListName = 'GASPE A'
          }

          // A reactiver mais prend trop de temps pour l'instant

          makeWindGraph(stationListName)



          ///////////  for windGraph ////////////



          if (todayMonth < 10 && todayMonth.toString().length < 2) {
            todayMonth = "0" + todayMonth;
          }
      
      
          if (todayDay < 10 && todayDay.toString().length < 2) {
            todayDay = "0" + todayDay;
          }


//// pas utilisé pour l'instant
/*
          var tomorrow = addSomeDate(1)

          var tomorrowYear = tomorrow[0]
          var tomorrowMonth = tomorrow[1]
          var tomorrowDay = tomorrow[2]
          */
//////




         //var effDate = document.getElementById("effective-date")


         // on laisse toute cette partie ou on supprime et recréer pour que ça fonctionne quand on clique sur un nouveau marker

         var formQuestion = document.getElementById("form-question")
         removeAllChildNodes(formQuestion)


         formQuestion.appendChild(formQuestion__title)
         formQuestion.appendChild(inputContainer)

         removeAllChildNodes(inputContainer)

         inputContainer.appendChild(effDate)


         effDate.value = todayYear + "-" + todayMonth + "-" + todayDay


         document.getElementById("chooseDate").innerHTML = "Choisir une date"




          var tempRdData = getTempRecordData(feat.values_.id, todayDay, todayMonth)
          var snowfallRdData = getSnowfallRecordData(feat.values_.id, todayDay, todayMonth)
          var precipRdData = getPrecipRecordData(feat.values_.id, todayDay, todayMonth)


      

      
          Promise.all([tempRdData, snowfallRdData, precipRdData])
          .then(values => {
      
            var cooObject = values[0]

            var cooObject2 = values[1]

            var cooObject3 = values[2]


            var drawTitles1 = ["Record journalier", "Valeur (°C)", "Année"]
            var records1 = [" ", "Haut maximum", "Haut minimum", "Bas maximum", "Bas minimum"]
            var drawValues1 = [" ", cooObject[0].hmax, cooObject[0].hmin, cooObject[0].lmax, cooObject[0].lmin]
            var drawYears1 = [" ", cooObject[0].yearhMax, cooObject[0].yearhMin, cooObject[0].yearlMax, cooObject[0].yearlMin]
            var drawID1= "tempDraw"

            var drawTitles2 = ["Record journalier", "Valeur (cm)", "Année"]
            var records2 = [" ", "Neige", "Neige (2)", "Neige (3)"]
            var drawValues2 = [" ",  cooObject2[0].rdSnowfall, cooObject2[0].rdSnowfall2, cooObject2[0].rdSnowfall3]
            var drawYears2 = [" ", cooObject2[0].rdSnowfall_year , cooObject2[0].rdSnowfall2_year, cooObject2[0].rdSnowfall3_year]
            var drawID2= "snowDraw"

            var drawTitles3 = ["Record journalier", "Valeur (mm)", "Année"]
            var records3 = [" ", "Précipitation", "Précipitation (2)", "Précipitation (3)"]
            var drawValues3 = [" ", cooObject3[0].rdPrecip, cooObject3[0].rdPrecip2, cooObject3[0].rdPrecip3]
            var drawYears3 = [" ", cooObject3[0].rdPrecip_year, cooObject3[0].rdPrecip2_year, cooObject3[0].rdPrecip3_year]
            var drawID3= "precipDraw"


            var jsonArr1 = []
            var jsonArr2 = []
            var jsonArr3 = []


            for (let i = 0; i < records1.length; i++) {
              jsonArr1.push({
                Recordjournalier: records1[i],
                valeur: drawValues1[i],
                date: drawYears1[i]
              })
            }


            for (let i = 0; i < records2.length; i++) {
              jsonArr2.push({
                Recordjournalier: records2[i],
                valeur: drawValues2[i],
                date: drawYears2[i]
              })
            }


            for (let i = 0; i < records3.length; i++) {
              jsonArr3.push({
                Recordjournalier: records3[i],
                valeur: drawValues3[i],
                date: drawYears3[i]
              })
            }



          var titleCity = document.createElement("div")
          titleCity.innerHTML = `${feat.values_.id}` 
          titleCity.style["fontWeight"] = "bold"
          titleCity.style["textDecoration"] = "underline"
          titleCity.style["textAlign"] = "center"
          titleCity.style["fontSize"] = "20px"




          LTCE_content.appendChild(titleCity)

          let units
          let captionText

    
          createTable (jsonArr1, drawTitles1, records1, drawValues1, drawYears1, drawID1, units = 'mm')
          createTable (jsonArr2, drawTitles2, records2, drawValues2, drawYears2, drawID2, units = 'mm')
          createTable (jsonArr3, drawTitles3, records3, drawValues3, drawYears3, drawID3, units = 'mm')



          var table1 = document.getElementById("tempDraw")
          var table2 = document.getElementById("snowDraw")  
          var table3 = document.getElementById("precipDraw") 

          document.querySelector("#tempDraw tr").style["backgroundColor"] = "rgb(147, 0, 174, 0.2)"
          document.querySelector("#snowDraw tr").style["backgroundColor"] = "rgb(0, 0, 180, 0.2)"
          document.querySelector("#precipDraw tr").style["backgroundColor"] = "rgb(0, 140, 0, 0.2)"

      
            table1.style["marginTop"] = "20px"
            table2.style["marginTop"] = "20px"
            table3.style["marginTop"] = "20px"



        })




  
        } else if (layer.values_.title == 'stations_layer') {


    // feat.setStyle(circleClicked)

    document.getElementById('graphics').style['display'] = 'none'
    document.getElementById('loader').style['display'] = 'block'


    makeCanvas(stationsclkdContent)


    //canvas.width  = canvas.offsetWidth;
    //canvas.height = canvas.offsetHeight;


    
    let stationName = feat.values_.STATION_NAME;


    for (let x of stationVariables) {
      if (x[0] == stationName) {
        var newClimateID = x[2]
        var newTCIdentifier = x[3]
        var newLng = x[4]
        var newLat = x[5]
        var newFirstYear = x[6]
        var newLastYear = x[7]
        var newAlt = x[8]
      } 
    }

    

// Si certaines stations ne fonctionnent pas, c'est probablement parce qu'elle ne font pas partie du Québec

    


    // newLat = stationLat mais pris autrement etc...

    document.getElementById("selectSt").value = stationName;
    document.getElementById("info1").innerHTML = newLat
    document.getElementById("info2").innerHTML = newLng
    document.getElementById("info5").innerHTML = newClimateID


    if (newAlt == '' || newAlt == null) {
      document.getElementById("info3").innerHTML = '/'
    } else {
      document.getElementById("info3").innerHTML = newAlt + ' m.'
    }


    if (newTCIdentifier == "" || newTCIdentifier == null) {
      document.getElementById("code").innerHTML = '/'
    } else {
      document.getElementById("code").innerHTML = newTCIdentifier
    }

    document.getElementById("info4").innerHTML = newFirstYear + '-' + newLastYear




    /////// définir les options des boutons de sélection ////////



    /// sélection années


    var activeYears = []

    for (let i=newFirstYear; i<=newLastYear; i++) {
      if (i == newLastYear) {
        activeYears += "<option selected=\"selected\"> " + i + " </option>" + ","
      } else {
        activeYears += "<option> " + i + " </option>" + ","   // éventuellement mettre une valeur aux options    
      }
    }

    console.log(activeYears)
  
    activeYears = activeYears.split(",")
    activeYears = activeYears.splice(0, activeYears.length-1);
    activeYears.unshift("<option> toutes les années </option>")
  
    yearSelectorX.innerHTML = activeYears;

    yearSelectorX.options[0].disabled = true



    // sélection mois

    var monthSelection = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    var activeMonths = []

    for (let i=0; i<monthSelection.length; i++) {
      if (i+1 == todayMonth) {
        activeMonths += (`<option value=${i+1} selected=\"selected\"> ` + monthSelection[i] + " </option>") + ","
      } else {
        activeMonths += (`<option value=${i+1}> ` + monthSelection[i] + " </option>") + ","  // on assigne une valeur différente du texte pour les mois (la fonction selectFullperiod fonction avec des chiffres pour les mois tandis qu'on veut afficher les mois en lettre sur le site)
      }
    }

    activeMonths = activeMonths.split(",")
    activeMonths = activeMonths.splice(0, activeMonths.length-1);

    activeMonths.unshift("<option> tous les mois </option>")

    monthSelectorX.innerHTML = activeMonths

    monthSelectorX.options[0].disabled = true





    // sélection jour

  var activeDays = []

  for (let i=1; i<=31; i++) {
    activeDays += "<option> " + i + " </option>" + ","     // éventuellement mettre une valeur aux options
  }

  activeDays = activeDays.split(",")
  activeDays = activeDays.splice(0, activeDays.length-1);
  activeDays.unshift('<option selected=\"selected\"> tous les jours </option>')

  daySelectorX.innerHTML = activeDays




    /////// fin ////////




    makeWindGraph(stationName);

    






  var closeStationsPopup = document.getElementById("stationsclkdpopup-close")

  closeStationsPopup.addEventListener("click", (event) => {

    document.getElementById('graphics').style['display'] = 'none'

    stationsclkdPopupContainer.style["display"] = "none"

/*
    while (toggles.firstChild) {
      toggles.removeChild(toggles.firstChild);
    }
*/

    document.getElementById('selectSt').value = ''
    document.getElementById('info1').innerHTML = ''
    document.getElementById('info2').innerHTML = ''
    document.getElementById('info3').innerHTML = ''
    document.getElementById('info4').innerHTML = ''
    document.getElementById('info5').innerHTML = ''

    document.getElementById('code').innerHTML = 'CODE |'

   
    // si une station est en rouge, elle reprend sa couleur initiale quand on quitte ferme le popup
    let source = stations_layer.getSource()
    source.forEachFeature( function (feature) {
      feature.setStyle(undefined)
    })
  });




    stationsclkdPopupContainer.style["display"] = "block"
    stationsclkdPopupContainer.style["cursor"] = "default"

  //  stationsclkdPopupContainer.style["width"] = "600px"
  
    let stationsclkdpopup = new ol.Overlay({
      element: stationsclkdPopupContainer,
      positioning: 'bottom-center',
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    
    map.addOverlay(stationsclkdpopup)
    stationsclkdpopup.setPosition(event.coordinate)


    document.getElementById("popupTitle").innerHTML = stationName


    




  } else if (layer.values_.title == 'region_layer') {   // essayer avec if (layer == region_layer)
  


    if (advSection == 'on') {


   


    // Inserer une nouvelle fiche de selection lorsque j appuie sur le bouton adv et ici on fera var stValue = document.getElementById("selectSt").value sur cette nouvelle fiche de selection


    var stValue = document.getElementById("selectSt").value
   // var variableSCD = document.getElementById("variableAdvSelector").value


    var newCode = []
    
  
    for (let i = 0; i < stationVariables.length; i++) {
      if (stValue == stationVariables[i][0]) {
        newCode = stationVariables[i][3]
      }
    }
   

    newCode = newCode.slice(1);  // pour matcher avec les codes de la verif
  
    // changer certains nom de stations dans le verif file pour que ça marche


    let rgnPopupContainer = document.getElementById('rgnpopup')



   // rgnPopupContainer.style["overflowX"] = "scroll"
   // rgnPopupContainer.style["overflowY"] = "scroll"


    
   // let selectInfo = document.getElementById("monthOrPeriodSelector")
   




    var closeRgnPopup = document.getElementById("rgnpopup-close")

  
    closeRgnPopup.addEventListener("click", (event) => {
  
      rgnPopupContainer.style["display"] = "none"

      document.getElementById('selectSt').value = ''
      document.getElementById('info1').innerHTML = ''
      document.getElementById('info2').innerHTML = ''
      document.getElementById('info3').innerHTML = ''
      document.getElementById('code').innerHTML = 'CODE |'


     
      // si une région est en rouge, elle redevient transparente quand on quitte la section avertissement
      let source = region_layer.getSource()
      source.forEachFeature( function (feature) {
        feature.setStyle(undefined)
      })
    });

  
  
    document.getElementById("chooseAdvDate").innerHTML = "Choisir un mois"
  
    var monthList = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    var selectAdvMonth = document.getElementById("selectAdvMonth")
  
    var monthOptions = []
    for (let i = 1; i<monthList.length+1; i++) {
      if (i == todayMonth) {
        monthOptions.push(`<option value=${i} selected=\"selected\"> ${monthList[i-1]} </option>`)
      } else {
      monthOptions.push(`<option value=${i}> ${monthList[i-1]} </option>`)
      }
    }
    selectAdvMonth.innerHTML = monthOptions
  
  
    selectAdvMonth.style["appearance"] = "none"
    selectAdvMonth.style["border"] = "none"
    selectAdvMonth.style["width"] = "100%"
    selectAdvMonth.style["height"] = "41px"
    selectAdvMonth.style["marginLeft"] = "0px"
    selectAdvMonth.style["fontSize"] = "15px"
    selectAdvMonth.style["outline"] = "none"
    selectAdvMonth.style["borderBottom"] = "solid 2px #333333"
    selectAdvMonth.style["paddingLeft"] = "10px"

  
  



    let rgnContent = document.getElementById('rgnpopup-content')

    while (rgnContent.firstChild) {
      rgnContent.removeChild(rgnContent.firstChild);
    }

  
    //rgnContent.appendChild(selectAdvMonth)
  
  
    rgnPopupContainer.style["display"] = "block"
    rgnPopupContainer.style["cursor"] = "default"

  //  rgnPopupContainer.style["width"] = "600px"


    
    let rgnpopup = new ol.Overlay({
      element: rgnPopupContainer,
      positioning: 'bottom-center',
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });


    map.addOverlay(rgnpopup)
    rgnpopup.setPosition(event.coordinate)



    







    ///// on peut peut-être remplacer toute la prochaine section avec 'newInfo' /////

    let newRgnName = []
    let newRgnPerimeter = []
    let newRgnArea = []
    let newPolyId = []
    

    for (i = 0; i<rgnVariables.length; i++) {
      if (feat.values_.NAME == rgnVariables[i][0]) {
        newRgnName += rgnVariables[i][3]
        newRgnPerimeter += rgnVariables[i][1]
        newRgnArea += rgnVariables[i][2]
        newPolyId += rgnVariables[i][7]
      }
    }

    //rgnVariables[3]


    document.getElementById("code").innerHTML = newRgnName
    document.getElementById("info1").innerHTML = newRgnPerimeter
    document.getElementById("info2").innerHTML = newRgnArea
    document.getElementById("info3").innerHTML = newPolyId


    /*
    let rgn_selecList = []
    for (let x of rgnVariables) {
     if (x[0] == feat.values_.NAME) {
       rgn_selecList += "<option selected=\"selected\"> " + x[3] + " </option>" + ","
     } else {
       rgn_selecList += "<option> " + x[3] + " </option>" + ","
     }
   }


   document.getElementById("selectSt").innerHTML = rgn_selecList;
*/


   var regionName = document.getElementById("selectSt").value = feat.values_.NOM  // bizarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrre

   let newAdvCanvas = makeAdvCanvas(rgnContent)

   //let d3div = document.createElement("div")
   //rgnContent.appendChild(d3div)

console.log('todayMonth')
console.log(todayMonth)



   getWarningStat(regionName, todayMonth, newAdvCanvas.id)   // faire avant le toUpperCase() sinon ça ne marche évidemment pas
   //d3test(d3div)

   regionName = regionName.toUpperCase()
   
   document.getElementById("titleadv").innerHTML = regionName
 

    if (regionSelected !== null) {
      regionSelected.setStyle(undefined);
      regionSelected.disposed = false;
      regionSelected = null;
    }


      feat.disposed = true 
      regionSelected = feat
      feat.setStyle(styleClicked);
      return true
    } 



/*
  closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
}
*/

  
    let coordinate = event.coordinate;
    let xy_coordinates = ol.coordinate.toStringXY(
      ol.proj.toLonLat(event.coordinate),
      4
    );






  } else if (layer.values_.title == 'maritimeStationLayer') {


  
/*
    while (maritimeStationspopupContent.firstChild) {
      maritimeStationspopupContent.removeChild(maritimeStationspopupContent.firstChild);
    }

    maritimeStationspopupContainer.style["display"] = "block"
          
    
    maritimeStationspopupContent.style["margin"] = "auto"
    maritimeStationspopupContent.style["width"] = "550px"
    maritimeStationspopupContent.style["height"] = "450px"
    maritimeStationspopupContent.style["overflowX"] = "scroll"
    maritimeStationspopupContent.style["overflowY"] = "scroll"
  


    maritimeStationspopupContainer.style["visibility"] = "visible"
    maritimeStationspopupContainer.style["width"] = "600px"



    let maritimeStationspopup = new ol.Overlay({
      element: maritimeStationspopupContainer,
      autoPan: false,
      autoPanAnimation: {
        duration: 250
      }
    });


    map.addOverlay(maritimeStationspopup)
    maritimeStationspopup.setPosition(event.coordinate)
   

    maritimeStationspopupContainer.style["cursor"] = "default"



    var closeMaritime = document.getElementById("maritimeStationspopup-close")
  
    closeMaritime.addEventListener("click", (event) => {
      maritimeStationspopupContainer.style["display"] = "none"



  })

  */


  function clickMaritimeStations () {
    let maritimeId = feat.values_.id
    let lat = feat.values_.latitude 
    let lng = feat.values_.longitude 
    let name = feat.values_.name
    let code = feat.values_.code
    let activity = feat.values_.type




    document.getElementById("code").innerHTML = code;

    document.getElementById("selectSt").value = name;
    document.getElementById("info1").innerHTML = lat
    document.getElementById("info2").innerHTML = lng
    document.getElementById("info3").innerHTML = '0 m'
    document.getElementById("info4").innerHTML = activity
    document.getElementById("info5").innerHTML = maritimeId


    //let stationMaritimeName = document.getElementById('titleMar2')
    //stationMaritimeName.innerHTML = name




  
  
            //////// on sélectionne les données de la station qu'on a cliquée grâce à [maritimeId] ///////// 



            let highestTide = variableIndividualData[maritimeId][0]
            let values = variableIndividualData[maritimeId][1]
            let eventDate = variableIndividualData[maritimeId][2]


            let wavesHeight = values.map(str => {
              return Number(str[0]);
          });
          for (i in wavesHeight) {
            if (wavesHeight[i] == 9999) {
              wavesHeight[i] = "NaN"
            }
          }


          let latlng = values.map(str => {
            return str[1];
        });



        let lngForLayer = latlng.map(str => {
          return str[0];
      });

        let latForLayer = latlng.map(str => {
          return str[1];
      });





            function myArrayMax(x) {
              return Math.max(...x.filter(x => typeof x === 'number')); //result is 4
            }
           
            function myArrayMin(x) {
              return Math.min(...x.filter(x => typeof x === 'number')); //result is 4
            }

            let highestWave = myArrayMax(wavesHeight)
            let lowestWave = myArrayMin(wavesHeight)
  
  
  
  
          let tideDiv = document.createElement("div")
  

          /*
      //    tideDiv.innerHTML = values[0][0].value + "mètre"
          tideDiv.innerHTML = "Date de l'énénement : " + eventDate + "<br>" +
          "Valeur de marée : " + highestTide + " mètres" + "<br>" +
          "Plus haute vague : " + highestWave + " mètres" + "<br>" +
          "Plus basse vague : " + lowestWave + " mètres" 
        */
  


          
          //maritimeStationspopupContent.appendChild(tideDiv)
    
    
          tideDiv.style["marginLeft"] = "30px"
  


          map.getLayers().forEach(layer => {
            if (layer.values_.title == 'waveSurface') {
              map.removeLayer(layer);
            }
          });




/*
          let features  = []

          for (i = 0; i < latlng.length; i++) {
            features.push(new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.fromLonLat([
                lngForLayer[i], latForLayer[i]
              ]))
            }));
          }

          console.log(features)
*/








          let waveSurface = new ol.layer.Vector({
            source: new ol.source.Vector(
            //  url: `https://geo.meteo.gc.ca/geomet?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&BBOX=${flooredlng},${flooredlat},${ceiledlng},${ceiledlat}&CRS=EPSG:4326&WIDTH=10&HEIGHT=10&LAYERS=GDWPS_25km_HTSGW_PT3H&INFO_FORMAT=application/json&QUERY_LAYERS=GDWPS_25km_HTSGW_PT3H&I=5&J=5&TIME=${eventDate}`,
            //  format: new ol.format.GeoJSON() 
            ),
            zIndex: 2,
            title: 'waveSurface',
            style: function redStation (feature, resolution) {
  

              
              var blue = new ol.style.Style({
              image: new ol.style.Icon({
              anchor: [0.5, 1],
              crossOrigin: 'anonymous',
              //src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
              src: 'https://raw.githubusercontent.com/maptiler/openlayers-samples/main/default-marker/marker-icon.png',
              scale: 1  
                })  
            })
  
  
            var red = new ol.style.Style({
              image: new ol.style.Icon({
              anchor: [0.5, 1],
              crossOrigin: 'anonymous',
              //src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
              src: 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png',
              scale: 1  
                })  
            })
  
  
            var green = new ol.style.Style({
              image: new ol.style.Icon({
              anchor: [0.5, 1],
              crossOrigin: 'anonymous',
              //src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
              src: 'https://maps.google.com/mapfiles/kml/paddle/grn-circle.png',
              scale: 1  
              })  
            })
  
  
            if (feature.get("value") != highestWave && feature.get("value") != lowestWave) {
              return [blue]
            } else if (feature.get("value") == highestWave) {
              return [red]
            } else if (feature.get("value") == lowestWave) {
              return [green]
            } 
  
          }
          })


          for (let i = 0; i < latlng.length; i++) {
            waveSurface.getSource().addFeature(createMarker(lngForLayer[i], latForLayer[i], wavesHeight[i]));
        }
        
        function createMarker(lng, lat, height) {
            return new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
                value: height
            });
        }
  
  
          map.addLayer(waveSurface)
  
        
  
          
  
          
    waveSurface.getSource().forEachFeature(function(feature, layer) {

    })
  
  
  }

  clickMaritimeStations()
  
}





});
});





function disableButtonYear() {
  

    if (isNaN(Number(yearSelectorX.value))) {

      monthSelectorX.options[0].disabled = true;
      daySelectorX.options[0].disabled = true;



    
      /*
      activeDays = activeDays.split(",")
      activeDays = activeDays.splice(0, activeDays.length-1);
      activeDays.unshift('<option selected=\"selected\"> tous les jours </option>')
    
      daySelectorX.innerHTML = activeDays
      */

    } else {

      monthSelectorX.options[0].disabled = false;
      daySelectorX.options[0].disabled = false;
    }
  }

  function disableButtonMonth() {

    if (isNaN(Number(monthSelectorX.value))) {

      yearSelectorX.options[0].disabled = true;
      daySelectorX.options[0].disabled = true;

    } else {
      
      yearSelectorX.options[0].disabled = false;
      daySelectorX.options[0].disabled = false;
    }
  }


  function disableButtonDay() {

    if (isNaN(Number(daySelectorX.value))) {

      yearSelectorX.options[0].disabled = true;
      monthSelectorX.options[0].disabled = true;

    } else {
      
      yearSelectorX.options[0].disabled = false;
      monthSelectorX.options[0].disabled = false;
    }
  }


   
yearSelectorX.addEventListener("change", disableButtonYear)
monthSelectorX.addEventListener("change", disableButtonMonth)
daySelectorX.addEventListener("change", disableButtonDay)





function updateData() {


  var newStationName  = document.getElementById("selectSt").value



  var dateSelected = effDate.value
  var splitDate = dateSelected.split("-")
  var SelectedYear = splitDate[0]
  var SelectedMonth = splitDate[1]
  var SelectedDay = splitDate[2]


  var updatedTempData = getTempRecordData(newStationName, SelectedDay, SelectedMonth)
  var updateSnowfallData = getSnowfallRecordData(newStationName, SelectedDay, SelectedMonth)
  var updatePrecipData = getPrecipRecordData(newStationName, SelectedDay, SelectedMonth)




  Promise.all([updatedTempData, updateSnowfallData, updatePrecipData])
  .then(values => {

    var cooObject = values[0]

    var cooObject2 = values[1]

    var cooObject3 = values[2]



    var drawTitles1 = ["Record journalier", "Valeur (°C)", "Année"]
    var records1 = [" ", "Haut maximum", "Haut minimum", "Bas maximum", "Bas minimum"]
    var drawValues1 = [" ", cooObject[0].hmax, cooObject[0].hmin, cooObject[0].lmax, cooObject[0].lmin]
    var drawYears1 = [" ", cooObject[0].yearhMax, cooObject[0].yearhMin, cooObject[0].yearlMax, cooObject[0].yearlMin]
    var drawID1= "tempDraw"

    var drawTitles2 = ["Record journalier", "Valeur (cm)", "Année"]
    var records2 = [" ", "Neige", "Neige (2)", "Neige (3)"]
    var drawValues2 = [" ",  cooObject2[0].rdSnowfall, cooObject2[0].rdSnowfall2, cooObject2[0].rdSnowfall3]
    var drawYears2 = [" ", cooObject2[0].rdSnowfall_year , cooObject2[0].rdSnowfall2_year, cooObject2[0].rdSnowfall3_year]
    var drawID2= "snowDraw"

    var drawTitles3 = ["Record journalier", "Valeur (mm)", "Année"]
    var records3 = [" ", "Précipitation", "Précipitation (2)", "Précipitation (3)"]
    var drawValues3 = [" ", cooObject3[0].rdPrecip, cooObject3[0].rdPrecip2, cooObject3[0].rdPrecip3]
    var drawYears3 = [" ", cooObject3[0].rdPrecip_year, cooObject3[0].rdPrecip2_year, cooObject3[0].rdPrecip3_year]
    var drawID3= "precipDraw"


    var jsonArr1 = []
    var jsonArr2 = []
    var jsonArr3 = []


    for (let i = 0; i < records1.length; i++) {
      jsonArr1.push({
        Recordjournalier: records1[i],
        valeur: drawValues1[i],
        date: drawYears1[i]
      })
    }


    for (let i = 0; i < records2.length; i++) {
      jsonArr2.push({
        Recordjournalier: records2[i],
        valeur: drawValues2[i],
        date: drawYears2[i]
      })
    }


    for (let i = 0; i < records3.length; i++) {
      jsonArr3.push({
        Recordjournalier: records3[i],
        valeur: drawValues3[i],
        date: drawYears3[i]
      })
    }

   
  var titleCity = document.createElement("div")
  //titleCity.innerHTML = `${feat.values_.id}` 
  titleCity.innerHTML = newStationName
  titleCity.style["fontWeight"] = "bold"
  titleCity.style["textDecoration"] = "underline"
  titleCity.style["textAlign"] = "center"
  titleCity.style["fontSize"] = "20px"


  while (LTCE_content.firstChild) {
    LTCE_content.removeChild(LTCE_content.firstChild);
  }


  LTCE_content.appendChild(titleCity)

  let units
  let captionText


  createTable (jsonArr1, drawTitles1, records1, drawValues1, drawYears1, drawID1, units = 'mm')
  createTable (jsonArr2, drawTitles2, records2, drawValues2, drawYears2, drawID2, units = 'mm')
  createTable (jsonArr3, drawTitles3, records3, drawValues3, drawYears3, drawID3, units = 'mm')



  var table1 = document.getElementById("tempDraw")
  var table2 = document.getElementById("snowDraw")  
  var table3 = document.getElementById("precipDraw") 

  document.querySelector("#tempDraw tr").style["backgroundColor"] = "rgb(147, 0, 174, 0.2)"
  document.querySelector("#snowDraw tr").style["backgroundColor"] = "rgb(0, 0, 180, 0.2)"
  document.querySelector("#precipDraw tr").style["backgroundColor"] = "rgb(0, 140, 0, 0.2)"


    table1.style["marginTop"] = "20px"
    table2.style["marginTop"] = "20px"
    table3.style["marginTop"] = "20px"
  })  
}

effDate.addEventListener("change", updateData)


function getMaritimeData () {


  let container = document.getElementById('container') 
  container.style['cursor'] = 'progress'


  map.getLayers().forEach(layer => {
    if (layer.values_.title == 'waveSurface') {
      map.removeLayer(layer);
    }
  });


  if (toggles.contains(document.getElementById('errorDiv'))) {
    toggles.removeChild(document.getElementById('errorDiv'))
  } 



 // let loader = document.getElementById('loader')
 // loader.style['visibility'] = 'visible'
 // loader.style['display'] = 'block'



 // loader.style['marginTop'] = '30px'



  var dateSelected = effDateMaritime.value


  var splitDate = dateSelected.split("-")
  var SelectedYear = splitDate[0]
  var SelectedMonth = splitDate[1]
  var SelectedDay = splitDate[2]




  var dateZero = new Date()
  dateZero.setDate(dateZero.getDate() + 0)
  dateZero.setHours(dateZero.getHours() - 4)
  dateZero = dateZero.toISOString().slice(0,10)

  var datePlusOne = new Date()
  datePlusOne.setDate(datePlusOne.getDate() + 1)
  datePlusOne.setHours(datePlusOne.getHours() - 4)
  datePlusOne = datePlusOne.toISOString().slice(0,10)

  var datePlusTwo = new Date()
  datePlusTwo.setDate(datePlusTwo.getDate() + 2)
  datePlusTwo.setHours(datePlusTwo.getHours() - 4)
  datePlusTwo = datePlusTwo.toISOString().slice(0,10)

  var datePlusThree = new Date()
  datePlusThree.setDate(datePlusThree.getDate() + 3)
  datePlusThree.setHours(datePlusThree.getHours() - 4)
  datePlusThree = datePlusThree.toISOString().slice(0,10)

  var datePlusFour = new Date()
  datePlusFour.setDate(datePlusFour.getDate() + 4)
  datePlusFour.setHours(datePlusFour.getHours() - 4)
  datePlusFour = datePlusFour.toISOString().slice(0,10)



  var datePlusFive = new Date()                         // on va prendre un cinquième (sixième) jour uniquement parce que avec les heures UTC, si on sélectionne le 4ème jour, on va jusqu'au lendemain à 5:00Z. Donc un fait ça pour que J+4 soit utilisable mais on autorise tout de même de sélectionner J+5 dans le calendrier.
  datePlusFive.setDate(datePlusFive.getDate() + 5)
  datePlusFive.setHours(datePlusFive.getHours() - 5)
  datePlusFive = datePlusFive.toISOString().slice(0,10)



//  var dateZero = Number(dateZero)
//  var datePlusOne = Number(datePlusOne) 


  let allDates = [dateZero, datePlusOne, datePlusTwo, datePlusThree, datePlusFour, datePlusFive]




  if (dateSelected == dateZero || dateSelected == datePlusOne || dateSelected == datePlusTwo || dateSelected == datePlusThree || dateSelected == datePlusFour) {
    
    map.getLayers().forEach(function(layer) {


      if (layer.values_.title == "maritimeStationLayer") {
        layer.setVisible(false)


        let beginDate = []
        let endDate = []

        for (i in allDates) {

          i = Number(i)
          if (dateSelected == allDates[i]) {
            beginDate.push(allDates[i])
            endDate.push(allDates[i+1])
          }
        }




        



  
        var interval = 250
        var promise = Promise.resolve()
  
  
        function floor(value, step) {
          step || (step = 1.0);
          var inv = 1.0 / step;
          return Math.floor(value * inv) / inv;
        }
      
        function ceil(value, step) {
          step || (step = 1.0);
          var inv = 1.0 / step;
          return Math.ceil(value * inv) / inv;
        }



  
  
        layer.getSource().forEachFeature(function(feature) {

  


          promise = promise.then(function () {

    


            
          let maritimeId = feature.values_.id
          let lat = feature.values_.latitude 
          let lng = feature.values_.longitude 
          
          let flooredlat = floor(lat, 0.5)
          let flooredlng = floor(lng, 0.5)
          
          let ceiledlat = ceil(lat, 0.5)
          let ceiledlng = ceil(lng, 0.5)


            console.log(`https://api.iwls-sine.azure.cloud-nuage.dfo-mpo.gc.ca/api/v1/stations/${maritimeId}/data?time-series-code=wlp-hilo&from=${beginDate}T05%3A00%3A00Z&to=${endDate}T05%3A00%3A00Z&resolution=ONE_MINUTE`)
          
            function lookforMaritimeData (maritimeId, beginDate, endDate) {
              return new Promise(function (resolve, reject) {
                fetch(`https://api.iwls-sine.azure.cloud-nuage.dfo-mpo.gc.ca/api/v1/stations/${maritimeId}/data?time-series-code=wlp-hilo&from=${beginDate}T05%3A00%3A00Z&to=${endDate}T05%3A00%3A00Z&resolution=ONE_MINUTE`)
                
                  .then(function (response) {
                    return response.json();           
                  })
                  .then(function (data) {
          
                    resolve(data)
                  })
              })
            }
          

          
  
            let maritimeData = lookforMaritimeData(maritimeId, beginDate, endDate) 
          
          
            Promise.all([maritimeData])   //, wavesData
            .then(values => {
          
          
              function roundMinutes(time) {
          
                let date = new Date(time)
                date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
                date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
  
          
                let hours = date.getUTCHours() // + 5  pour avoir en local
          
                let hoursStep = [0, 3, 6, 9, 12, 15, 18, 21]   // les heures utilisées par le GDPS pour les vagues
               // let hoursStep = [-5, -2, 1, 4, 7, 11, 13, 16]   // les heures utilisées par le GDPS pour les vagues
          
                let rounded3Hours = []
          
          
                for (let i of hoursStep) {
                  rounded3Hours.push(Math.abs(hours - i))
                }
          
          
          
          
                let indexToTake = rounded3Hours.indexOf(Math.min(...rounded3Hours))
          
                let hourToTake = hoursStep[indexToTake]
          
                date.setUTCHours(hourToTake)
          
          
                let newdate = date.toISOString()
          
                newdate = newdate.slice(0, 19) + "Z"
          
            
                return newdate;
            }
          
          
            let tidesValues = []
          
            for (let i in values[0]) {
              tidesValues.push(values[0][i]["value"])
            }
          
            let highestTide = Math.max(...tidesValues)
        
          
              let eventDate = []
              
              
              for (let i in values[0]) {
                if (values[0][i]["value"] == highestTide)
                eventDate.push(roundMinutes(values[0][i]["eventDate"]))
              }
              
          




       //       async function retrieveWavesData() {


            
              let iPixel = [0,1,2]
              let jPixel = [0,1,2]

              let boxWidth = 3
              let boxHeight = 3

              const promises = []



              for (let i of iPixel) {
                for (let j of jPixel) {

                  promises.push(new Promise ((resolve, reject) => {

                
              
            //  console.log(`https://geo.meteo.gc.ca/geomet?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&BBOX=${flooredlat},${flooredlng},${ceiledlat},${ceiledlng}&CRS=EPSG:4326&WIDTH=${boxWidth}&HEIGHT=${boxHeight}&LAYERS=GDWPS_25km_HTSGW_PT3H&INFO_FORMAT=application/json&QUERY_LAYERS=GDWPS_25km_HTSGW_PT3H&I=${i}&J=${j}&TIME=${eventDate}`)
              fetch(`https://geo.meteo.gc.ca/geomet?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&BBOX=${flooredlat},${flooredlng},${ceiledlat},${ceiledlng}&CRS=EPSG:4326&WIDTH=${boxWidth}&HEIGHT=${boxHeight}&LAYERS=GDWPS_25km_HTSGW_PT3H&INFO_FORMAT=application/json&QUERY_LAYERS=GDWPS_25km_HTSGW_PT3H&I=${i}&J=${j}&TIME=${eventDate}`)
              .then(function (response) {
                return response.json();           
              })
              .then(function (data) {
                

                console.log(`https://geo.meteo.gc.ca/geomet?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&BBOX=${flooredlat},${flooredlng},${ceiledlat},${ceiledlng}&CRS=EPSG:4326&WIDTH=${boxWidth}&HEIGHT=${boxHeight}&LAYERS=GDWPS_25km_HTSGW_PT3H&INFO_FORMAT=application/json&QUERY_LAYERS=GDWPS_25km_HTSGW_PT3H&I=${i}&J=${j}&TIME=${eventDate}`)

                resolve([data.features[0].properties.value, data.features[0].geometry.coordinates])    // on prend les lat et lng en prévision de la section 'onclick'
            })
          }))
                }
              }


          Promise.all(promises)
            .then(function(values) {
             let wavesHeight = values.map(str => {
                return Number(str[0]);
            });
            for (i in wavesHeight) {
              if (wavesHeight[i] == 9999) {
                wavesHeight[i] = "NaN"
              }
            }


            function myArrayMax(x) {
              return Math.max(...x.filter(x => typeof x === 'number')); //result is 4
            }
           

            function myArrayMin(x) {
              return Math.min(...x.filter(x => typeof x === 'number')); //result is 4
            }

            let highestWave = myArrayMax(wavesHeight)


            let lowestWave = myArrayMin(wavesHeight)

  
          //  let highestWave = Math.max(...wavesHeight)


  
              
          
          
                    //////// pour créer du texte plutôt que un graphique ///////// 
          
    


                highestWave = highestWave.toString().slice(0, 5)
                lowestWave = lowestWave.toString().slice(0, 5)

                highestTide = highestTide.toString().slice(0, 5)
                



                let eventDateToShow = eventDate.toString().slice(0, 13)

                eventDateToShow = eventDateToShow + "Z"

               // let highestWaveText = highestWave + '|'

              

                
          
              //    tideDiv.innerHTML = values[0][0].value + "mètre"
              //    var newText = [eventDateToShow, '\n', highestWave, '10px sans-serif', ' | ', '', lowestWave, 'italic 10px sans-serif', ' | ', '',  highestTide, '10px sans-serif']



                  /*
                  " " + eventDateToShow + '\n' +
                  " " + highestWave + " m" + '\n' +
                  " " + lowestWave + " m" + '\n' +
                  " " + highestTide + " m"
*/

                  //otherText.innerHTML = highestWave

  

                  


                  var allMarDataStation = [highestTide, values, eventDate[0]]


                  variableIndividualData[maritimeId] = allMarDataStation    // est-ce qu'on doit le vider avant ? mettre var variableIndividualData = {}


                /*
                  variableIndividualData[maritimeId].highT = highestTide
                  variableIndividualData[maritimeId].highW = highestWave
                  variableIndividualData[maritimeId].lowW = lowestWave
                  variableIndividualData[maritimeId].date = eventDate[0]
*/






  
            function scaleForHighWaves (feature, resolution) {
              if (highestWave < 1) {
                return [
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestWave, 
                      offsetX: 0,
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(255, 255, 0)',
                        width: 3
                      })
                    }),
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestWave >= 1 && highestWave < 2) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestWave,
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(255, 155, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestWave >= 2 && highestWave < 3) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestWave,
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(255, 100, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestWave >= 3 && highestWave < 4) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestWave,
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(255, 55, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestWave >= 4) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestWave,
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(255, 0, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (isNaN(highestWave)) {

                  var otherText = "NaN"
                
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: otherText,
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ]; 
                }
            }


            function scaleForLowWaves (feature, resolution) {
              if (lowestWave < 1) {
                return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: lowestWave,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 255, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (lowestWave >= 1 && lowestWave < 2) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: lowestWave,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 155, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (lowestWave >= 2 && lowestWave < 3) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: lowestWave,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 100, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (lowestWave >= 3 && lowestWave < 4) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: lowestWave,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 55, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (lowestWave >= 4) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: lowestWave,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 0, 0)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (isNaN(lowestWave)) {

                  var otherText = "NaN"
                
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: otherText,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ]; 
                }
            }


            function scaleForTides (feature, resolution) {
              console.log(highestTide)
              console.log(eventDateToShow)
              if (highestTide < 1) {
                return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestTide,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 255, 255)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestTide >= 1 && highestTide < 2) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestTide,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 155, 255)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestTide >= 2 && highestTide < 3) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestTide,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 100, 255)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestTide >= 3 && highestTide < 4) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestTide,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 55, 255)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (highestTide >= 4) {
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: highestTide,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'rgb(0, 0, 255)',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ];
                } else if (isNaN(highestTide)) {

                  var otherText = "NaN"
                
                  return [new ol.style.Style({
                    text: new ol.style.Text({
                      text: otherText,
                      font: 'bold 20px',
                      scale: 1.75,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 3
                      })
                    })
                  }),
                  new ol.style.Style({
                    text: new ol.style.Text({
                      text: eventDateToShow, 
                      offsetX: 0,
                      offsetY: -20,
                      scale: 1.5,
                      fill: new ol.style.Fill({
                        color: 'rgb(0,0,0)'
                      }),
                      backgroundFill: new ol.style.Fill({
                        color: 'white'
                      }),
                      backgroundStroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                      })
                    })
                  })
                ]; 
                }
            }
                


            feature.setStyle(scaleForHighWaves())
        //    feature.setGeometry()

            document.getElementById('highestWave').addEventListener("click", (event) => { 


              document.getElementById('highestWave').style['textDecoration'] = 'underline'
              document.getElementById('lowestWave').style['textDecoration'] = 'none'
              document.getElementById('highestTide').style['textDecoration'] = 'none'

              document.getElementById('rectangle1').style['backgroundColor'] = 'rgb(255, 255, 0)'
              document.getElementById('rectangle2').style['backgroundColor'] = 'rgb(255, 155, 0)'
              document.getElementById('rectangle3').style['backgroundColor'] = 'rgb(255, 100, 0)'
              document.getElementById('rectangle4').style['backgroundColor'] = 'rgb(255, 55, 0)'
              document.getElementById('rectangle5').style['backgroundColor'] = 'rgb(255, 0, 0)'
              document.getElementById('rectangle6').style['backgroundColor'] = 'rgb(0, 0, 0)'


              feature.setStyle(scaleForHighWaves())
            })

            document.getElementById('lowestWave').addEventListener("click", (event) => { 


              document.getElementById('highestWave').style['textDecoration'] = 'none'
              document.getElementById('lowestWave').style['textDecoration'] = 'underline'
              document.getElementById('highestTide').style['textDecoration'] = 'none'


              document.getElementById('rectangle1').style['backgroundColor'] = 'rgb(0, 255, 0)'
              document.getElementById('rectangle2').style['backgroundColor'] = 'rgb(0, 155, 0)'
              document.getElementById('rectangle3').style['backgroundColor'] = 'rgb(0, 100, 0)'
              document.getElementById('rectangle4').style['backgroundColor'] = 'rgb(0, 55, 0)'
              document.getElementById('rectangle5').style['backgroundColor'] = 'rgb(0, 0, 0)'
              document.getElementById('rectangle6').style['backgroundColor'] = 'rgb(0, 0, 0)'


              feature.setStyle(scaleForLowWaves())
            })


            document.getElementById('highestTide').addEventListener("click", (event) => { 


              document.getElementById('highestWave').style['textDecoration'] = 'none'
              document.getElementById('lowestWave').style['textDecoration'] = 'none'
              document.getElementById('highestTide').style['textDecoration'] = 'underline'


              document.getElementById('rectangle1').style['backgroundColor'] = 'rgb(0, 255, 255)'
              document.getElementById('rectangle2').style['backgroundColor'] = 'rgb(0, 155, 255)'
              document.getElementById('rectangle3').style['backgroundColor'] = 'rgb(0, 100, 255)'
              document.getElementById('rectangle4').style['backgroundColor'] = 'rgb(0, 55, 255)'
              document.getElementById('rectangle5').style['backgroundColor'] = 'rgb(0, 0, 255)'
              document.getElementById('rectangle6').style['backgroundColor'] = 'rgb(0, 0, 0)'


              feature.setStyle(scaleForTides())
            })



            });
            
          })
            return new Promise(function (resolve) {
              setTimeout(resolve, interval)
            })
          })
        })
  
        promise.then(function () {
          console.log('Loop finished.');
        layer.setVisible(true)
        let container = document.getElementById('container') 
        container.style['cursor'] = 'default'
 //       document.getElementById("loader").style["display"] = "none"

        document.getElementById('highestWave').style['textDecoration'] = 'underline'
        document.getElementById('lowestWave').style['textDecoration'] = 'none'
        document.getElementById('highestTide').style['textDecoration'] = 'none'

        document.getElementById('rectangle1').style['backgroundColor'] = 'rgb(255, 255, 0)'
        document.getElementById('rectangle2').style['backgroundColor'] = 'rgb(255, 155, 0)'
        document.getElementById('rectangle3').style['backgroundColor'] = 'rgb(255, 100, 0)'
        document.getElementById('rectangle4').style['backgroundColor'] = 'rgb(255, 55, 0)'
        document.getElementById('rectangle5').style['backgroundColor'] = 'rgb(255, 0, 0)'
        document.getElementById('rectangle6').style['backgroundColor'] = 'rgb(0, 0, 0)'

        });
  
  
      
  
      }
    })
    } else {
    

    var errorDiv = document.createElement("div")

    errorDiv.id = 'errorDiv'

    var errorText = `Choisir une date entre ${dateZero} et ${datePlusFour}`
  
    errorDiv.innerHTML = errorText

    errorDiv.style["color"] = "red"

  //  let loader = document.getElementById('loader')

 //   loader.style['display'] = 'none'

    toggles.appendChild(errorDiv)


  }



}

effDateMaritime.addEventListener("change", getMaritimeData)


function updateMensualData () {
  var newStationName  = document.getElementById("selectSt").value


  var selectedMonth = document.getElementById("selectMonth").value

  if (selectedMonth <= 9) {
    selectedMonth = '0' + selectedMonth
  }


  while (LTCE_content.firstChild) {
    LTCE_content.removeChild(LTCE_content.firstChild);
  }


  var recordMax = []
  var recordMin = []
  var refEolien = []
  var pluiePrecip = []
  var pluiePeriod = []
  var neigeQuotidien = []
  var tempeteNeige = []
  var vent = []
  var neigeMen = []
  var precipMen = []
  var humidex = []
  var pluieMen = []
  


  var xtremData = `/data/mensual_record/${newStationName}.json`

  fetch(xtremData)
  .then(function (response) {
    return response.json();           
  })
  .then(function (json) {
    

    for (let x in json) {
      if (selectedMonth == json[x]['Mois']) {
        recordMax.push(json[x]['Record max. (°C)'])
        recordMin.push(json[x]['Record min. (°C)'])
        neigeMen.push(json[x]['Record neige mensuelle'])
        precipMen.push(json[x]['Record precip mensuelle'])
        humidex.push(json[x]['Humidex'])
        vent.push(json[x]['Record vent'])
        tempeteNeige.push(json[x]['Record neige (événement complet)'])
        neigeQuotidien.push(json[x]['Record neige quotidienne'])
        refEolien.push(json[x]['Record ref. éolien'])
        pluiePrecip.push(json[x]['Record pluie/precip'])
        pluiePeriod.push(json[x]['Record precip (événement complet)'])
        pluieMen.push(json[x]['Record pluie mensuelle'])
      }
    }

  var recMaxData = recordMax.toString().split("/")
  var recMinData = recordMin.toString().split("/")
  var neigeMenData = neigeMen.toString().split("/")
  var precipMenData = precipMen.toString().split("/")
  var humidexData = humidex.toString().split("/")
  var ventData = vent.toString().split("/")
  var tempeteNeigeData = tempeteNeige.toString().split("/")
  var neigeQuotidienData = neigeQuotidien.toString().split("/")
  var refEolienData = refEolien.toString().split("/")


  if (pluiePrecip[0][0] == "_") {
    var pluiePrecipData = pluiePrecip.toString().slice(1).split(";")
  } else {
    var pluiePrecipData = pluiePrecip.toString().split("/")
  }

  var pluiePeriodData = pluiePeriod.toString().split("/")
  var pluieMenData = pluieMen.toString().split("/")




///////  Reprendre ici ///////////
  var drawTitles1 = ["Record mensuel", "Valeur (°C)", "Date"]
  var records1 = [" ", "Haut maximum", "Bas minimum", "Humidex", "Refroidissement Éolien"]
  var drawValues1 = [" ", recMaxData[0], recMinData[0], humidexData[0], refEolienData[0]]
  var drawDay1 = [" ", recMaxData[1], recMinData[1], humidexData[1], refEolienData[1]]
  var drawMonth1 = [" ", todayMonth, , todayMonth, todayMonth, todayMonth]
  var drawYears1 = [" ", recMaxData[2], recMinData[2], humidexData[2], refEolienData[2]]
  var drawID1 = "tempDraw"



  /* La plupart des records sont construits comme valeur/jour/années (voir les json dans le fichier "mensual_record") ce qui nous donne un tableau à trois éléments après
     avoir utilisé .split("/"). Seulement, les variables qui n'ont pas de valeur (notée "/" dans le fichier json), comme par exemple la neige pendant les mois d'été, donneront deux éléments vides ("","") après le .split("").
    Comme on appelle trois élément dans les variables ci-dessus ([0], [1], [2]), ces variables donneront des tableaux (" "," ", undefined). On veut éviter qu'il soit 
    noté "undefined" sur la page web. On transforme donc l'élément "undefined" en " "
  */
  for (let x in drawYears1) {
    if (drawYears1[x] == undefined) {
      drawYears1[x] = ""
    } 
  }




  var drawTitles2 = ["Record mensuel", "Valeur (cm)", "Date"]
  var records2 = [" ", "Neige quotidienne", "Neige (événement complet)", "Neige mensuelle"]
  var drawValues2 = [" ", neigeQuotidienData[0], tempeteNeigeData[0], neigeMenData[0]]
  var drawDay2 = [" ", neigeQuotidienData[1], tempeteNeigeData[1], ""]
  var drawMonth2 = [" ", todayMonth, todayMonth, todayMonth]
  var drawYears2 = [" ", neigeQuotidienData[2], tempeteNeigeData[2], neigeMenData[1]]
  var drawID2 = "snowDraw"


  for (let x in drawYears2) {
    if (drawYears2[x] == undefined) {
      drawYears2[x] = ""
    } 
  }




  var drawTitles3 = ["Record mensuel", "Valeur (mm)", "Date"]
  var records3 = [" ", "Pluie/precip quotidienne", "Précip (événement complet)", "Précipitation mensuelle", "Pluie mensuelle"]
  var drawValues3 = [" ", pluiePrecipData[0], pluiePeriodData[0], precipMenData[0], pluieMenData[0]]
  var drawDay3 = [" ", pluiePrecipData[1], pluiePeriodData[1], "", ""]
  var drawMonth3 = [" ", todayMonth, todayMonth, todayMonth, todayMonth]
  var drawYears3 = [" ", pluiePrecipData[2], pluiePeriodData[2], precipMenData[1], pluieMenData[1]]  // precipMenData[1] est l'année pour cette variable (comme c'est un record mensuelle, il n'y a pas de journée précise et donc une variable de moins)
  var drawID3 = "precipDraw"

  for (let x in drawYears3) {
    if (drawYears3[x] == undefined) {
      drawYears3[x] = ""
    } 
  }


/*
  var drawTitles4 = ["Humidex", "Refroidissement éolien"]
  var drawValues4 = [humidexData[0], refEolienData[0]]
  var drawDay4 = [humidexData[1], refEolienData[1]]
  var drawMonth4 = [todayMonth, todayMonth]
  var drawYears4 = [humidexData[2], refEolienData[2]]
  var drawID4 = "feelDraw"
*/

  var drawTitles4 = ["Record mensuel", "Valeur (km/h)", "Date"]
  var records4 = [" ", "Rafales"]
  var drawValues4 = [" ", ventData[0]]
  var drawDay4 = [" ", ventData[1]]
  var drawMonth4 = [" ", todayMonth]
  var drawYears4 = [" ", ventData[2]]
  var drawID4 = "windDraw"


  for (let x in drawYears4) {
    if (drawYears4[x] == undefined) {
      drawYears4[x] = ""
    } 
  }


  var jsonArr1 = []
  var jsonArr2 = []
  var jsonArr3 = []
  var jsonArr4 = []



  for (let i = 0; i < records1.length; i++) {
    if (records1[i] == " ") {
      jsonArr1.push({
        Recordmensuel: records1[i],
        valeur: drawValues1[i],
        date: drawYears1[i]
      }) 
    } else if (drawValues1[i] == "") {
      jsonArr1.push({
        Recordmensuel: records1[i],
        valeur: drawValues1[i],
        date: ""
      })
    } else {
      jsonArr1.push({
        Recordmensuel: records1[i],
        valeur: drawValues1[i],
        date: `${drawDay1[i]}/${selectedMonth}/${drawYears1[i]}`
      })
    }
  }





  for (let i = 0; i < records2.length; i++) {
    if (records2[i] == " ") {  // anciennement if (records2[i] == " " || records2[i] == "Neige mensuelle") {}
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: drawYears2[i]
      })
    } else if (drawValues2[i] == "") {
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: ""
      })
    } else if (records2[i] == "Neige mensuelle") {
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: `${selectedMonth}/${drawYears2[i]}`
      })
    } else {
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: `${drawDay2[i]}/${selectedMonth}/${drawYears2[i]}`
      })
    }
  }



  for (let i = 0; i < records3.length; i++) {
    if (records3[i] == " ") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: drawYears3[i]
      })
    } else if (drawValues3[i] == "") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: ""
      })
    } else if (records3[i] == "Précipitation mensuelle" || records3[i] == "Pluie mensuelle") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: `${selectedMonth}/${drawYears3[i]}`
      })
    } else if (pluiePrecip[0][0] == "_") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: `${drawDay3[i]}`                    // Ici, je mets drawDay3 parce que les valeurs dans les fichiers excels qui avaient plusieurs dates, je les ai réecris différement (voir JSON correspondant) --> 
      })                                          // Ces variables ne se séparent qu'en 2 autours d'un ; et non pas en trois autour d'un / comme les variables avec une seule date
    } else {                                      // Dans la construction des tableaux, ces dates se retrouvent dans drawDay3 et non pas dans drawYears3.
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: `${drawDay3[i]}/${selectedMonth}/${drawYears3[i]}`
      })
    }
  }




  for (let i = 0; i < records4.length; i++) {
    if (records4[i] == " ") {
      jsonArr4.push({
        Recordmensuel: records4[i],
        valeur: drawValues4[i],
        date: drawYears4[i]
      })
    } else if (drawValues4[i] == "") {
      jsonArr4.push({
        Recordmensuel: records4[i],
        valeur: drawValues4[i],
        date: ""
      })
    } else {
      jsonArr4.push({
        Recordmensuel: records4[i],
        valeur: drawValues4[i],
        date: `${drawDay4[i]}/${selectedMonth}/${drawYears4[i]}`
      })
    }
  }





  var titleCity = document.createElement("div")
    titleCity.innerHTML = `${newStationName}` 
    titleCity.style["fontWeight"] = "bold"
    titleCity.style["textDecoration"] = "underline"
    titleCity.style["textAlign"] = "center"
    titleCity.style["fontSize"] = "20px"

  LTCE_content.appendChild(titleCity)

  

  let units
  let captionText




  createTable (jsonArr1, drawTitles1, records1, drawValues1, drawYears1, drawID1, units = '')
  createTable (jsonArr2, drawTitles2, records2, drawValues2, drawYears2, drawID2, units = '')
  createTable (jsonArr3, drawTitles3, records3, drawValues3, drawYears3, drawID3, units = '')
  createTable (jsonArr4, drawTitles4, records4, drawValues4, drawYears4, drawID4, units = '')


  var table1 = document.getElementById("tempDraw")
  var table2 = document.getElementById("snowDraw")  
  var table3 = document.getElementById("precipDraw") 
  var table4 = document.getElementById("windDraw") 


  document.querySelector("#tempDraw tr").style["backgroundColor"] = "rgb(147, 0, 174, 0.2)"
  document.querySelector("#snowDraw tr").style["backgroundColor"] = "rgb(0, 0, 180, 0.2)"
  document.querySelector("#precipDraw tr").style["backgroundColor"] = "rgb(0, 140, 0, 0.2)"
  document.querySelector("#windDraw tr").style["backgroundColor"] = "rgb(140, 140, 140, 0.4)"



  table1.style["marginTop"] = "20px"
  table2.style["marginTop"] = "20px"
  table3.style["marginTop"] = "20px"
  table4.style["marginTop"] = "20px"

})
}




rdjourBtn.addEventListener("click", (event) => {



  ////  remettre si ça ne fonctionne pas...j'ai utilisé la fonction pour retrouvé les variables en dehors des autres fonctions donc ça devrait fonctionner partout normalement
  /*
  var today = addSomeDate(0)

  var todayYear = today[0]
  var todayMonth = today[1]
  var todayDay = today[2]
  */

  removeAllChildNodes(LTCE_content)

 

  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)


  formQuestion.appendChild(formQuestion__title)
  formQuestion.appendChild(inputContainer)

  removeAllChildNodes(inputContainer)

  inputContainer.appendChild(effDate)

  //var effDate = document.getElementById("effective-date")

  effDate.value = todayYear + "-" + todayMonth + "-" + todayDay

  document.getElementById("chooseDate").innerHTML = "Choisir une date"




  // mettre des temps de chargement
  LTCE_content.innerHTML = "chargement..."

  updateData()

          

})

rdmensBtn.addEventListener("click", (event) => {


  while (LTCE_content.firstChild) {
    LTCE_content.removeChild(LTCE_content.firstChild);
  }


  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)

  formQuestion.appendChild(formQuestion__title)
  formQuestion.appendChild(inputContainer)

  removeAllChildNodes(inputContainer)

  document.getElementById("chooseDate").innerHTML = "Choisir un mois"

  var monthList = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  var selectMonth = document.createElement("select")
  selectMonth.id = "selectMonth"

  var monthOptions = []
  for (let i = 1; i<monthList.length+1; i++) {
    if (i == todayMonth) {
      monthOptions.push(`<option value=${i} selected=\"selected\"> ${monthList[i-1]} </option>`)
    } else {
    monthOptions.push(`<option value=${i}> ${monthList[i-1]} </option>`)
    }
  }
  selectMonth.innerHTML = monthOptions


  selectMonth.style["appearance"] = "none"
  selectMonth.style["border"] = "none"
  selectMonth.style["width"] = "100%"
  selectMonth.style["height"] = "41px"
  selectMonth.style["paddingLeft"] = "20px"
  selectMonth.style["fontSize"] = "15px"
  selectMonth.style["outline"] = "none"


  
  inputContainer.appendChild(selectMonth)



  //var station = document.getElementById("selectSt").value
  



  var newStationName  = document.getElementById("selectSt").value


  var recordMax = []
  var recordMin = []
  var refEolien = []
  var pluiePrecip = []
  var pluiePeriod = []
  var neigeQuotidien = []
  var tempeteNeige = []
  var vent = []
  var neigeMen = []
  var precipMen = []
  var humidex = []
  var pluieMen = []
  


  var xtremData = `/data/mensual_record/${newStationName}.json`

  fetch(xtremData)
  .then(function (response) {
    return response.json();           
  })
  .then(function (json) {
    

    for (let x in json) {
      if (todayMonth == json[x]['Mois']) {
        recordMax.push(json[x]['Record max. (°C)'])
        recordMin.push(json[x]['Record min. (°C)'])
        neigeMen.push(json[x]['Record neige mensuelle'])
        precipMen.push(json[x]['Record precip mensuelle'])
        humidex.push(json[x]['Humidex'])
        vent.push(json[x]['Record vent'])
        tempeteNeige.push(json[x]['Record neige (événement complet)'])
        neigeQuotidien.push(json[x]['Record neige quotidienne'])
        refEolien.push(json[x]['Record ref. éolien'])
        pluiePrecip.push(json[x]['Record pluie/precip'])
        pluiePeriod.push(json[x]['Record precip (événement complet)'])
        pluieMen.push(json[x]['Record pluie mensuelle'])
      }
    }

  var recMaxData = recordMax.toString().split("/")
  var recMinData = recordMin.toString().split("/")
  var neigeMenData = neigeMen.toString().split("/")
  var precipMenData = precipMen.toString().split("/")
  var humidexData = humidex.toString().split("/")
  var ventData = vent.toString().split("/")
  var tempeteNeigeData = tempeteNeige.toString().split("/")
  var neigeQuotidienData = neigeQuotidien.toString().split("/")
  var refEolienData = refEolien.toString().split("/")

  if (pluiePrecip[0][0] == "_") {
    var pluiePrecipData = pluiePrecip.toString().slice(1).split(";")
  } else {
    var pluiePrecipData = pluiePrecip.toString().split("/")
  }

  var pluiePeriodData = pluiePeriod.toString().split("/")
  var pluieMenData = pluieMen.toString().split("/")




///////  Reprendre ici ///////////
  var drawTitles1 = ["Record mensuel", "Valeur (°C)", "Date"]
  var records1 = [" ", "Haut maximum", "Bas minimum", "Humidex", "Refroidissement Éolien"]
  var drawValues1 = [" ", recMaxData[0], recMinData[0], humidexData[0], refEolienData[0]]
  var drawDay1 = [" ", recMaxData[1], recMinData[1], humidexData[1], refEolienData[1]]
  var drawMonth1 = [" ", todayMonth, , todayMonth, todayMonth, todayMonth]
  var drawYears1 = [" ", recMaxData[2], recMinData[2], humidexData[2], refEolienData[2]]
  var drawID1 = "tempDraw"


  for (let x in drawYears1) {
    if (drawYears1[x] == undefined) {
      drawYears1[x] = ''
    } 
  }



  var drawTitles2 = ["Record mensuel", "Valeur (cm)", "Date"]
  var records2 = [" ", "Neige quotidienne", "Neige (événement complet)", "Neige mensuelle"]
  var drawValues2 = [" ", neigeQuotidienData[0], tempeteNeigeData[0], neigeMenData[0]]
  var drawDay2 = [" ", neigeQuotidienData[1], tempeteNeigeData[1], ""]
  var drawMonth2 = [" ", todayMonth, todayMonth, todayMonth]
  var drawYears2 = [" ", neigeQuotidienData[2], tempeteNeigeData[2], neigeMenData[1]]
  var drawID2 = "snowDraw"


  for (let x in drawYears2) {
    if (drawYears2[x] == undefined) {
      drawYears2[x] = ''
    } 
  }



  var drawTitles3 = ["Record mensuel", "Valeur (mm)", "Date"]
  var records3 = [" ", "Pluie/precip quotidienne", "Précip (événement complet)", "Précipitation mensuelle", "Pluie mensuelle"]
  var drawValues3 = [" ", pluiePrecipData[0], pluiePeriodData[0], precipMenData[0], pluieMenData[0]]
  var drawDay3 = [" ", pluiePrecipData[1], pluiePeriodData[1], "", ""]
  var drawMonth3 = [" ", todayMonth, todayMonth, todayMonth, todayMonth]
  var drawYears3 = [" ", pluiePrecipData[2], pluiePeriodData[2], precipMenData[1], pluieMenData[1]]  // precipMenData[1] est l'année pour cette variable (comme c'est un record mensuelle, il n'y a pas de journée précise et donc une variable de moins)
  var drawID3 = "precipDraw"


  for (let x in drawYears3) {
    if (drawYears3[x] == undefined) {
      drawYears3[x] = ''
    } 
  }


/*
  var drawTitles4 = ["Humidex", "Refroidissement éolien"]
  var drawValues4 = [humidexData[0], refEolienData[0]]
  var drawDay4 = [humidexData[1], refEolienData[1]]
  var drawMonth4 = [todayMonth, todayMonth]
  var drawYears4 = [humidexData[2], refEolienData[2]]
  var drawID4 = "feelDraw"
*/

  var drawTitles4 = ["Record mensuel", "Valeur (km/h)", "Date"]
  var records4 = [" ", "Rafales"]
  var drawValues4 = [" ", ventData[0]]
  var drawDay4 = [" ", ventData[1]]
  var drawMonth4 = [" ", todayMonth]
  var drawYears4 = [" ", ventData[2]]
  var drawID4 = "windDraw"


  for (let x in drawYears4) {
    if (drawYears4[x] == undefined) {
      drawYears4[x] = ''
    } 
  }


  var jsonArr1 = []
  var jsonArr2 = []
  var jsonArr3 = []
  var jsonArr4 = []



  for (let i = 0; i < records1.length; i++) {
    if (records1[i] == " ") {
      jsonArr1.push({
        Recordmensuel: records1[i],
        valeur: drawValues1[i],
        date: drawYears1[i]
      })
    } else if (drawValues1[i] == "") {
      jsonArr1.push({
        Recordmensuel: records1[i],
        valeur: drawValues1[i],
        date: ""
      })
    } else {
      jsonArr1.push({
        Recordmensuel: records1[i],
        valeur: drawValues1[i],
        date: `${drawDay1[i]}/${todayMonth}/${drawYears1[i]}`
      })
    }
  }




  for (let i = 0; i < records2.length; i++) {
    if (records2[i] == " ") {
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: drawYears2[i]
      })
    } else if (drawValues2[i] == "") {
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: ""
      })
    } else if (records2[i] == "Neige mensuelle") {
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: `${todayMonth}/${drawYears2[i]}`
      })
    } else {
      jsonArr2.push({
        Recordmensuel: records2[i],
        valeur: drawValues2[i],
        date: `${drawDay2[i]}/${todayMonth}/${drawYears2[i]}`
      })
    }
  }



  for (let i = 0; i < records3.length; i++) {
    if (records3[i] == " ") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: drawYears3[i]
      })
    } else if (drawValues3[i] == "") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: ""
      })
    } else if (records3[i] == "Précipitation mensuelle" || records3[i] == "Pluie mensuelle") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: `${todayMonth}/${drawYears3[i]}`
      })
    } else if (pluiePrecip[0][0] == "_") {
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: `${drawDay3[i]}`          // Ici, je mets drawDay3 parce que les valeurs dans les fichiers excels qui avaient plusieurs dates, je les ai réecris différement (voir JSON correspondant) --> 
      })                                // Ces variables ne se séparent qu'en 2 autours d'un ; et non pas en trois autour d'un / comme les variables avec une seule date
    } else {                            // Dans la construction des tableaux, ces dates se retrouvent dans drawDay3 et non pas dans drawYears3.
      jsonArr3.push({
        Recordmensuel: records3[i],
        valeur: drawValues3[i],
        date: `${drawDay3[i]}/${todayMonth}/${drawYears3[i]}`
      })
    }
  }




  for (let i = 0; i < records4.length; i++) {
    if (records4[i] == " ") {
      jsonArr4.push({
        Recordmensuel: records4[i],
        valeur: drawValues4[i],
        date: drawYears4[i]
      })
    } else if (drawValues3[i] == "") {
      jsonArr4.push({
        Recordmensuel: records4[i],
        valeur: drawValues4[i],
        date: "" 
      }) 
    } else {
      jsonArr4.push({
        Recordmensuel: records4[i],
        valeur: drawValues4[i],
        date: `${drawDay4[i]}/${todayMonth}/${drawYears4[i]}`
      })
    }
  }




  var titleCity = document.createElement("div")
    titleCity.innerHTML = `${newStationName}` 
    titleCity.style["fontWeight"] = "bold"
    titleCity.style["textDecoration"] = "underline"
    titleCity.style["textAlign"] = "center"
    titleCity.style["fontSize"] = "20px"

  LTCE_content.appendChild(titleCity)

  

  let units
  let captionText




  createTable (jsonArr1, drawTitles1, records1, drawValues1, drawYears1, drawID1, units = '')
  createTable (jsonArr2, drawTitles2, records2, drawValues2, drawYears2, drawID2, units = '')
  createTable (jsonArr3, drawTitles3, records3, drawValues3, drawYears3, drawID3, units = '')
  createTable (jsonArr4, drawTitles4, records4, drawValues4, drawYears4, drawID4, units = '')


  var table1 = document.getElementById("tempDraw")
  var table2 = document.getElementById("snowDraw")  
  var table3 = document.getElementById("precipDraw") 
  var table4 = document.getElementById("windDraw") 


  document.querySelector("#tempDraw tr").style["backgroundColor"] = "rgb(147, 0, 174, 0.2)"
  document.querySelector("#snowDraw tr").style["backgroundColor"] = "rgb(0, 0, 180, 0.2)"
  document.querySelector("#precipDraw tr").style["backgroundColor"] = "rgb(0, 140, 0, 0.2)"
  document.querySelector("#windDraw tr").style["backgroundColor"] = "rgb(140, 140, 140, 0.4)"



  table1.style["marginTop"] = "20px"
  table2.style["marginTop"] = "20px"
  table3.style["marginTop"] = "20px"
  table4.style["marginTop"] = "20px"


  selectMonth.addEventListener("change", updateMensualData)



})
})



var newTextDiv = document.createElement("div")

var meanLink2 = document.createElement("div")
var singleLink2 = document.createElement("div")

var meanLink3 = document.createElement("div")
var singleLink3 = document.createElement("div")

var meanLink4 = document.createElement("div")
var singleLink4 = document.createElement("div")

var meanLink5 = document.createElement("div")
var singleLink5 = document.createElement("div")


link1Btn.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Quantité de neige par saison en centimètres"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  var newStationName  = document.getElementById("selectSt").value



/////////// Apparement pas utile, à revoir
  async function logQuantities() {
    const response = await fetch(`data/hiver/neige_quantités/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()
///////////





  fetch(`data/hiver/neige_quantités/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {




      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])


      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }


  json = json.map(
    obj => Object.fromEntries(
      Object.entries(obj)
        .map(([key, val]) => {
        if (val == "n/d" || val == "T" || key == "SAISON") {
          return [key, val]
        } else {
          return [key, parseFloat(val.replaceAll(',', '.'))]
        }
    })
    )
  );



      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };



      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {



        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {

                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                if (b[param] == "n/d") {
                  return -1
                }

                return 0;

                
              })
              
            : [...data].sort(function (a, b) {

                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                if (b[param] == "n/d") {
                  return -1
                }

                return 0;
              });

        return sortedData
        

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {


          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (val == "T") {
                  return [key, 0.1]
                } else {
                  return [key, val]
                }
            })
            )
          );


          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (val == 0.1) {
                    return [key, "T"]
                  } else {
                    return [key, val]
                  }
              })
              )
            );


            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {
            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (val == 0.1) {
                    return [key, "T"]
                  } else {
                    return [key, val]
                  }
              })
              )
            );
            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }

          
        });
      });




});
});


link2Btn.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  var newTextDiv = document.createElement("div")
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Dates des premières chutes de neige"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(meanLink2)
  meanLink2.innerHTML = "Moyenne"
  meanLink2.style["fontSize"] = "20px"
  meanLink2.style["textAlign"] = "left"
  meanLink2.style["marginTop"] = "50px"
  meanLink2.style["color"] = "blue"
  meanLink2.style["marginTop"] = "5px"
  meanLink2.style["fontWeight"] = "bold"
  meanLink2.style["cursor"] = "pointer"









  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/hiver/traces/evenements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/hiver/traces/evenements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {





      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }






      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                if (a[param] == "NA") {
                  return -1
                }


                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                if (b[param] == "NA") {
                  return -1
                }


                return 0;
              });


              return sortedData

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {


          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );



          resetButtons(e);


          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
                   
                    let newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()

                    
                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }

          
        });
      });
});
});

meanLink2.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Moyenne des premières chutes de neige"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(singleLink2)
  singleLink2.innerHTML = "Événement"
  singleLink2.style["fontSize"] = "20px"
  singleLink2.style["textAlign"] = "left"
  singleLink2.style["marginTop"] = "50px"
  singleLink2.style["color"] = "blue"
  singleLink2.style["marginTop"] = "5px"
  singleLink2.style["fontWeight"] = "bold"
  singleLink2.style["cursor"] = "pointer"




  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/hiver/traces/moyennes/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/hiver/traces/moyennes/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {





      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }


      json = json.map(
        obj => Object.fromEntries(
          Object.entries(obj)
            .map(([key, val]) => {
            if (key == "# de 15 cm +") {
              return [key, parseFloat(val.replaceAll(',', '.'))]
            } else {
              return [key, val]
            }
        })
        )
      );


      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                return 0;
              });


              return sortedData

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Période" || key == "# de 15 cm +") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );



          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Période" || key == "# de 15 cm +") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Période" || key == "# de 15 cm +") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }
        });
      });
});
})

singleLink2.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Date des premières chutes de neige"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(meanLink2)
  meanLink2.innerHTML = "Moyenne"
  meanLink2.style["fontSize"] = "20px"
  meanLink2.style["textAlign"] = "left"
  meanLink2.style["marginTop"] = "50px"
  meanLink2.style["color"] = "blue"
  meanLink2.style["marginTop"] = "5px"
  meanLink2.style["fontWeight"] = "bold"
  meanLink2.style["cursor"] = "pointer"









  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/hiver/traces/evenements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/hiver/traces/evenements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {




      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }


      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                if (a[param] == "NA") {
                  return -1
                }


                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                if (b[param] == "NA") {
                  return -1
                }


                return 0;
              });


              return sortedData

      };
      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );

          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
                   
                    let newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()

                    
                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }


        });
      });
});
})

link3Btn.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  var newTextDiv = document.createElement("div")
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Dates des premiers froids"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''


  
  formQuestion.appendChild(meanLink3)
  meanLink3.innerHTML = "Moyenne"
  meanLink3.style["fontSize"] = "20px"
  meanLink3.style["textAlign"] = "left"
  meanLink3.style["marginTop"] = "50px"
  meanLink3.style["color"] = "blue"
  meanLink3.style["marginTop"] = "5px"
  meanLink3.style["fontWeight"] = "bold"
  meanLink3.style["cursor"] = "pointer"



  var newStationName  = document.getElementById("selectSt").value


  async function logQuantities() {
    const response = await fetch(`data/hiver/temperatures/evenements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/hiver/temperatures/evenements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {




      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }



      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                return 0;
              });


              return sortedData

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Année") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );

          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Année") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Année") {
                    return [key, val]
                  } else {
                    
                   
                    let newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()

                    
                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }


        });
      });
});
});

meanLink3.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Moyenne des premiers froids"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(singleLink3)
  singleLink3.innerHTML = "Événement"
  singleLink3.style["fontSize"] = "20px"
  singleLink3.style["textAlign"] = "left"
  singleLink3.style["marginTop"] = "50px"
  singleLink3.style["color"] = "blue"
  singleLink3.style["marginTop"] = "5px"
  singleLink3.style["fontWeight"] = "bold"
  singleLink3.style["cursor"] = "pointer"









  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/hiver/temperatures/moyennes/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/hiver/temperatures/moyennes/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {



      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }



      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {

        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }
                return 0;
              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }
                return 0;
              });
        getTableContent(sortedData);
      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {


          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {
            let sortedData = sortData(json, e.target.id, "asc");


            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }

          
        });
      });
});
})

singleLink3.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Date des premières chutes de neige"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(meanLink3)
  meanLink3.innerHTML = "Moyenne"
  meanLink3.style["fontSize"] = "20px"
  meanLink3.style["textAlign"] = "left"
  meanLink3.style["marginTop"] = "50px"
  meanLink3.style["color"] = "blue"
  meanLink3.style["marginTop"] = "5px"
  meanLink3.style["fontWeight"] = "bold"
  meanLink3.style["cursor"] = "pointer"


  var newStationName  = document.getElementById("selectSt").value


  async function logQuantities() {
    const response = await fetch(`data/hiver/temperatures/evenements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()



  fetch(`data/hiver/temperatures/evenements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {



      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }



      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                return 0;
              });


              return sortedData

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Année") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );

          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Année") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Année") {
                    return [key, val]
                  } else {
                    
                   
                    let newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()

                    
                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }


        });
      });
});
})


link4Btn.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Nombre de journées avec 30+ degrés"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''


  formQuestion.appendChild(meanLink4)
  meanLink4.innerHTML = "Moyenne"
  meanLink4.style["fontSize"] = "20px"
  meanLink4.style["textAlign"] = "left"
  meanLink4.style["marginTop"] = "50px"
  meanLink4.style["color"] = "blue"
  meanLink4.style["marginTop"] = "5px"
  meanLink4.style["fontWeight"] = "bold"
  meanLink4.style["cursor"] = "pointer"

  var newStationName  = document.getElementById("selectSt").value



/////////// Apparement pas utile, à revoir
  async function logQuantities() {
    const response = await fetch(`data/été/30degres/événements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()
///////////





  fetch(`data/été/30degres/événements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {



      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])


      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }



  /*
  json = json.map(
    obj => Object.fromEntries(
      Object.entries(obj)
        .map(([key, val]) => {
        if (val == "n/d" || val == "T" || key == "SAISON") {
          return [key, val]
        } else {
          return [key, parseFloat(val.replaceAll(',', '.'))]
        }
    })
    )
  );
*/




      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };



      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {



        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {

                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                return 0;

                
              })
              
            : [...data].sort(function (a, b) {

                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                return 0;
              });

        return sortedData
        

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

/*
          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (val == "T") {
                  return [key, 0.1]
                } else {
                  return [key, val]
                }
            })
            )
          );
*/

          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            /*
            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (val == 0.1) {
                    return [key, "T"]
                  } else {
                    return [key, val]
                  }
              })
              )
            );
*/

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {
            let sortedData = sortData(json, e.target.id, "asc");


            /*
            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (val == 0.1) {
                    return [key, "T"]
                  } else {
                    return [key, val]
                  }
              })
              )
            );

            */


            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }

          
        });
      });




});
});

meanLink4.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Moyenne des journées avec 30+ degrés"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(singleLink4)
  singleLink4.innerHTML = "Événement"
  singleLink4.style["fontSize"] = "20px"
  singleLink4.style["textAlign"] = "left"
  singleLink4.style["marginTop"] = "50px"
  singleLink4.style["color"] = "blue"
  singleLink4.style["marginTop"] = "5px"
  singleLink4.style["fontWeight"] = "bold"
  singleLink4.style["cursor"] = "pointer"




  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/été/30degres/moyennes/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/été/30degres/moyennes/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {



      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }


      json = json.map(
        obj => Object.fromEntries(
          Object.entries(obj)
            .map(([key, val]) => {
            if (key == "# de 15 cm +") {
              return [key, parseFloat(val.replaceAll(',', '.'))]
            } else {
              return [key, val]
            }
        })
        )
      );


      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                return 0;
              });


              return sortedData

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Période" || key == "# de 15 cm +") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );



          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Période" || key == "# de 15 cm +") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Période" || key == "# de 15 cm +") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }
        });
      });
});
})

singleLink4.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Nombre de journées avec 30+ degrés"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(meanLink4)
  meanLink4.innerHTML = "Moyenne"
  meanLink4.style["fontSize"] = "20px"
  meanLink4.style["textAlign"] = "left"
  meanLink4.style["marginTop"] = "50px"
  meanLink4.style["color"] = "blue"
  meanLink4.style["marginTop"] = "5px"
  meanLink4.style["fontWeight"] = "bold"
  meanLink4.style["cursor"] = "pointer"









  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/été/30degres/événements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/été/30degres/événements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {




      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }


      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                if (a[param] == "NA") {
                  return -1
                }


                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                if (b[param] == "NA") {
                  return -1
                }


                return 0;
              });


              return sortedData

      };
      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );

          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
                   
                    let newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()

                    
                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }


        });
      });
});
})


link5Btn.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Nombre de nuits avec 20+ degrés"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''



  formQuestion.appendChild(meanLink5)
  meanLink5.innerHTML = "Moyenne"
  meanLink5.style["fontSize"] = "20px"
  meanLink5.style["textAlign"] = "left"
  meanLink5.style["marginTop"] = "50px"
  meanLink5.style["color"] = "blue"
  meanLink5.style["marginTop"] = "5px"
  meanLink5.style["fontWeight"] = "bold"
  meanLink5.style["cursor"] = "pointer"



  var newStationName  = document.getElementById("selectSt").value



/////////// Apparement pas utile, à revoir
  async function logQuantities() {
    const response = await fetch(`data/été/nuit20degres/événements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()
///////////





  fetch(`data/été/nuit20degres/événements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {



      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])


      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }



  /*
  json = json.map(
    obj => Object.fromEntries(
      Object.entries(obj)
        .map(([key, val]) => {
        if (val == "n/d" || val == "T" || key == "SAISON") {
          return [key, val]
        } else {
          return [key, parseFloat(val.replaceAll(',', '.'))]
        }
    })
    )
  );
*/




      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };



      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {



        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {

                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                return 0;

                
              })
              
            : [...data].sort(function (a, b) {

                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                return 0;
              });

        return sortedData
        

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

/*
          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (val == "T") {
                  return [key, 0.1]
                } else {
                  return [key, val]
                }
            })
            )
          );
*/

          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            /*
            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (val == 0.1) {
                    return [key, "T"]
                  } else {
                    return [key, val]
                  }
              })
              )
            );
*/

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {
            let sortedData = sortData(json, e.target.id, "asc");


            /*
            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (val == 0.1) {
                    return [key, "T"]
                  } else {
                    return [key, val]
                  }
              })
              )
            );

            */


            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }

          
        });
      });




});
});

meanLink5.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Moyenne des nuits avec 20+ degrés"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(singleLink5)
  singleLink5.innerHTML = "Événement"
  singleLink5.style["fontSize"] = "20px"
  singleLink5.style["textAlign"] = "left"
  singleLink5.style["marginTop"] = "50px"
  singleLink5.style["color"] = "blue"
  singleLink5.style["marginTop"] = "5px"
  singleLink5.style["fontWeight"] = "bold"
  singleLink5.style["cursor"] = "pointer"




  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/été/nuit20degres/moyennes/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/été/nuit20degres/moyennes/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {




      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }


      json = json.map(
        obj => Object.fromEntries(
          Object.entries(obj)
            .map(([key, val]) => {
            if (key == "# de 15 cm +") {
              return [key, parseFloat(val.replaceAll(',', '.'))]
            } else {
              return [key, val]
            }
        })
        )
      );


      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                return 0;
              });


              return sortedData

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Période" || key == "# de 15 cm +") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );



          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Période" || key == "# de 15 cm +") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Période" || key == "# de 15 cm +") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }
        });
      });
});
})

singleLink5.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Nombre de nuits avec 20+ degrés"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''

  formQuestion.appendChild(meanLink5)
  meanLink5.innerHTML = "Moyenne"
  meanLink5.style["fontSize"] = "20px"
  meanLink5.style["textAlign"] = "left"
  meanLink5.style["marginTop"] = "50px"
  meanLink5.style["color"] = "blue"
  meanLink5.style["marginTop"] = "5px"
  meanLink5.style["fontWeight"] = "bold"
  meanLink5.style["cursor"] = "pointer"




  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/été/nuit20degres/événements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/été/nuit20degres/événements/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {



      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }


      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                if (a[param] == "NA") {
                  return -1
                }


                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                if (b[param] == "NA") {
                  return -1
                }


                return 0;
              });


              return sortedData

      };
      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {

          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );

          resetButtons(e);

          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
                   
                    let newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()

                    
                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }


        });
      });
});
})

link6Btn.addEventListener("click", (event) => {
  var formQuestion = document.getElementById("form-question")
  removeAllChildNodes(formQuestion)
  var newTextDiv = document.createElement("div")
  formQuestion.appendChild(newTextDiv)
  newTextDiv.innerHTML = "Premier"
  newTextDiv.style["fontSize"] = "25px"
  newTextDiv.style["textAlign"] = "center"
  newTextDiv.style["marginTop"] = "50px"
  newTextDiv.style["borderBottom"] = "1px solid #000"
  LTCE_content.innerHTML = ''










  var newStationName  = document.getElementById("selectSt").value




  async function logQuantities() {
    const response = await fetch(`data/hiver/traces/evenements/${newStationName}.json`);
    const quantities = await response.json();
  }
  logQuantities()






  fetch(`data/été/Premier102030/${newStationName}.json`)
    .then(function (response) {
      return response.json();           
    })
     
    .then(function (json) {





      var table = document.createElement('TABLE')
      table.class = "data-table"
      table.style["borderCollapse"] = "collapse"
      table.style["width"] = "100%"



      var tableBody = document.createElement('TBODY')
      tableBody.id = "table-content"
      var thead = document.createElement('thead')

      table.appendChild(thead);
      table.appendChild(tableBody);
      LTCE_content.appendChild(table)





      const tableContent = document.getElementById("table-content")

      var keys = Object.keys(json[0])



      var tr = document.createElement('TR');
  thead.appendChild(tr);
  for (let i = 0; i < keys.length; i++) {
      var th = document.createElement('TH')
      var thButton = document.createElement('button')
      th.width = '75';
      thButton.style["width"] = "100%"
      thButton.style["height"] = "100%"
      th.appendChild(thButton)

      thButton.style["display"] = "grid"
      thButton.style["gridTemplateRows"] = "100%"
      thButton.style["gridTemplateColumns"] = "90% 10%"

      var leftPart = document.createElement("span")
      var rightPart = document.createElement("span")

      

      leftPart.style["gridArea"] = "1 / 1 / span 1 / span 1"
      rightPart.style["gridArea"] = "1 / 2 / span 1 / span 1"

      rightPart.style["width"] = "100%"
      rightPart.style["height"] = "100%"


 //     rightPart.style["backgroundColor"] = "red"
 //     leftPart.style["backgroundColor"] = "blue"


      leftPart.appendChild(document.createTextNode(keys[i]));
 //     thButton.appendChild(document.createTextNode(keys[i]));
      



      thButton.id = `${keys[i]}`
      leftPart.id = `${keys[i]}`
      rightPart.id = `${keys[i]}`
      thButton.className = "theButtons"
      tr.appendChild(th);
      

      thButton.appendChild(leftPart)
      thButton.appendChild(rightPart)

      var arrow = document.createElement("i")
      arrow.id = `${keys[i]}_arrow`
   
      rightPart.appendChild(arrow)


      leftPart.style["paddingRight"] = "10px"


      tr.style["borderBottom"] = "1px solid #ddd"
      tr.style["borderTop"] = "1px solid #ddd"
      tr.style["height"] = "1px"


      th.style["fontWeight"] = "bold"
      th.style["height"] = "inherit"
      th.style["padding"] = "0"
      


      // tr = colonne
      // th = bouttons de la colonne
      thButton.style["backgroundColor"] = "#eee"
      thButton.style["border"] = "none"
      thButton.style["cursor"] = "pointer"
    //  thButton.style["display"] = "block"
      thButton.style["font"] = "inherit"
      thButton.style["height"] = "100%"
      thButton.style["margin"] = "0"
      thButton.style["minWidth"] = "max-content"
      thButton.style["padding"] = "0.5rem 1rem"
      thButton.style["position"] = "relative"
      thButton.style["textAlign"] = "left"
      thButton.style["width"] = "100%"
  }






      const createRow = (obj) => {
        const row = document.createElement("tr");
        row.style["borderBottom"] = "2px solid #ddd"
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          cell.innerHTML = obj[key];
          row.appendChild(cell);
          cell.style["textAlign"] = "center"
          cell.style["padding"] = "left"
        });
        return row;
      };

      const getTableContent = (data) => {
        data.map((obj) => {
          const row = createRow(obj);
          tableContent.appendChild(row);
        });
      };


      const tableButtons = document.querySelectorAll("th button");
      const arrows = document.querySelectorAll("i:not(#winterArrow, #summerArrow)");

      const sortData = (data, param, direction = "asc") => {


        
        tableContent.innerHTML = '';
        const sortedData =
          direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[param]) {
                  return -1;
                }
                if (a[param] > b[param]) {
                  return 1;
                }

                if (a[param] == "NA") {
                  return -1
                }


                return 0;

              })
            : [...data].sort(function (a, b) {
                if (b[param] < a[param]) {
                  return -1;
                }
                if (b[param] > a[param]) {
                  return 1;
                }

                if (b[param] == "NA") {
                  return -1
                }


                return 0;
              });


              return sortedData

      };

      getTableContent(json);


      const resetButtons = (event) => {
        [...arrows].map((singleArrow) => {
          var arrowId = `${event.target.id}_arrow`
          var arrowDown = document.getElementById(arrowId)
          var arrowUp = document.getElementById(arrowId)
          var thisArrow = document.getElementById(`${event.target.id}_arrow`)
      


          if (singleArrow.id !== `${event.target.id}_arrow`) {
            
            singleArrow.style["visibility"] = "hidden"
            

          //  button.removeAttribute("data-dir");
          }
        });
      };

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {


          json = json.map(
            obj => Object.fromEntries(
              Object.entries(obj)
                .map(([key, val]) => {
                if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                  return [key, val]
                } else {
                  let newVal = val.split('-').reverse()
                  if (newVal[0] == 'juil') {
                    newVal[0] = '01'
                  } else if (newVal[0] == 'août') {
                    newVal[0] = '02'
                  } else if (newVal[0] == 'sept') {
                    newVal[0] = '03'
                  } else if (newVal[0] == 'oct') {
                    newVal[0] = '04'
                  } else if (newVal[0] == 'nov') {
                    newVal[0] = '05'
                  } else if (newVal[0] == 'déc') {
                    newVal[0] = '06'
                  } else if (newVal[0] == 'janv') {
                    newVal[0] = '07'
                  } else if (newVal[0] == 'févr') {
                    newVal[0] = '08'
                  } else if (newVal[0] == 'mars') {
                    newVal[0] = '09'
                  } else if (newVal[0] == 'avr') {
                    newVal[0] = '10'
                  } else if (newVal[0] == 'mai') {
                    newVal[0] = '11'
                  } else if (newVal[0] == 'juin') {
                    newVal[0] = '12'
                  }
                  newVal = newVal.join('')
                  return [key, newVal]
                }
            })
            )
          );



          resetButtons(e);


          if (e.target.getAttribute("data-dir") == "desc") {

            let sortedData = sortData(json, e.target.id, "desc");


            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
               
                    let  newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()
                    

                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );

            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "asc");
            var arrowId = `${e.target.id}_arrow`
            var arrowDown = document.getElementById(arrowId)
            arrowDown.className = "fa fa-caret-down"
            arrowDown.style["visibility"] = "visible"
           
          } else {

            let sortedData = sortData(json, e.target.id, "asc");

            sortedData = sortedData.map(
              obj => Object.fromEntries(
                Object.entries(obj)
                  .map(([key, val]) => {
                  if (key == "Saison" || key == "# de 15 cm +" || val == "NA") {
                    return [key, val]
                  } else {
                    
                   
                    let newVal = val.slice(0,2) + '-' + val.slice(2)
                    newVal = newVal.split('-').reverse()

                    
                    if (newVal[1] == '01') {
                      newVal[1] = 'juil'
                    } else if (newVal[1] == '02') {
                      newVal[1] = 'août'
                    } else if (newVal[1] == '03') {
                      newVal[1] = 'sept'
                    } else if (newVal[1] == '04') {
                      newVal[1] = 'oct'
                    } else if (newVal[1] == '05') {
                      newVal[1] = 'nov'
                    } else if (newVal[1] == '06') {
                      newVal[1] = 'déc'
                    } else if (newVal[1] == '07') {
                      newVal[1] = 'janv'
                    } else if (newVal[1] == '08') {
                      newVal[1] = 'févr'
                    } else if (newVal[1] == '09') {
                      newVal[1] = 'mars'
                    } else if (newVal[1] == '10') {
                      newVal[1] = 'avr'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'mai'
                    } else if (newVal[1] == '12') {
                      newVal[1] = 'juin'
                    }
                    newVal = newVal.join()
                    newVal = newVal.replace(',', '-')
                    return [key, newVal]
                  }
              })
              )
            );



            getTableContent(sortedData);

            e.target.setAttribute("data-dir", "desc");
            var arrowId = `${e.target.id}_arrow`
            var arrowUp = document.getElementById(arrowId)
            arrowUp.className = "fa fa-caret-up"
            arrowUp.style["visibility"] = "visible"

          }

          
        });
      });
});
});


selectAdvMonth.addEventListener('change', (event) => {

  let rgnContent = document.getElementById('rgnpopup-content')
  let newRgnName = document.getElementById("selectSt").value
  let monthChosen = selectAdvMonth.value
  monthChosen = Number(monthChosen)

  console.log('monthChosen')
  console.log(monthChosen)



  let newAdvCanvas = makeAdvCanvas(rgnContent)
  getWarningStat(newRgnName, monthChosen, newAdvCanvas.id)

  
})

goBtnX.addEventListener('click', (event) => {



  stationsclkdPopupContainer.style['cursor'] = 'progress'

  /*
  var canvas = document.getElementById('analyseCanvas')
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  */


  



    let newCanvas = makeCanvas(stationsclkdContent)

  

    var stValue = document.getElementById("selectSt").value


    var newClimateID = []
    var firstYear = []
    var lastYear = []
  
    for (let i = 0; i < stationVariables.length; i++) {
      if (stValue == stationVariables[i][0]) {
        newClimateID = stationVariables[i][2]
        firstYear = stationVariables[i][6]
        lastYear = stationVariables[i][7]
      }
    }





    var variableSCD = document.getElementById("variableSelector").value
    var yearSCD = document.getElementById("yearSelectorX").value
    var monthSCD = document.getElementById("monthSelectorX").value
    var daySCD = document.getElementById("daySelectorX").value




  
  
    var dayVariable = 'LOCAL_DAY'
    var monthVariable = 'LOCAL_MONTH'
    var yearVariable = 'LOCAL_YEAR'

  
    var period = [yearSCD,monthSCD,daySCD]



  
    var yearPromise = retrieveData(newClimateID, yearVariable, firstYear, lastYear)
    var monthPromise = retrieveData(newClimateID, monthVariable, firstYear, lastYear)
    var dayPromise = retrieveData(newClimateID, dayVariable, firstYear, lastYear)
    var variablePromise = retrieveData(newClimateID, variableSCD, firstYear, lastYear)
    


  
  
  
  
    Promise.all([yearPromise, monthPromise, dayPromise, variablePromise])
    .then(values => {
      let values0 = values[0]
      let values1 = values[1]
      let values2 = values[2]
      let values3 = values[3]
      

    //// attention regarder CYKL en juillet 2017, les données manquantes ne s'affichent pas comme NULL dans le dataArray et il y a donc un mauvais nombre de jours
  
      var dataArray = selectFullPeriod(values0, values1, values2, values3, period)

      makeGraphic(dataArray, newCanvas.id, variableSCD)

      stationsclkdPopupContainer.style['cursor'] = 'default'

    });


//    if (variableBtn.style["visibility"] == "hidden") {
  
//   var stValue = document.getElementById("selectSt").value
//   var variableSCD = document.getElementById("variableAdvSelector").value
//   getWarningStat(stValue, variableSCD);
//   }


});


/*
document.getElementById('lowestWave').addEventListener("click", (event) => { 


  let highestTide = variableIndividualData[maritimeId][0]
  let values = variableIndividualData[maritimeId][1]
  let eventDate = variableIndividualData[maritimeId][2]


  let wavesHeight = values.map(str => {
    return Number(str[0]);
});
for (i in wavesHeight) {
  if (wavesHeight[i] == 9999) {
    wavesHeight[i] = "NaN"
  }
}


let latlng = values.map(str => {
  return str[1];
});



let lngForLayer = latlng.map(str => {
return str[0];
});

let latForLayer = latlng.map(str => {
return str[1];
});


  function myArrayMax(x) {
    return Math.max(...x.filter(x => typeof x === 'number')); //result is 4
  }
 
  function myArrayMin(x) {
    return Math.min(...x.filter(x => typeof x === 'number')); //result is 4
  }

  let highestWave = myArrayMax(wavesHeight)
  let lowestWave = myArrayMin(wavesHeight)

})
*/



let verifFile = './data/verif/JSON/CWUL.json' 
let verifVariable = 'Crit�re atteint'





function critereAtteint () {
  let verifArray = getVerif(verifFile, verifVariable);
}

let verifArray = getVerif(verifFile, verifVariable);

});
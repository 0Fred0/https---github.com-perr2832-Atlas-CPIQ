console.log("VS_test")

//import {test} from "./stats.js";
import { retrieveData, windGraphic, selectPeriod, yearSelection } from "./stats.js";

let map, infoWindow;
initMap();

// Initialize Google Map.
function initMap() {
    // Map settings.
    let mapProp = {
        zoom: 7,
        center: { lat: 48, lng: -71 },
        mapTypeId: "terrain",
        disableDefaultUI: true,
        styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#000000"
                },
                {
                  "visibility": "on"
                },
                {
                  "weight": 2.5
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#ffeb3b"
                },
                {
                  "weight": 4.5
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#000000"
                },
                {
                  "visibility": "on"
                },
                {
                  "weight": 2
                }
              ]
            },
            {
              "featureType": "administrative.neighborhood",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.province",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#ffeb3b"
                }
              ]
            },
            {
              "featureType": "administrative.province",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#000000"
                },
                {
                  "weight": 2
                }
              ]
            },
            {
              "featureType": "administrative.province",
              "elementType": "labels.text",
              "stylers": [
                {
                  "visibility": "on"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#c8dfc9"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dadada"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#967c73"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#989290"
                },
                {
                  "visibility": "on"
                },
                {
                  "weight": 0.5
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#967c73"
                },
                {
                  "weight": 1
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#c9c9c9"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#afb1cf"
                },
                {
                  "visibility": "on"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            }
          ]
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);
    infoWindow = new google.maps.InfoWindow();
   
    // Load GeoJson data.
    let regionLayer = new google.maps.Data({ map: map });
    //regionLayer.loadGeoJson("data/QC_nord_A.json");
    //regionLayer.loadGeoJson("data/QC_nord_B.json");
    //regionLayer.loadGeoJson("data/QC_est.json");
    //regionLayer.loadGeoJson("data/QC_ouest.json");

    let regionLayer2 = new google.maps.Data({ map: map });
    regionLayer2.loadGeoJson("data/public_zones.json");

    let markerLayer = new google.maps.Data({ map: map });
    markerLayer.loadGeoJson("data/stations.json");

    const elevator = new google.maps.ElevationService();

    // Style GeoJson data.

    // Set style for colored municipality polygons and points.
    regionLayer.setStyle(function(feature) {
        let munName = feature.getProperty('munName')
        let munType = feature.getProperty('munType')
        let pop     = feature.getProperty('pop')

        let scale, fillColor, fillOpacity, strokeWeight, symbol
        if (munType == "G" || munType == "GR" || munType == "NO" || munType == "VC" || munType == "TK" || munType == "TI") {
            fillOpacity = 0.33,
            strokeWeight = 0.5
        } else {
            fillOpacity = 0.67,
            strokeWeight = 1
        }
        if (pop >= 1000000) {
            scale = 8,
            fillColor = "#800000"
        } else if (pop >= 500000) {
            scale = 7.5,
            fillColor = "#921f00"
        } else if (pop >= 200000) {
            scale = 7,
            fillColor = "#a33500"
        } else if (pop >= 100000) {
            scale = 6.5,
            fillColor = "#b44a00"
        } else if (pop >= 50000) {
            scale = 6,
            fillColor = "#c35f00"
        } else if (pop >= 20000) {
            scale = 5.5,
            fillColor = "#d07500"
        } else if (pop >= 10000) {
            scale = 5,
            fillColor = "#dc8b00"
        } else if (pop >= 5000) {
            scale = 4.5,
            fillColor = "#e7a100"
        } else if (pop >= 2000) {
            scale = 4,
            fillColor = "#f0b800"
        } else if (pop >= 1000) {
            scale = 3.5,
            fillColor = "#f7cf00"
        } else if (pop >= 500) {
            scale = 3,
            fillColor = "#fce700"
        } else if (pop >= 200) {
            scale = 2.5,
            fillColor = "#ffff00"
        } else {
            scale = 0,
            fillColor = "yellow"
        }
        symbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            strokeColor: "black",
            strokeWeight: 1,
            fillColor: fillColor,
            fillOpacity: 1
        }
        return {
            fillColor: fillColor,
            fillOpacity: 0,
            strokeColor: fillColor,
            strokeOpacity: 0,
            strokeWeight: 1,
            icon: symbol,
            title: munName
        }  
    });

    // Set style for ECCC regions.
    regionLayer2.setStyle(function(feature) {
        return {
            fillColor: "white",
            fillOpacity: 0,
            strokeColor: "black",
            strokeOpacity: 1,
            strokeWeight: 2
        }
    })


    

    markerLayer.setStyle(function(feature) {
        let stName     = feature.getProperty('name')
        let stProvider = feature.getProperty('provider')
        let stActive   = feature.getProperty('active')
        let scale, fillColor, symbol
        if (stActive == 0) {
            scale = 1,
            fillColor = "red"
        } else {
            scale = 3
            if (stProvider == "SMC / MSC") {
                fillColor = "brown"
            } else if (stProvider == "MDN / DND") {
                fillColor = "red"
            } else if (stProvider == "NAV Canada") {
                fillColor = "yellow"
            } else if (stProvider == "MELCC") {
                fillColor = "blue"
            } else if (stProvider == "ALCAN") {
                fillColor = "orange"
            } else if (stProvider == "DCF") {
                fillColor = "green"
            } else if (stProvider == "HYDRO") {
                fillColor = "purple"
            } else if (stProvider == "SOPFEU") {
                fillColor = "cyan"
            } else if (stProvider == "FADQ") {
                fillColor = "beige"
            }
        } 
        symbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            strokeColor: "black",
            strokeWeight: 1,
            fillColor: fillColor,
            fillOpacity: 1
        }
        return {
            icon: symbol,
            title: stName
        }
    })

    // Get marker info upon click to display in left menu
    regionLayer.addListener("click", (event) => {
        let munName = event.feature.getProperty("munName");
        let countyId = event.feature.getProperty("countyId");

        // Clear previous info in bar
        var div = document.getElementById("info");
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        // Insert new info in bar
        var newNode = document.createElement("div");
        newNode.innerHTML = "<strong><big>" + munName + " | " + countyId
        info.appendChild(newNode);
    }); 

    var arrowRight = document.getElementById("arrowRight");
    var arrowLeft = document.getElementById("arrowLeft");
    var toggles = document.getElementById("toggles");
    var myMap = document.getElementById("map");
    

    arrowRight.addEventListener("click", () => {
      console.log("HIIIII")
      //toggles.style.resize = 'horizontal'
      myMap.style.height = '30%';
      toggles.style.width = '700%';
      arrowRight.style.visibility = "hidden";
      arrowLeft.style.visibility = "visible";
      
    });

    arrowLeft.addEventListener("click", () => {
      myMap.style.height = '100%';
      toggles.style.width = '100%';
      arrowRight.style.visibility = 'visible';
      arrowLeft.style.visibility = 'hidden';
    });
    

    markerLayer.addListener("click", (event) => {
    // Get Geojson info to display.
    let stationName = event.feature.getProperty("name");
    let stationCode = event.feature.getProperty("code");
    let stationClss = event.feature.getProperty("class");
    let stationPvdr = event.feature.getProperty("provider");
    let stationActv = event.feature.getProperty("active");
    console.log('test');
    let stationLat = event.latLng.lat();
    let stationLng = event.latLng.lng();

    // Retrieve elevation according to LatLon (see function description below);
   // let stationEleve = displayLocationElevation(event.latLng, elevator);
  

    // Check manual or auto status of stations.
    //let manString = "";
    //let autoString = "";
    //let autoMinString = "";
    //if (event.feature.getProperty("dd_man") == 1) {
    //  manString =
    //    '<br><a href="https://dd.weather.gc.ca/observations/swob-ml/latest/' +
    ///     stationCode +
    //    '-MAN-swob.xml" target="_blank">Latest manual obs. (datamart)</a>';
    // }
    // if (event.feature.getProperty("dd_auto") == 1) {
    //   autoString =
    //     '<br><a href="https://dd.weather.gc.ca/observations/swob-ml/latest/' +
    //     stationCode +
    //     '-AUTO-swob.xml" target="_blank">Latest auto. obs. (datamart)</a>';
    //  }
    // if (event.feature.getProperty("dd_auto_min") == 1) {
    //   autoMinString =
    //     '<br><a href="https://dd.weather.gc.ca/observations/swob-ml/latest/' +
    //    stationCode +
    //     '-AUTO-minute-swob.xml" target="_blank">Latest minute auto. obs. (datamart)</a>';
    //  }

    var variableSelect = document.getElementById("selector");
    variableSelect.style.visibility = "visible";
    variableSelect.addEventListener('change', () => {
      if (variableSelect.value == "temperature") {
        console.log("SELECT TEST");
        
      };
    });
    

    

    // Clear previous info in bar
    var div = document.getElementById("info");
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    // Insert new info in bar
    var newNode = document.createElement("div");
    newNode.innerHTML =
      //    "<big><strong>" +
      //    stationCode +
      "<strong><big>" +
      stationCode.TC +
      " | " +
      "</big></strong><br>" +
          "Latitude: " +
          stationLat +
          "&deg;<br>" +
          "Longitude: " +
          stationLng +
          "&deg;<br>" +
          "Altitude: " +
        //  stationElev +
          " m<br><br>" +
      "R&eacute;seau: " +
      stationPvdr;
    //    "<br>" +
    //    "D&eacute;but des obs.: " +
    //    stationStart +
    //    "<br>" +
    //    "Fin des obs.: " +
    //    stationEnd +
    //    "<br>" +
    //    manString +
    ///    autoString +
    //    autoMinString +
    //   '<br><a href="https://weather.gc.ca/past_conditions/index_f.html?station=' +
    //    station24 +
    //    '" target="_blank">Past hourly obs (wx office)</a>';
    div.appendChild(newNode);
    
    
    //test(3)

    
    
    var div2 = document.getElementById("graphics");
   // while (div2.firstChild) {
   //   div2.removeChild(div2.firstChild);
   // }

    // Insert new info in bar
    var windChart = document.createElement("div");
    windChart.id = "windChartID";
    windChart.style.height = "400px";
    div2.appendChild(windChart);
    
    //windChart.style.top = "60px";
    
  

    let monthVariable = 'Month'
    let windSpeedVariable = 'Spd of Max Gust (km/h)';
    let windDirectionVariable = 'Dir of Max Gust (10s deg)';
    let monthOrPeriod = 'year'
    let temperatureVariable = 'Mean Temp (�C)'
    
    
  

    let promise = retrieveData(stationCode.TC, windDirectionVariable)
    let promise2 = retrieveData(stationCode.TC, windSpeedVariable)
    let promise3 = retrieveData(stationCode.TC, monthVariable)
    let promise4 = retrieveData(stationCode.TC, temperatureVariable)


    function makeWindGraph (monthOrPeriod) {
      Promise.all([promise, promise2, promise3])
      .then(values => {
        let values0 = values[0]
        let values1 = values[1]
        let values2 = values[2]


        let windDirectionPeriod = selectPeriod(values0, values2, monthOrPeriod)
        let windSpeedPeriod = selectPeriod(values1, values2, monthOrPeriod)

        let mergedWind = [windDirectionPeriod, windSpeedPeriod];
        
        return mergedWind
      
      })
      .then(result => {
        windGraphic(result[0],result[1])
      });
  }

  makeWindGraph (monthOrPeriod);
  
    

    var button1 = document.createElement("button");
    button1.id = "periodSelect"
    button1.innerHTML = "Sélectionner une période";
 
    div2.appendChild(button1);
    console.log(typeof button1)
    console.log(button1)
    button1.addEventListener('click', () => {
      //div2.innerHTML = "";
      var windJanuary = document.createElement("button");
      var windFebruary = document.createElement("button");
      var windMarch = document.createElement("button");
      var windApril = document.createElement("button");
      var windMay = document.createElement("button");
      var windJune = document.createElement("button");
      var windJuly = document.createElement("button");
      var windAugust = document.createElement("button");
      var windSeptember = document.createElement("button");
      var windOctober = document.createElement("button");
      var windNovember = document.createElement("button");
      var windDecember = document.createElement("button");
      var backButton = document.createElement("button");

      windJanuary.innerHTML = "Janvier"
      windFebruary.innerHTML = "Fevrier"
      windMarch.innerHTML = "Mars"
      windApril.innerHTML = "Avril"
      windMay.innerHTML = "Mai"
      windJune.innerHTML = "Juin"
      windJuly.innerHTML = "Juillet"
      windAugust.innerHTML = "Aout"
      windSeptember.innerHTML = "Septembre"
      windOctober.innerHTML = "Octobre"
      windNovember.innerHTML = "Novembre"
      windDecember.innerHTML = "Décembre"
      backButton.innerHTML = "retour"


      div2.appendChild(windJanuary);
      div2.appendChild(windFebruary);
      div2.appendChild(windMarch);
      div2.appendChild(windApril);
      div2.appendChild(windMay);
      div2.appendChild(windJune);
      div2.appendChild(windJuly);
      div2.appendChild(windAugust);
      div2.appendChild(windSeptember);
      div2.appendChild(windOctober);
      div2.appendChild(windNovember);
      div2.appendChild(windDecember);
      div2.appendChild(backButton);



      windJanuary.id = '1';
      windFebruary.id = '2';
      windMarch.id = '3';
      windApril.id = '4';
      windMay.id = '5';
      windJune.id = '6';
      windJuly.id = '7';
      windAugust.id = '8';
      windSeptember.id = '9';
      windOctober.id = '10';
      windNovember.id = '11';
      windDecember.id = '12';
      backButton.id = 'Back';

      windJanuary.className = 'periodButton';
      windFebruary.className = 'periodButton';
      windMarch.className = 'periodButton';
      windApril.className = 'periodButton';
      windMay.className = 'periodButton';
      windJune.className = 'periodButton';
      windJuly.className = 'periodButton';
      windAugust.className = 'periodButton';
      windSeptember.className = 'periodButton';
      windOctober.className = 'periodButton';
      windNovember.className = 'periodButton';
      windDecember.className = 'periodButton';

      console.log("windFebruary")
      console.log(windFebruary)

      
      
      

      const allPeriodButton = document.querySelectorAll('.periodButton');
      
      allPeriodButton.forEach(element => {
        
        
        element.addEventListener('click', (event) => {
          monthOrPeriod = (event.srcElement.id);
          element.classList.add('active');
          
          
          makeWindGraph (monthOrPeriod);
          div2.appendChild(windChart);
        })
      });

    

      backButton.addEventListener('click', () => {
        windJanuary.style.visibility = "hidden"
        windFebruary.style.visibility = "hidden"
        windMarch.style.visibility = "hidden"
        windApril.style.visibility = "hidden"
        windMay.style.visibility = "hidden"
        windJune.style.visibility = "hidden"
        windJuly.style.visibility = "hidden"
        windAugust.style.visibility = "hidden"
        windSeptember.style.visibility = "hidden"
        windOctober.style.visibility = "hidden"
        windNovember.style.visibility = "hidden"
        windDecember.style.visibility = "hidden"
        backButton.style.visibility = "hidden";
      
        button1.style.visibility = "visible";
      })
    });



    document.getElementById("windChartID").innerHTML = "La rose des vents est actuellement disponible pour YUL uniquement"

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


google.maps.event.addEventListener(window, "load", initMap);
}





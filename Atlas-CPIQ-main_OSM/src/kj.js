/*

  let source = regionLayer.getSource()

    let polyIdSelected = feat.values_.POLY_ID
    
    source.forEachFeature( function (feature) {
      let polyIds = feature.values_.POLY_ID
      if (polyIdSelected == polyIds) {
    
        //regionLayer.setStyle({
          //'stroke-color' : 'red'
       // })
       feature.disposed = true
      } else {
        feature.disposed = false
      }


       regionLayer.setStyle(function(feature, resolution){

        console.log(feature.disposed)
    
    
    
        let unselected = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0)'
          }), 
          stroke: new ol.style.Stroke({
            color: 'black'
          })
        })
    
    
        let selected = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.4)'
          }), 
          stroke: new ol.style.Stroke({
            color: 'black',
       //     width: 5
          })
        })
    
    
        if (feature.disposed == true) {
          return [selected]
        } else {
          return [unselected]
        }

        
      })
    })
*/
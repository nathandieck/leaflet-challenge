
var mymap = L.map('map', {
    center: [39.8283, -98.5795],
    zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(mymap);


var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {
    createFeatures(data.features);
});

function createFeatures(shakeshakeshake) {

    function onEachFeature(feature, layer) {
        layer.bindPopup ("<h2>Magnitude: " + feature.properties.mag + "<hr>" +
        "<br><p>Location: " + feature.properties.place + 
        "<br>Date: " + feature.properties.time + "</p>");
    }



    var quake = L.geoJSON(shakeshakeshake, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var fill;
            var shading;
            var shading = Math.floor(255 - (feature.properties.mag * 30));
            fill = "rgb(" + shading + ", " + shading + ", " + shading + ")";

            var circles = {
                radius: (10*(feature.properties.mag/Math.log(10))),
                fillColor: fill,
                color: "black",
                weight: 1,
                fillOpacity: 0.75
            };

            return L.circleMarker(latlng, circles);
        }
    }).addTo(mymap);
    
}

//https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map

function getColor(d) {
    return  d < 0 ? 'rgb(255,255,255)' :
            d < 1 ? 'rgb(225,225,225)' :
            d < 3 ? 'rgb(165,165,165)' :
            d < 5 ? 'rgb(105,105,105)' : 
                    'rgb(80,80,80)';
}


var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1,3,5],
        labels = [];
    
    div.innerHTML+='<h3>Magnitude of Earthquake</h3>'

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
};

legend.addTo(mymap);

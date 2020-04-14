var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
  
  var earthQuakes = data.features;
  
  var earthquakeMarkers = [];

  earthQuakes.forEach(function(d) {
    var location = [d.geometry.coordinates[1], d.geometry.coordinates[0]];
    var magnitude = d.properties.mag;
    var fColor;
    if (magnitude > 5.0){
        fColor = 'purple'
    } else if (magnitude < 5.0 && magnitude > 4.0){
        fColor = 'blue'
    } else if (magnitude < 4.0 && magnitude > 3.0){
        fColor = 'green'
    } else if (magnitude < 3.0 && magnitude > 2.0){
        fColor = 'yellow'
    } else if (magnitude < 2.0 && magnitude > 1.0){
        fColor = 'orange'
    } else {
        fColor = 'red'
    };
    var circle = L.circle(location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: fColor,
      radius: magnitude *20000
    }).bindPopup("<h3>" + d.properties.place + "</h3> <hr> <h4>" + new Date(d.properties.time) + "</h4><br><h4>Magnitude:" + d.properties.mag + "</h4>");
    earthquakeMarkers.push(circle)
  });
  console.log(earthquakeMarkers)
  
  var earthquakeLayer = L.layerGroup(earthquakeMarkers);

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY});

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY});

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY});

  var baseMaps = {
    'Streets': streetmap,
    'Satellite': satellitemap,
    'Grayscale': lightmap};

  var overlayMaps = {
    'Earthquakes': earthquakeLayer};

  var myMap = L.map('map', {
    center:  [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakeLayer]});

  L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

  // var legend = L.control({position: 'bottomright'});
  // legend.onAdd = function (map) {
  //   var div = L.DomUtil.create('div', 'info legend'),
  //   colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'],
  //   labels = ['> 5', '> 4', '> 3', '> 2', '> 1'];
  //   for (var i = 0; i < colors.length; i++) {
  //     div.innerHTML +=
  //       '<i style="background:' + (colors[i] + 1) + '"></i> ' +
  //       colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+')}
  //       return div};
  // legend.addTo(map);

  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var legend = L.control({position: 'bottomright'});
    var colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
    var labels = ['> 5', '> 4', '> 3', '> 2', '> 1', '< 1'];
    var html = [];
    for (i = j = 0; i < colors.length && j < labels.length; i++, j++){
      html.push(`<li style="background-color: ${colors[i]}"> ${ labels[j] } </li>`)
    }
    div.innerHTML += '<ul>' + html.join('') + '</ul>'
    return div
  }
  legend.addTo(myMap)
});
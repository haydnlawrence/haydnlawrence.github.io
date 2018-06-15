//**********************************************************************
// GLOBAL VARIABLES AND UTILITY FUNCTIONS
//**********************************************************************

// GLOBAL VARIABLES
var percent = 0;
var markerLayerPos = L.markerClusterGroup();
var markerLayerNeg = L.markerClusterGroup();
var markerLayerNeu = L.markerClusterGroup();
var counter_pos = 0, counter_neg = 0, counter_neu = 0;

// THESE FUNCTIONS WILL BE USED LATER TO ADD THE POPUP WINDOWS TO EACH POINT
function onEachFeaturePos(feature, layer) {
    layer.on({
        mouseover: openpopup,
        mouseout: closepopup
    });
    counter_pos++;
}

function onEachFeatureNeg(feature, layer) {
    layer.on({
        mouseover: openpopup,
        mouseout: closepopup
    });
    counter_neg++;
}

function onEachFeatureNeu(feature, layer) {
    layer.on({
        mouseover: openpopup,
        mouseout: closepopup
    });
    counter_neu++;
}

function openpopup(e) {
    var layer = e.target; 
    layer.bindPopup( "Sentiment: " + layer.feature.properties.sentiment.charAt(0).toUpperCase() + layer.feature.properties.sentiment.slice(1) + 
                    "<br />Key words: " + layer.feature.properties.keywords + 
                    "<br />Article Title: " + layer.feature.properties.article_title +  
                    "<br />Newspaper Title: " + layer.feature.properties.news_title +
                    "<br />Location: " + layer.feature.properties.location + 
                    "<br />Sex/Crime/Poverty: " + layer.feature.properties.sex + '/' + layer.feature.properties.crime + '/' + layer.feature.properties.poverty
                    ).openPopup();
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function closepopup(e) {
    map.closePopup();
}

function addMarkers(startDate, endDate){

    // REMOVE THE LAYERS FROM THE LEGEND AND MAP AS WE WILL BE FILTERING BY THE NEW DATES AND MAKING NEW ONES
    layerControl.removeLayer(markerLayerPos);
    layerControl.removeLayer(markerLayerNeg);
    layerControl.removeLayer(markerLayerNeu);
    map.removeLayer(markerLayerPos);
    map.removeLayer(markerLayerNeg);
    map.removeLayer(markerLayerNeu);
    counter_neg = 0;
    counter_pos = 0;
    counter_neu = 0;

    // CREATE THE POINT LAYERS BASED ON THE NEW SLIDER (I.E. DATE) VALUE
    var geoJsonLayerPos = L.geoJson(points, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85, color:'#00FF00'});
        },
        onEachFeature: onEachFeaturePos,
        filter: function(feature, layer){
            if(feature.properties.sentiment == "positive" & (new Date(feature.properties.date).getTime()) / 1000 <= endDate & (new Date(feature.properties.date).getTime() / 1000) >= startDate) return true;
        }
    });
    var geoJsonLayerNeg = L.geoJson(points, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85, color:'#FF0000'});
        },
        onEachFeature: onEachFeatureNeg,
        filter: function(feature, layer){
            if(feature.properties.sentiment == "negative" & (new Date(feature.properties.date).getTime()) / 1000 <= endDate & (new Date(feature.properties.date).getTime() / 1000) >= startDate) return true;
        }
    });
    var geoJsonLayerNeu = L.geoJson(points, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85, color:'#B0B0B0'});
        },
        onEachFeature: onEachFeatureNeu,
        filter: function(feature, layer){
            if(feature.properties.sentiment == "neutral" & (new Date(feature.properties.date).getTime()) / 1000 <= endDate & (new Date(feature.properties.date).getTime() / 1000) >= startDate) return true;
        }
    });

    // ADD THE NEW MARKERS TO THE CLUSTER GROUPS
    markerLayerPos = L.markerClusterGroup({
        polygonOptions: {
            fillColor: '#000000', weight: 0.5, opacity: 1, fillOpacity: 0.5
        },
        maxClusterRadius: 80,
        spiderfyDistanceMultiplier: 2,
        iconCreateFunction: function(cluster) {
            return L.divIcon({html: '<div style="background-color:#00FF00;color:#000"><span style="background-color:#00FF00">' + cluster.getChildCount() + '</span></div>', className: 'marker-cluster marker-cluster-small', iconSize: new L.Point(40, 40)});
        }
    });   
    markerLayerNeg = L.markerClusterGroup({
        polygonOptions: {
            fillColor: '#000000', weight: 0.5, opacity: 1, fillOpacity: 0.5
        },
        maxClusterRadius: 80,
        spiderfyDistanceMultiplier: 2,
        iconCreateFunction: function(cluster) {
            return L.divIcon({html: '<div style="background-color:#FF0000;color:#000"><span style="background-color:#FF0000">' + cluster.getChildCount() + '</span></div>', className: 'marker-cluster marker-cluster-small', iconSize: new L.Point(40, 40)});
        }
    });   
    markerLayerNeu = L.markerClusterGroup({
        polygonOptions: {
            fillColor: '#000000', weight: 0.5, opacity: 1, fillOpacity: 0.5
        },
        maxClusterRadius: 80,
        spiderfyDistanceMultiplier: 2,
        iconCreateFunction: function(cluster) {
            return L.divIcon({html: '<div style="background-color:#B0B0B0;color:#000"><span style="background-color:#B0B0B0">' + cluster.getChildCount() + '</span></div>', className: 'marker-cluster marker-cluster-small', iconSize: new L.Point(40, 40)});
        }
    });   

    markerLayerPos.addLayer(geoJsonLayerPos);
    markerLayerNeg.addLayer(geoJsonLayerNeg);
    markerLayerNeu.addLayer(geoJsonLayerNeu);
    map.addLayer(markerLayerPos);
    map.addLayer(markerLayerNeg);
    map.addLayer(markerLayerNeu);
    layerControl.addOverlay(markerLayerPos, "Positive stories", {groupName : "Data"} );
    layerControl.addOverlay(markerLayerNeg, "Negative stories", {groupName : "Data"} );
    layerControl.addOverlay(markerLayerNeu, "Neutral stories", {groupName : "Data"} );

    console.log("POS: " + counter_pos + "-NEG: " + counter_neg + "-NEU: " + counter_neu + "-TOTAL: " + (counter_pos + counter_neg + counter_neu));

}

//**********************************************************************
// MAP SETUP
//**********************************************************************

// ADD A BASELAYER
var baseLayerLight = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
});
var baseLayerDark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
});

// CREATE THE IMAGE OF WHITECHAPEL ON THE MAP
var imageUrl = 'images/map_background_final.jpg';
var imageBounds = [[51.510850,-0.077600],[51.522525,-0.049625]];
var imageLayer = L.imageOverlay(imageUrl, imageBounds, {opacity: 1})

// ADD THE UTILITY SHAPEFILES TO THE MAP, THOUGH DON'T SHOW THEM AT FIRST
var roadLayer = new L.Shapefile('assets/shapefiles/roads.zip', {
    onEachFeature:function(feature, layer) { 
        layer.bindPopup("Road name: " + feature.properties.roads); 
    }
});
var buildingLayer = new L.Shapefile('assets/shapefiles/buildings.zip',{
    onEachFeature:function(feature, layer) { 
        layer.bindPopup("Building name: " + feature.properties.buildings); 
    }
});
var overpassLayer = new L.Shapefile('assets/shapefiles/overpass.zip',{});

// SET UP THE MAP
var map = new L.map('map', {
    center: new L.LatLng(51.5166875,-0.0636125),
    zoom: 15,
    zoomControl: false,
    layers: [baseLayerDark, imageLayer],
    fullscreenControl: false,
});

// SET UP THE LEGEND LAYERS CONTROL
var baseMaps = [
    {
        groupName: "Base Layers",
        expanded: true,
        layers: {
            "Dark Base Map": baseLayerDark,
            "Light Base Map": baseLayerLight,
        }
    }
];
var overlayMaps = [
    {
        groupName: "Data",
        expanded: true,
        layers: {
            "Whitechapel Map 1800s": imageLayer,
        }
    },{
        groupName: "Utility Shapefiles",
        expanded: false,
        layers: {
            "Roads": roadLayer,
            "Buildings": buildingLayer,
            "Overpasses": overpassLayer,
        }
    }
];
var layerControl = new L.Control.styledLayerControl(baseMaps, overlayMaps, {collapsed:false});
map.addControl(layerControl);

L.control.zoom({
    position:'bottomleft'
}).addTo(map);

//**********************************************************************
// SLIDER FUNCTIONALITY
//**********************************************************************

// GET AND SORT ALL THE DATES IN THE GEOJSON TO FIND THE FIRST AND LAST DATES FOR BOUNDARIES ON THE SLIDER
var dateArr = points.map(function(feature) {
  return new Date(feature.properties.date);
});
dateArr.sort(function(a, b) {
  return a.getTime() - b.getTime();
});
var latestDate = dateArr[dateArr.length - 1];
var earliestDate = dateArr[0];

var earliestDateStart = (earliestDate.getTime() / 1000);
var latestDateStart = (latestDate.getTime() / 1000);

var total = 0, pos = 0, neg = 0;

//INITIALIZE MAP WITH POINT STORIES FOR THE FIRST YEAR NOW THAT WE HAVE THE FIRST AND LAST DATES
addMarkers(earliestDateStart, latestDateStart)

$(function() {
    $( "#slider-range" ).slider({
        range: true,
        min: earliestDate.getTime() / 1000,
        max: latestDate.getTime() / 1000,
        step: 2629746,
        values: [earliestDateStart, latestDateStart],
        slide: function( event, ui ) {
            startDate = ui.values[0];
            endDate = ui.values[1];
            addMarkers(startDate, endDate)
            
            $( "#amount" ).val( moment(new Date(ui.values[ 0 ] *1000).toDateString()).format("MMM YYYY") 
                + " - " + moment(new Date(ui.values[ 1 ] *1000).toDateString()).format("MMM YYYY"));
            total = counter_neu + counter_neg + counter_pos;
            neg = counter_neg / total;
            pos = counter_pos / total;
            $("#sentiment_pos").val(
                (pos * 100).toFixed(0) + "% positive stories."
            );
            $("#sentiment_neg").val(
                (neg * 100).toFixed(0) + "% negative stories."
            );
        }    
    });

    // THIS IS JUST FOR INITIALIZATION BEFORE THE SLIDER IS USED
    $( "#amount" ).val( moment(new Date($( "#slider-range" ).slider( "values", 0 )*1000).toDateString()).format("MMM YYYY") +
      " - " + moment(new Date($( "#slider-range" ).slider( "values", 1 )*1000).toDateString()).format("MMM YYYY"));
    total = counter_neu + counter_neg + counter_pos;
    neg = counter_neg / total;
    pos = counter_pos / total;
    $("#sentiment_pos").val(
        (pos * 100).toFixed(0) + "% positive stories."
    );
    $("#sentiment_neg").val(
        (neg * 100).toFixed(0) + "% negative stories."
    );
});


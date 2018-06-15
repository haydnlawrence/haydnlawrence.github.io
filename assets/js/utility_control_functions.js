//**********************************************************************
// Control functions
//**********************************************************************
var sentiment_positive = "";
var sentiment_negative = "";
var sentiment_neutral = "";
var type_crime = "";
var type_sex = "";
var type_poverty = "";
var points_all = "";
var selectedTime = "";

// function initializeMap(){
//     points_all = L.geoJson(points, {
//         style: function(feature) {
//             return {color: "#000000"};
//         },
//         onEachFeature: onEachFeature,
//         pointToLayer: function (feature, latlng) {
//             return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
//         },
//     });
//     points_all.addTo(map);    
// }




// function shadeColor1(color, percent) {   
//     var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
//     return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
// }

// function blendColors(c0, c1, p) {
//     var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
//     return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
// }

function clear_map(){
    map.removeLayer(sentiment_positive);
    map.removeLayer(sentiment_negative);
    map.removeLayer(sentiment_neutral);
    map.removeLayer(type_crime);
    map.removeLayer(type_sex);
    map.removeLayer(type_poverty);
    map.removeLayer(points_all);
    clear_checkboxes_sentiment();
    clear_checkboxes_type();

}

function clear_checkboxes_sentiment(){
    document.getElementById('chk_sentiment_positive').checked = false;
    document.getElementById('chk_sentiment_negative').checked = false;
    document.getElementById('chk_sentiment_neutral').checked = false;
}    

function clear_checkboxes_type(){
    document.getElementById('chk_type_sex').checked = false;
    document.getElementById('chk_type_poverty').checked = false;
    document.getElementById('chk_type_crime').checked = false;
}

function show_points(){
    clear_map();
    current_radio_button = $('input[name="map_controls"]:checked').val();
    if(current_radio_button == 'sentiment') change_sentiment();
    else if(current_radio_button == 'type') change_type();
    else if(current_radio_button == 'all') change_all_points();
}

// THIS FUNCTION WILL BE USED LATER TO ADD THE POPUP WINDOWS TO EACH POINT
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: openpopup,
        mouseout: closepopup
    });
}

function openpopup(e) {
    var layer = e.target; 
    layer.bindPopup( "Sentiment: " + layer.feature.properties.sentiment.charAt(0).toUpperCase() + layer.feature.properties.sentiment.slice(1) + 
                    "<br />Key words: " + layer.feature.properties.keywords + 
                    "<br />Article Title: " + layer.feature.properties.article_title +  
                    "<br />Newspaper Title: " + layer.feature.properties.news_title +
                    "<br />Location: " + layer.feature.properties.location + 
                    "<br />Sex/Crime/Poverty: " + layer.feature.properties.sex + '/' + layer.feature.properties.crime + '/' + layer.feature.properties.poverty +
                    "<br />Count: " + layer.feature.properties.count
                    ).openPopup();
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function closepopup(e) {
    map.closePopup();
    //DOES NOTHING RIGHT NOW
}

function change_all_points(){
    clear_checkboxes_sentiment();
    clear_checkboxes_type();

    //map.removeControl(this.timeDimensionControl);

    if(document.getElementById('chk_show_points').checked){
        // time = geoJsonTimeLayer.getTime().substr(0,7);

        pointsFilter = points;

        points_all = L.geoJson(points, {
            style: function(feature) {
                return {color: "#000000"};
            },
            onEachFeature: onEachFeature,
            // THIS ADDS THE POINTS TO THE MAP
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
            },
            //filter: function(feature, layer) {
                //return feature.properties.date.substr(0,7) == time;
            //}
        });
        points_all.addTo(map);
    }
}

function change_sentiment(){
    clear_checkboxes_type();
    // time = geoJsonTimeLayer.getTime().substr(0,7);

    if(document.getElementById('chk_sentiment_positive').checked && document.getElementById('chk_show_points').checked){

        pointsFilter = points.filter(function(feature){
            return (feature.properties.sentiment) == "positive";
        });

        sentiment_positive = L.geoJson(points, {
            style: function(feature) {
                return {color: "#00ff00"};
            },
            onEachFeature: onEachFeature,
            // THIS ADDS THE POINTS TO THE MAP
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
            },
            filter: function(feature, layer) {
                return feature.properties.sentiment == "positive";
            }
        });
        sentiment_positive.addTo(map);
    }

    if(document.getElementById('chk_sentiment_negative').checked && document.getElementById('chk_show_points').checked){

        pointsFilter = points.filter(function(feature){
            return (feature.properties.sentiment) == "negative";
        });

        sentiment_negative = L.geoJson(points, {
            style: function(feature) {
                return {color: "#ff0000"};
            },
            onEachFeature: onEachFeature,
            // THIS ADDS THE POINTS TO THE MAP
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
            },
            filter: function(feature, layer) {
                return feature.properties.sentiment == "negative";
            }
        });
        sentiment_negative.addTo(map);
    };

    if(document.getElementById('chk_sentiment_neutral').checked && document.getElementById('chk_show_points').checked){
        
        pointsFilter = points.filter(function(feature){
            return (feature.properties.sentiment) == "neutral";
        });

        sentiment_neutral = L.geoJson(points, {
            style: function(feature) {
                return {color: "#0000ff"};
            },
            onEachFeature: onEachFeature,
            // THIS ADDS THE POINTS TO THE MAP
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
            },
            filter: function(feature, layer) {
                return feature.properties.sentiment == "neutral";
            }
        });
        sentiment_neutral.addTo(map);
    };            
}

function change_type(){
    clear_checkboxes_sentiment();
    // time = geoJsonTimeLayer.getTime().substr(0,7);

    if(document.getElementById('chk_type_sex').checked && document.getElementById('chk_show_points').checked){

        pointsFilter = points.filter(function(feature){
            return feature.properties.sex == "yes";
        });

        type_sex = L.geoJson(points, {
            style: function(feature) {
                return {color: "#0000ff"};
            },
            onEachFeature: onEachFeature,
            // THIS ADDS THE POINTS TO THE MAP
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
            },
            filter: function(feature, layer) {
                return feature.properties.sex == "yes";
            }
        });
        type_sex.addTo(map);
    };    

    if(document.getElementById('chk_type_poverty').checked && document.getElementById('chk_show_points').checked){

        pointsFilter = points.filter(function(feature){
            return feature.properties.poverty == "yes";
        });

        type_poverty = L.geoJson(points, {
            style: function(feature) {
                return {color: "#00ff00"};
            },
            onEachFeature: onEachFeature,
            // THIS ADDS THE POINTS TO THE MAP
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
            },
            filter: function(feature, layer) {
                return feature.properties.poverty == "yes";
            }
        });
        type_poverty.addTo(map);
    };    

    if(document.getElementById('chk_type_crime').checked && document.getElementById('chk_show_points').checked){

        pointsFilter = points.filter(function(feature){
            return feature.properties.sex == "yes";
        });

        type_crime = L.geoJson(points, {
            style: function(feature) {
                return {color: "#ff0000"};
            },
            onEachFeature: onEachFeature,
            // THIS ADDS THE POINTS TO THE MAP
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {radius: 3, weight: 2, opacity: 1, fillOpacity: 0.75});
            },
            filter: function(feature, layer) {
                return feature.properties.crime == "yes";
            }
        });
        type_crime.addTo(map);
    };    


}   
// JavaScript source code

function getTourStop(title) {
    for(var i=0; i<tourStops.length; i++) {
        if(tourStops[i]["title"] == title) {
            return tourStops[i];
        }
    }
}

function showTourStop(stop) {
    if(stop == currentTourStop) return;
    var oldTourStop = currentTourStop;
    currentTourStop = stop;

    var trace_highlight_color = "#0cdf80";
    var trace_normal_color = "#476255";

   
    /* New way to do this filter is to selectively show/hide layers
    if(stop["highlight_ships"] == "all") {
        // Special case to highlight all traces
        map.setPaintProperty("ship-traces", "line-color", trace_highlight_color);
    }
    else {
        map.setPaintProperty("ship-traces", "line-color", trace_normal_color);
        // Fade out old tour stop's highlight layers, fade in current tour stop's layers
        for(var i=0; i<oldTourStop["layers"].length; i++) {
            var layer = map.getLayer(oldTourStop["layers"][i]);
            if(layer == undefined) continue;
            if(layer.paint["fill-opacity"] != undefined) {
                map.setPaintProperty(oldTourStop["layers"][i], "fill-opacity", 0);
            }
            if(layer.paint["line-opacity"] != undefined) {
                map.setPaintProperty(oldTourStop["layers"][i], "line-opacity", 0);
            }
            if(layer.paint["text-opacity"] != undefined) {
                map.setPaintProperty(oldTourStop["layers"][i], "text-opacity", 0);
            }

            map.setLayoutProperty(oldTourStop["layers"][i], "visibility", "none");

        }

        for(var i=0; i<stop["layers"].length; i++) {
            var layer = map.getLayer(stop["layers"][i]);
            if(layer == undefined) continue;
            if(layer.paint["fill-opacity"] != undefined) {
                map.setPaintProperty(stop["layers"][i], "fill-opacity", 1);
            }
            if(layer.paint["line-opacity"] != undefined) {
                map.setPaintProperty(stop["layers"][i], "line-opacity", 1);
            }
            if(layer.paint["text-opacity"] != undefined) {
                map.setPaintProperty(stop["layers"][i], "text-opacity", 1);
            }

            map.setLayoutProperty(stop["layers"][i], "visibility", "visible");
        }


    }*/

    map.flyTo(stop["cameraOptions"]);
    if(stop["timestamp"] != null) {
        map.once("moveend", function() {
            setTime(stop["timestamp"]);
        });
    }
}

function advanceTourStop() {
    var direction = 1;
    var stopEl = $($(this).parent());
    var nextStop = direction > 0 ? stopEl.next() : stopEl.prev();
    var duration = 1000;
    if(nextStop.length == 0) {
        // No next/prev stop... so jump to first/last
        nextStop = direction > 0 ? stopEl.siblings().first() : stopEl.siblings().last();
        duration = 5000;
    }
    $("#map-scroll-narrative").animate({"scrollTop": ($(nextStop).offset().top + $("#map-scroll-narrative").scrollTop() - 40) + "px"}, duration)
}
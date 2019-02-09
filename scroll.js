					// SCROLL OVERLAY MECHANISM FOR BAR CHARTS

const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');

function updateChart(index) {
	const sel = container.select(`[data-index='${index}']`);
	const width = sel.attr('data-width');
	stepSel.classed('is-active', (d, i) => i === index);
	container.select('.bar-inner').style('width', width);
}

function init() {
Stickyfill.add(d3.select('.sticky').node());

	enterView({
		selector: stepSel.nodes(),
		offset: 0.5,
		enter: el => {
			const index = +d3.select(el).attr('data-index');
			updateChart(index);
		},
		exit: el => {
			let index = +d3.select(el).attr('data-index');
			index = Math.max(0, index - 1);
			updateChart(index);
		}
	});
}

init();


					// INITIATE MAP AND NECESSARY LAYERS

var currentTourStop = null;
	
mapboxgl.accessToken = 'pk.eyJ1IjoibW1haW56ZXIiLCJhIjoiY2l5ZDhjZnRyMDB0cDJ3cWtzdWt3azNlcyJ9.EiBO7S8zLzdYg2lnVxwQVg';
    
var bounds = [
    [-81.54718379357777, 31.80597386681353], // Southwest coordinates
    [-80.44031123497771, 32.34474428342236]  // Northeast coordinates
    ];

var map = new mapboxgl.Map({
    container: 'map', // container id
	style: 'mapbox://styles/mmainzer/cjlgxlhqx05kr2smq7ikmghls', // stylesheet location
	center: [-81.044757, 32.086214],
    bearing: 0,
    pitch: 0,
    zoom: 9.94,
    maxBounds: bounds // Sets bounds as max
});

map.on('load', function() {
        map.resize();
        if (window.location.search.indexOf('embed') !== -1) map.scrollZoom.disable();

        // Download ship track data to create animations
        var trace_dataset_id = "cjlst9r0f01oa2vq8o7a3ngcs";
        var dataURL = "https://api.mapbox.com/datasets/v1/mmainzer/" + trace_dataset_id + "/features?access_token=" + mapboxgl.accessToken;
        // dataURL = "data/ShipLines.geojson"; // Cannot identify this file in the original or what it is.
        $.get(dataURL, function(data) {
            setupAnimations(data);
            setupClock();
        });
    
        map.addSource('savannah-terminals', {
            type: 'vector',
            url: 'mapbox://mmainzer.cjmw5zy2g0bt22qo329wc9c2o-9mofv'
        });

        map.addLayer({
            "id": "jasper-boundary",
            "type": "fill",
            "source": "savannah-terminals",
            'source-layer': 'savannah-terminals',
            "paint": {
                "fill-color": "#f26322",
                "fill-opacity": 0.4
            },
            "filter": ["==", "$type", "Polygon"]
        });

        map.addLayer({
            'id': 'container-facilities',
            'type': 'symbol',
            'source': {
                type: 'vector',
                url: 'mapbox://mmainzer.cjmw5zy2g0bt22qo329wc9c2o-9mofv'
            },
            'layout': {
                'visibility': 'visible',
                'icon-image': 'marker-stroked-15',
                'icon-allow-overlap': true,
                "icon-size": {
                    stops: [
                        [8, 1],
                        [13, 1.5],
                        [17, 1.75]
                    ]
                },
            },
            'filter': ["==", "$type", "Point"],
            'source-layer': 'savannah-terminals'
        });

    });
    
    map.on('click', 'container-facilities', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.name)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'container-facilities', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'container-facilities', function () {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', 'jasper-boundary', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.name)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'jasper-boundary', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'jasper-boundary', function () {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', function (e) {
        var p = e.point
        var features = map.queryRenderedFeatures([
            {x: p.x-5, y: p.y-5},
            {x: p.x+5, y: p.y+5}
        ]);
        // Find only the ship trace features
        for(var i=0; i<features.length; i++) {
            var MMSI = features[i].properties["MMSI"];
            //map.setFilter("Highlighted-Ship-Traces", ["==", "MMSI", MMSI]);
            console.log(MMSI);
            break;
        }
    });

                    // INITIATE STORY POINTS FOR SCROLL MECHANISM

var tourStops = {

    'map-step-one': {
        center: [-81.044757, 32.086214],
        bearing: 0,
        pitch: 0,
        zoom: 9.94,
        speed: 0.3
    },

    'map-step-two': {
        center: [-80.806581, 32.064869],
        bearing: -58.40,
        zoom: 10.39,
        pitch: 59.50,
        speed: 0.3,
        timestamp: 1484184555
    },

    'map-step-three': {
        center: [-80.931896, 32.023879],
        bearing: 106.40,
        zoom: 12.32,
        pitch: 58.50,
        speed: 0.3,
        timestamp: 1484201100
    },

    'map-step-four': {
        center: [-80.945963, 32.037394],
        bearing: -125.60,
        zoom: 12.32,
        pitch: 50,
        speed: 0.6,
        timestamp: 1484201100
    },

    'map-step-five': {
        center: [-81.141417, 32.135851],
        bearing: -168.80,
        pitch: 53.00,
        zoom: 16.49,
        speed: 0.4,
        timestamp: 1484220000
    },

    'map-step-six': {
        center: [-80.927319, 32.055405],
        bearing: -50,
        zoom: 13.68,
        pitch: 60,
        speed: 0.3,
        timestamp: 1484237715
    },

    'map-step-seven': {
        center: [-81.054969, 32.098417],
        bearing: 0,
        pitch: 0,
        zoom: 11.38,
        speed: 0.3
    }

};

                    // ON EVERY SCROLL EVENT, CHECK WHICH ELEMENT IS ON SCREEN

window.onscroll = function() {
    var tourStopNames = Object.keys(tourStops);
    for (var i = 0; i < tourStopNames.length; i++) {
        var tourStopName = tourStopNames[i];
        if (isElementOnScreen(tourStopName)) {
            setActiveTourStop(tourStopName);
            break;
        }
    }
};

var activeTourStopName = 'map-step-one';
function setActiveTourStop(tourStopName) {
    if (tourStopName === activeTourStopName) return;
 
    map.flyTo(tourStops[tourStopName]);

    if(tourStops[tourStopName].timestamp != null) {
        map.once("moveend", function () {
            setTime(tourStops[tourStopName].timestamp);
        });
    }
     
    document.getElementById(tourStopName).setAttribute('class', 'map-step active');
    document.getElementById(activeTourStopName).setAttribute('class', 'map-step');
     
    activeTourStopName = tourStopName;
}

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}

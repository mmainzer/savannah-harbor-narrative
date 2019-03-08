					// SCROLL OVERLAY MECHANISM FOR BAR CHARTS

// config
    var width = 880,
        height = 480,
        padding = 20,
        containerBuckets = 5000,
        colCount = 0,
        rowCount = 0,
        colLimit = 10,
        xPos = 10,
        yPos = height - 30,
        radius = 2.2,
        spacing = 1.6,
        startXpos = xPos,
        labelXpos = startXpos,
        labels,
        slideOffset = window.innerHeight / 3,
        transition = 500,
        percentLines = [],
        pLinesExist = false,
        gradeOneMarkers = [],
        gradeTwelveMarkers = [],
        gradeThirteenMarkers = [],
        gradeFourteenMarkers = [],
        slideNineRun = false,
        ignoreTrigger = true,
        debug = false,
        circlesAdded = false,
        circlesReady = false,
        mobile = false,
        scrollDebug = true,
        oneHundred,
        employed;

const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');
const scroller = scrollama();

var svg = d3.select('#scrolly-overlay')
    .append("svg")
    .attr("width", width + padding * 2)
    .attr("height", height + padding * 2)
    .append("g")
    .attr("transform", "translate(" + padding + " , " + padding + ")"),
    pos = $("svg").position();

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function addCircles(gradeCount, className) {
        var c;
        var bar = svg.append("g")
            .attr("class", className + "group");

        for (c = 0; c < gradeCount; c++) {

            bar.append("circle")
                .attr("cx", 50)
                .attr("cy", yPos)
                .attr("r", 3)
                .attr("class", className)
                .style("opacity", 0)

        }

    }

    function spreadCircles() {
        var xx = 200,
            yy = height / 4 * 3,
            colc = 0;

        // var testData = d3.range(0, 100);

        var dWidth = 50 * 6 + (49 * spacing);

        if (mobile) {
            var origX = xx = (width - dWidth) / 3;
        } else {
            var origX = xx = (width - dWidth) / 2;
        }

        d3.selectAll(".grade1")
            .each(function (d, i) {
                d3.select(this)
                    .attr("cx", xx)
                    .attr("cy", yy)
                    .transition()
                    .delay(function () {
                        return randomInt(50, 500);
                    })
                    .style("opacity", 1)

                colc > 50 ? (xx = origX, yy += 9, colc = 0) : (xx += 8.7, colc++);

            })

    }

    function spreadCirclesReverse() {

        var xx = 200,
            yy = height / 4 * 3,
            colc = 0;

        d3.selectAll(".grade1")
            .each(function (d, i) {
                d3.select(this).transition()
                    .delay(function () {
                        return randomInt(5, 500);
                    })
                    .duration(transition)
                    .attr("cx", xx).attr("cy", yy).attr("r", 3).style("fill", "#fffcbc").style("opacity", 1)

                colc > 50 ? (xx = 200, yy += 9, colc = 0) : (xx += 8.7, colc++);

            })

    }

    function makeBars(groupName, className, barNo, pupilCount, year, labelClass, start, label, ref) {

        !start ? (xPos = startXpos = startXpos + (radius * 2 + spacing) * (colLimit + 2), yPos = height - 30) : (xPos = 0, yPos = height - 30);

        if (startPositions[1] && groupName == "bar2") {
            xPos = startPositions[1];
        }

        startPositions.push(xPos);

        startXpos = xPos, colCount = 0;

        var bar = svg.select(className + "group");

        // barlabels
        bar.append("text")
            .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
            .attr("y", height - 5)
            .html(year)
            .attr("class", "barLabels")
            .style("text-anchor", "middle")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .style("opacity", function () {
                if (groupName === "bar13" || groupName === "bar14") {
                    return 0;
                } else {
                    return 1;
                }
            })

        // bar circles
        d3.selectAll(className)
            .each(function (d, i) {
                d3.select(this)
                    .transition()
                    .delay(function () {
                        return randomInt(5, 500);
                    })
                    .duration(transition * 3)
                    .attr("cx", xPos)
                    .attr("cy", yPos)
                    .attr("r", radius)
                    .style("fill", function () {
                        if (className === ".grade13") {
                            return "white";
                        } else if (className === ".grade14") {
                            return "lightgreen";
                        }
                        // else { return col; }
                    })
                    .style("opacity", function () {
                        if (groupName === "bar13" || groupName === "bar14") {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                    .style("stroke", "none")

                xPos = xPos + spacing + radius * 2;
                colCount++;

                if (colCount === colLimit) {
                    colCount = 0;
                    xPos = startXpos;
                    yPos = yPos - spacing - radius * 2;
                }
            })

        //    barNumbers
        bar.append("text")
            .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
            .attr("y", function () {
                if (ref) return yPos - 10 + 65;
                else return yPos - 10;
            })
            .html(pupilCount)
            .attr("class", "barNumbers")
            .classed(barNo, true)
            .style("text-anchor", "middle")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .duration(transition)
            .style("opacity", function () {
                if (groupName === "bar13" || groupName === "bar14") {
                    return 0;
                } else {
                    return 1;
                }
            })

    }

    function moveBarNumber(barNo, xDiff) {

        d3.select(barNo)
            .transition()
            .duration(transition)
            .attr("x", function () {
                var cX = d3.select(this).attr("x");
                return cX - xDiff;

            })
            .style("opacity", 1)

    }

    $("document").ready(function () {
        // slide setup
        var slideWidth = $("#slides").width();
        var chartWidth = $("#chart").width();

        $(".slide").height(window.innerHeight);
        $("#slides").css("left", window.innerWidth / 2 - slideWidth / 2 + "px");
        $("#chart").css("left", (window.innerWidth / 2 - (chartWidth / 2)) + "px");
        $("#slides").css("opacity", 1);
        $("#chart").css("opacity", 1);

    });

    function scrollInit() {

        scroller
            .setup({
                step: '.step',
                offset: 0.7,
                debug: false
                // progress: true
            })
            .onStepEnter(handleStepEnter)

    }

    d3.csv("teu-summary.csv", function (data) {
        data.forEach(function (d) {
            d.teus = +d.teus / containerBuckets;
        })

        addCircles(data[0].teus, "grade1");
        addCircles(data[0].teus, "grade1ref");

        for (var c = 1; c < 14; c++) {
            var i = c + 1;

            addCircles(data[c].teus, "grade" + i, "#045a8d")

        }

        var count = d3.selectAll(".grade2").size();

    })

// function updateChart(index) {
// 	const sel = container.select(`[data-index='${index}']`);
// 	const width = sel.attr('data-width');
// 	stepSel.classed('is-active', (d, i) => i === index);
// 	container.select('.bar-inner').style('width', width);
// }

// function init() {
// Stickyfill.add(d3.select('.sticky').node());

// 	enterView({
// 		selector: stepSel.nodes(),
// 		offset: 0.5,
// 		enter: el => {
// 			const index = +d3.select(el).attr('data-index');
// 			updateChart(index);
// 		},
// 		exit: el => {
// 			let index = +d3.select(el).attr('data-index');
// 			index = Math.max(0, index - 1);
// 			updateChart(index);
// 		}
// 	});
// }

// init();


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

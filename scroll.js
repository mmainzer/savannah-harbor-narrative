					// SCROLL OVERLAY MECHANISM FOR BAR CHARTS


// using d3 for convenience
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();

// for reverse
var startPositions = [],
    slide4reverse = false,
    slide5reverse = false,
    slide6reverse = false,
    slide7reverse = false,
    slide8reverse = false,
    slide11reverse = false;

// config variables to use later in functions
var width = 980,
    height = 520,
    padding = 20,
    center = "center",
    gradeBuckets = 7000,
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
    slideOffset = window.innerHeight / 1.5,
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

// for reverse
var startPositions = [],
    slide4reverse = false,
    slide5reverse = false,
    slide6reverse = false,
    slide7reverse = false,
    slide8reverse = false,
    slide11reverse = false;

d3.select("#chart")
    .style("width", width + padding * 2 + "px")
    .style("height", height + padding * 2 + "px");

                // CREATE SVG IN DIV CONTAINER TO 'DRAW' ON

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + padding * 2)
    .attr("height", height + padding * 2)
    .append("g")
    .attr("transform", "translate(" + padding + " , " + padding + ")"),
    pos = $("svg").position();

// add group for lines
var pLines = svg.append("g")
    .attr("class", "p-lines");

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// FUNCTIONS FOR ANIMATIONS TO BE TRIGGERED WITH SCROLL EVENTS

// adding the initial grid of circles
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


// spreading those circles to a single bar
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

// reverse the above function if scroll is in opposite direction
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

// make the bars for the bar chart
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
            if (groupName === "bar15" || groupName === "bar16") {
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
                    if (className === ".grade15") {
                        return "white";
                    } else if (className === ".grade16") {
                        return "lightgreen";
                    }
                    // else { return col; }
                })
                .style("opacity", function () {
                    if (groupName === "bar15" || groupName === "bar16") {
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
            if (groupName === "bar15" || groupName === "bar16") {
                return 0;
            } else {
                return 1;
            }
        })
}

// function for creating first bar from 2013

function init() {
    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    // handleResize();
    // 2. setup the scroller passing options
    // this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        container: '#scroll',
        graphic: '.scroll__graphic',
        text: '.scroll__text',
        step: '.scroll__text .step',
        offset: 0.8,
        debug: false,
    })
        .onStepEnter(handleStepEnter)
        .onContainerEnter(handleContainerEnter)
        .onContainerExit(handleContainerExit);
    // setup resize event
    // window.addEventListener('resize', handleResize);
}

d3.csv("data/teu-summary.csv", function (data) {
        data.forEach(function (d) {
            d.teus = +d.teus / gradeBuckets;
        })
        console.log('Circles added')

        addCircles(data[0].teus, "grade1");
        addCircles(data[0].teus, "grade1ref");

        for (var c = 1; c < 14; c++) {
            var i = c + 1;

            addCircles(data[c].teus, "grade" + i, "#045a8d")

        }

        var count = d3.selectAll(".grade2").size();

    })

var slideTwoDone = false,
    slideThreeDone = false,
    slideFourDone = false,
    slideFiveDone = false,
    slideFiveTwoDone = false,
    slideSixDone = false,
    slideSevenDone = false,
    slideEightDone = false,
    slideNineDone = false,
    slideElevenDone = false,
    slideTwelveDone = false,
    slideThirteenDone = false,
    slideFourteenDone = false,
    slideFifteenDone = false,
    slideSixteenDone = false,
    slideSeventeenDone = false, 
    slideEighteenDone = false, 
    slideNineteenDone = false;


// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    // add color to current step only
    step.classed('is-active', function (d, i) {
        return i === response.index;
    })
    // update graphic based on step
    var el = d3.select(response.element);
    var val = el.attr('data-step');

    switch (val) {
        // case '1':
        //     console.log('Slide 1 Active');
        //     if (ignoreTrigger) {

        //     } else if (response.direction === "up") {
        //         slideTwoDone = false;
        //         // spreadCirclesReverse();
        //         d3.selectAll(".grade1")
        //             .transition()
        //             .delay(randomInt(5, 500))
        //             .duration(transition)
        //             .style("opacity", 0)

        //         break;
        //     }
        case '2':
            console.log('Slide 2 Active');

            if (response.direction === "down") {
                slideTwoDone = true;
                spreadCircles();
                ignoreTrigger = false;

            } else {
                if (!ignoreTrigger) {
                    slideThreeDone = false;
                    slide_three_reverse();
                }

            }
            break;

        case '3':
            console.log('Slide 3 Active');

            if (response.direction === "down") {
                slideThreeDone = true;
                slide_three()

            } else {
                slideFourDone = false;
                slide_four_reverse();
            }
            break;


        case '4':
            console.log('Slide 4 Active');

            if (response.direction === "down") {
                slideFourDone = true;
                slide_four()
            } else {
                slideFiveDone = false;
                slide_five_reverse();
            }
            break;

        case '5':
            console.log('Slide 5 Active');

            if (response.direction === "down") {
                slideFiveDone = true;
                slide_five();
            } else {
                slideFiveTwoDone = false;
                slide_five_reverse();
            }
            break;

        case '6':
            console.log('Slide 6 active');

            if (response.direction === "down") {
                slide_six();
        }
    }
}


function handleContainerEnter(response) {
    // response = { direction }
    // sticky the graphic (old school)
    graphic.classed('is-fixed', true);
    graphic.classed('is-bottom', false);
}


function handleContainerExit(response) {
    // response = { direction }
    // un-sticky the graphic, and pin to top/bottom of container
    graphic.classed('is-fixed', false);
    graphic.classed('is-bottom', response.direction === 'down');
}

function slide_three() {

    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width - 100)
        .attr("y1", height - 28)
        .attr("y2", height - 28)
        .attr("class", "graph-line")
        .style("stroke", "#fff")
        .style("stroke-width", 1)
        .style("opacity", 0)
        .transition()
        .duration(transition)
        .style("opacity", 0.7)

    makeBars(".bar1", ".grade1", "barNo1", "2.16", "2006", ".label1", true);

}

function slide_three_reverse() {

    svg.selectAll("line")
        .transition()
        .duration(transition)
        .style("opacity", 0)

    svg.selectAll(".barLabels")
        .remove()
    svg.selectAll(".barNumbers")
        .remove();

    spreadCirclesReverse();
    svg.selectAll(".grade1")
        .style("opacity", 1)

}

function slide_four() {

    if (slide4reverse) {
        var selects = ".grade2group, .grade3group, .grade4group, .grade5group, .grade6group, .grade7group";
        svg.selectAll(selects).transition().duration(transition * 3).style("opacity", 1);
    } else {
        makeBars("bar2", ".grade2", "barNo2", "", "2007", ".label2", false)
        makeBars("bar3", ".grade3", "barNo3", "", "2008", ".label3", false)
        makeBars("bar4", ".grade4", "barNo4", "", "2009", ".label4", false)
        makeBars("bar5", ".grade5", "barNo5", "", "2010", ".label5", false)
        makeBars("bar6", ".grade6", "barNo6", "", "2011", ".label6", false)
        makeBars("bar7", ".grade7", "barNo7", "2.96", "2012", ".label7", false, true)

    }

}

function slide_four_reverse() {

    var selects = ".grade2group, .grade3group, .grade4group, .grade5group, .grade6group, .grade7group";
    svg.selectAll(selects).transition().duration(transition * 3).style("opacity", 0);
    d3.selectAll(".grade1").transition().duration(transition).style("fill", "#fffcbc").style("opacity", 1);

    slide4reverse = true;
}


function slide_five() {

    if (slide5reverse) {
        var selects = ".grade8group, .grade9group, .grade10group, .grade11group, .grade12group";
        svg.selectAll(selects).transition().delay(randomInt(5, 500)).duration(transition).style("opacity", 1);

        var selects2 = ".grade1, .grade2, .grade3, .grade4, .grade5, .grade6, .grade7";
        d3.selectAll(selects2).transition().duration(1000).style("opacity", 0.5);

    } else {
        makeBars("bar8", ".grade8", "barNo8", "", "2013", ".label8", false)
        makeBars("bar9", ".grade9", "barNo9", "", "2014", ".label9", false)
        makeBars("bar10", ".grade10", "barNo10", "", "2015", ".label10", false)
        makeBars("bar11", ".grade11", "barNo11", "", "2016", ".label11", false)
        makeBars("bar12", ".grade12", "barNo12", "", "2017", ".label12", false)
        makeBars("bar13", ".grade13", "barNo13", "4.35", "2018", ".label13", false, true)

        setTimeout(function () {
            var selects2 = ".grade1, .grade2, .grade3, .grade4, .grade5, .grade6, .grade7";
            d3.selectAll(selects2).transition().duration(1000).style("opacity", 0.5);

        }, 100)
    }

}

function slide_five_reverse() {

    setTimeout(function () {
        var selects = ".grade1, .grade2, .grade3, .grade4, .grade5, .grade6, .grade7";
        d3.selectAll(selects).transition().duration(1000).style("opacity", 1);

    }, 100)

    var selects2 = ".grade8group, .grade9group, .grade10group, .grade11group, .grade12group";
    svg.selectAll(selects2).transition().delay(randomInt(5, 500)).duration(transition).style("opacity", 0);
    slide5reverse = true;
}


function slide_six() {

    if (slide6reverse) {
        var selects = ".grade14group";
        svg.selectAll(selects).transition().duration(transition * 3).style("opacity", 1).style("fill", red);
    } else {
        makeBars("bar14", ".grade14", "barNo14", "5.05", "2019", ".label14", false, true)
        makeBars("bar15", ".grade15", "barNo12", "", "", ".label15", false)
        makeBars("bar16", ".grade16", "barNo13", "", "", ".label16", false)

    }

}

// kick things off
init();


                    // MAPBOX STUFF STARTING NOW

mapboxgl.accessToken = 'pk.eyJ1IjoibW1haW56ZXIiLCJhIjoiY2l5ZDhjZnRyMDB0cDJ3cWtzdWt3azNlcyJ9.EiBO7S8zLzdYg2lnVxwQVg';


                    // INITIATE FIRST MAP FOR INTERNATIONAL EXPLORATION

var map2 = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/mmainzer/cjt7bvv5z6byh1fl2b8cfhtyy',
    center: [3.5, 25.057790],
    zoom: 1.27,
    scrollZoom: false,
    doubleClickZoom: false,
    renderWorldCopies: false
});

map2.on('load', function() {
        map2.resize();
        if (window.location.search.indexOf('embed') !== -1) map2.scrollZoom.disable();

        // add foreign ports tileset for interactive styling later on
        map2.addSource('foreign-ports', {
            type: 'vector',
            url: 'mapbox://mmainzer.cjt7ykc8m02q7kqleoi5okknj-3deft'
        });

        map2.addLayer({
            "id": "ports",
            "type": "circle",
            "source": {
                type: 'vector',
                url: 'mapbox://mmainzer.cjt7ykc8m02q7kqleoi5okknj-3deft'
            },
            "source-layer": "ports-containers",
            "layout": {
                'visibility': 'none'
            },
            "paint": {
                "circle-radius": 3,
                // 'circle-opacity': {
                //     stops: [[1.5, 1], [2.1, 0]]
                // },
                'circle-color': 'rgb(0,188,241)'
            }
        });

        map2.addLayer({
            "id": "ports-14",
            "type": "circle",
            "source": {
                type: 'vector',
                url: 'mapbox://mmainzer.cjt7ykc8m02q7kqleoi5okknj-3deft'
            },
            "source-layer": "ports-containers",
            "layout": {
                'visibility': 'none'
            },
            "paint": {
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "2014_Containers"],
                  0,3,
                  42363,50
                ],
                'circle-opacity': 0.7,
                'circle-color': 'rgb(0,188,241)'
            }
        });

        map2.addLayer({
            "id": "ports-18",
            "type": "circle",
            "source": {
                type: 'vector',
                url: 'mapbox://mmainzer.cjt7ykc8m02q7kqleoi5okknj-3deft'
            },
            "source-layer": "ports-containers",
            "layout": {
                'visibility': 'none'
            },
            "paint": {
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "2018_Containers"],
                  0,3,
                  48509,50
                ],
                'circle-opacity': 0.7,
                'circle-color': [
                  "match",
                  ["get", "Country"],
                  [
                    "China (Taiwan)",
                    "Philippines",
                    "Cambodia",
                    "Singapore",
                    "China (Mainland)",
                    "Japan",
                    "Thailand",
                    "South Korea",
                    "Vietnam",
                    "Malaysia",
                    "Hong Kong"
                  ],
                  "hsla(193, 100%, 47%, 0.7)",
                  "hsla(0, 0%, 30%, 0.7)"
                ]
            }
        });

        map2.addLayer({
            "id": "ports-euro",
            "type": "circle",
            "source": {
                type: 'vector',
                url: 'mapbox://mmainzer.cjt7ykc8m02q7kqleoi5okknj-3deft'
            },
            "source-layer": "ports-containers",
            "layout": {
                'visibility': 'none'
            },
            "paint": {
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  [
                    "interpolate",
                    ["linear"],
                    [
                      "get",
                      "2018_Containers"
                    ],
                    0,
                    3,
                    24255,
                    5
                  ],
                  3.75,
                  [
                    "interpolate",
                    ["linear"],
                    [
                      "get",
                      "2018_Containers"
                    ],
                    0,
                    5,
                    26949,
                    80
                  ],
                  22,
                  [
                    "interpolate",
                    ["linear"],
                    [
                      "get",
                      "2018_Containers"
                    ],
                    0,
                    3,
                    24255,
                    5
                  ]
                ],
                'circle-opacity': 0.7,
                'circle-color': [
                  "match",
                  ["get", "Country"],
                  [
                    "Italy",
                    "Slovenia",
                    "Belgium",
                    "Malta",
                    "Ireland",
                    "Spain",
                    "Federal Republic of Germany",
                    "United Kingdom",
                    "Greece",
                    "Netherlands",
                    "Netherland Antilles",
                    "Denmark",
                    "France",
                    "Albania",
                    "Portugal"
                  ],
                  "hsla(193, 100%, 47%, 0.7)",
                  "hsla(0, 0%, 30%, 0.7)"
                ]
            }
        });

    });


var chapters = {
    '0': {
        center: [3.5, 25.057790],
        zoom: 1.27,
    },
    '1': {
        center: [3.5, 25.057790],
        zoom: 1.27
    },
    '2': {
        center: [3.5, 25.057790],
        zoom: 1.27
    },
    '3': {
        center: [3.5, 25.057790],
        zoom: 1.27
    },
    '4': {
        center: [3.498127, 47.200043],
        zoom: 3.9,
        speed: 0.5
    },
    '5': {
        center: [9.528939, 53.610899],
        zoom: 11.41,
        speed: 0.6
    },
    '6': {
        center: [9.528939, 53.610899],
        zoom: 11.41,
        speed: 0.6
    }
};

                    // INITIATE THIRD MAP FOR ROUTE TO KIA MANUFACTURING PLANT

var map3 = new mapboxgl.Map({
    container: 'map3',
    style: 'mapbox://styles/mmainzer/cjt7bvv5z6byh1fl2b8cfhtyy',
    center: [-81.123, 32.076],
    zoom: 11.41,
    scrollZoom: false,
    doubleClickZoom: false,
    dragRotate: false
});

                    // ADD LAYERS YOU'LL SHOW AND HIDE LATER ON

map3.on('load', function() {
        map3.resize();
        if (window.location.search.indexOf('embed') !== -1) map2.scrollZoom.disable();

        // add foreign ports tileset for interactive styling later on
        map3.addSource('savannah-terminals', {
            type: 'vector',
            url: 'mapbox://mmainzer.cjmw5zy2g0bt22qo329wc9c2o-9mofv'
        });

        map3.addLayer({
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



    });


var routeSteps = {
    'kia0': {
        center: [-81.123, 32.076],
        zoom: 11.41
    },
    'kia1': {
        center: [-81.123, 32.076],
        zoom: 11.41
    },
    'kia2': {
        center: [-81.123, 32.076],
        zoom: 11.41
    },
    'kia3': {
        center: [-81.123, 32.076],
        zoom: 11.41
    },

    'kia4': {
        center: [-85.119433,32.925241],
        zoom: 13,
        // speed: 0.22,
        duration: 20100,
        minZoom: 6,
        easing(t) {return t;}
    }
};
 
window.addEventListener('scroll', tour_one);
window.addEventListener('scroll', tour_two);
window.addEventListener('scroll', tour_three);

// On every scroll event, check which element is on screen
function tour_one() {
    var chapterNames = Object.keys(chapters);    
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
            if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
}
 
var activeChapterName = '0';
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;
     
    map2.flyTo(chapters[chapterName]);

    // add stadersand shipping path dataset
        var stadersandPathID = "cjsqfcghj0dgr2rrvg3gy22q9";
        var stadersandPath = "https://api.mapbox.com/datasets/v1/mmainzer/" + stadersandPathID + "/features?access_token=" + mapboxgl.accessToken;
           
    document.getElementById(chapterName).setAttribute('class', 'step is-active');
    document.getElementById(activeChapterName).setAttribute('class', 'step');
    console.log(chapterName, activeChapterName);
    
    if (chapterName === '0') {
        map2.setLayoutProperty('ports', 'visibility', 'none')
        map2.setLayoutProperty('ports-14', 'visibility', 'none')
        map2.setLayoutProperty('ports-18', 'visibility', 'none')
        map2.setLayoutProperty('ports-euro', 'visibility', 'none')
        map2.setLayoutProperty('trace', 'visibility', 'none')
    } else if (chapterName === '1') {
        map2.setLayoutProperty('ports', 'visibility', 'visible')
        map2.setLayoutProperty('ports-14', 'visibility', 'none')
        map2.setLayoutProperty('ports-18', 'visibility', 'none')
        map2.setLayoutProperty('ports-euro', 'visibility', 'none')
        map2.setLayoutProperty('trace', 'visibility', 'none')
    } else if (chapterName === '2') {
        map2.setLayoutProperty('ports', 'visibility', 'none')
        map2.setLayoutProperty('ports-14', 'visibility', 'visible')
        map2.setLayoutProperty('ports-18', 'visibility', 'none')
        map2.setLayoutProperty('ports-euro', 'visibility', 'none')
        map2.setLayoutProperty('trace', 'visibility', 'none')
    } else if (chapterName === '3') {
        map2.setLayoutProperty('ports', 'visibility', 'none')
        map2.setLayoutProperty('ports-14', 'visibility', 'none')
        map2.setLayoutProperty('ports-18', 'visibility', 'visible')
        map2.setLayoutProperty('ports-euro', 'visibility', 'none')
        map2.setLayoutProperty('trace', 'visibility', 'none')
    } else if (chapterName === '4' || chapterName === '5') {
        map2.setLayoutProperty('ports', 'visibility', 'none')
        map2.setLayoutProperty('ports-14', 'visibility', 'none')
        map2.setLayoutProperty('ports-18', 'visibility', 'none')
        map2.setLayoutProperty('ports-euro', 'visibility', 'visible')
        map2.setLayoutProperty('trace', 'visibility', 'none')
    } else if (chapterName === '6') {
        map2.setLayoutProperty('ports', 'visibility', 'none')
        map2.setLayoutProperty('ports-14', 'visibility', 'none')
        map2.setLayoutProperty('ports-18', 'visibility', 'none')
        map2.setLayoutProperty('ports-euro', 'visibility', 'none')

        d3.json(stadersandPath, function(err, data) {
            if (err) throw err;

            var coordinates = data.features[0].geometry.coordinates;

            data.features[0].geometry.coordinates = [coordinates[0]];

            map2.addSource('trace', { type: 'geojson', data : data });
        
            map2.addLayer({
                "id": "trace",
                "type": "line",
                "source": "trace",
                "paint": {
                    "line-color": "yellow",
                    "line-opacity": 0.75,
                    "line-width": 5
                }
            });

            // setup the viewport
            // map2.flyTo({ center: coordinates[0], zoom: 5 });
            // map2.setPitch(0);
             
            // on a regular basis, add more coordinates from the saved list and update the map
            var i = 0;
            var timer = window.setInterval(function() {
                if (i < coordinates.length) {
                    data.features[0].geometry.coordinates.push(coordinates[i]);
                    map2.getSource('trace').setData(data);
                    map2.flyTo({center: [-81.025, 32.060], zoom: 11.41, speed: 0.57, easing(t) {return t;}});
                    // map2.easeTo()
                    i++;
                } else {
                    window.clearInterval(timer);
                }
            }, 70);

        });  


    } else {
        map2.setLayoutProperty('ports', 'visibility', 'none')
        map2.setLayoutProperty('ports-14', 'visibility', 'none')
        map2.setLayoutProperty('ports-18', 'visibility', 'none')
        map2.setLayoutProperty('ports-euro', 'visibility', 'none')
    };

    activeChapterName = chapterName;


}

// On every scroll event, check which element is on screen
function tour_three() {
    var stepNames = Object.keys(routeSteps);    
    for (var i = 0; i < stepNames.length; i++) {
        var stepName = stepNames[i];
            if (isElementOnScreen(stepName)) {
            setActiveStep(stepName);
            break;
        }
    }
}
 
var activeStep = 'kia0';
function setActiveStep(stepName) {
    if (stepName === activeStep) return;
     
    map3.flyTo(routeSteps[stepName]);

    // add stadersand shipping path dataset
        var kiaRouteId = "cjwl077un0jz02nlg1ork408d";
        var kiaRoute = "https://api.mapbox.com/datasets/v1/mmainzer/" + kiaRouteId + "/features?access_token=" + mapboxgl.accessToken;
           
    document.getElementById(stepName).setAttribute('class', 'step is-active');
    document.getElementById(activeStep).setAttribute('class', 'step');
    console.log(stepName, activeStep);
    
    if (stepName === 'kia0') {
        map3.setLayoutProperty('jasper-boundary', 'visibility', 'visible')

    } else if (stepName === 'kia1') {
        map3.setLayoutProperty('jasper-boundary', 'visibility', 'none')

    } else if (stepName === 'kia2') {
        map3.setLayoutProperty('jasper-boundary', 'visibility', 'visible')

    } else if (stepName === 'kia3') {
        map3.setLayoutProperty('jasper-boundary', 'visibility', 'none')

    } else if (stepName === 'kia4') {
        map3.setLayoutProperty('jasper-boundary', 'visibility', 'none')

        d3.json(kiaRoute, function(err, data) {
            if (err) throw err;

            var coordinates = data.features[1].geometry.coordinates;

            data.features[1].geometry.coordinates = [coordinates[0]];

            map3.addSource('kia-route', { type: 'geojson', data : data });
        
            map3.addLayer({
                "id": "kia-route",
                "type": "line",
                "source": "kia-route",
                "paint": {
                    "line-color": "#007DB9",
                    "line-opacity": 0.8,
                    "line-width": 5
                }
            });
             
            // on a regular basis, add more coordinates from the saved list and update the map
            var i = 0;
            var timer = window.setInterval(function() {
                if (i < coordinates.length) {
                    data.features[1].geometry.coordinates.push(coordinates[i]);
                    map3.getSource('kia-route').setData(data);
                    i++;
                } else {
                    window.clearInterval(timer);
                }
            }, 4.7);

        });  


    } else {
        map3.setLayoutProperty('jasper-boundary', 'visibility', 'none')
    };

    activeStep = stepName;


}


					// INITIATE SECOND MAP AND NECESSARY LAYERS

var currentTourStop = null;
	
    
var bounds = [
    [-81.54718379357777, 31.80597386681353], // Southwest coordinates
    [-80.44031123497771, 32.34474428342236]  // Northeast coordinates
    ];

var map = new mapboxgl.Map({
    container: 'map', // container id
	style: 'mapbox://styles/mmainzer/cjt7bvv5z6byh1fl2b8cfhtyy', // stylesheet location
	center: [-81.044757, 32.086214],
    bearing: 0,
    pitch: 0,
    zoom: 9.94,
    maxBounds: bounds // Sets bounds as max
});

map.on('load', function() {
        map.resize();
        if (window.location.search.indexOf('embed') !== -1) map.scrollZoom.disable();

        
        // dataURL = "data/ShipLines.geojson"; // Cannot identify this file in the original or what it is.
        
    
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

function tour_two() {
    var tourStopNames = Object.keys(tourStops);
    for (var i = 0; i < tourStopNames.length; i++) {
        var tourStopName = tourStopNames[i];
        if (isElementOnScreen(tourStopName)) {
            setActiveTourStop(tourStopName);
            break;
        }
    }
}

var activeTourStopName = 'map-step-one';
function setActiveTourStop(tourStopName) {
    if (tourStopName === activeTourStopName) return;
    
    map.flyTo(tourStops[tourStopName]);


    // Download ship track data to create animations
    var trace_dataset_id = "cjlst9r0f01oa2vq8o7a3ngcs";
    var dataURL = "https://api.mapbox.com/datasets/v1/mmainzer/" + trace_dataset_id + "/features?access_token=" + mapboxgl.accessToken;

    $.get(dataURL, function(data) {
            setupAnimations(data);
            setupClock();
        });

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
    return bounds.top < window.innerHeight && bounds.bottom > 300;
}
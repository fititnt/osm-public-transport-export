const { osmToGeojson, OSMOverpassDownloader } = require('../../')
const fs = require('fs')
const path = require('path')
osmToGeojson({
    outputDir: __dirname + '/out',
    mapProperties: (tags) => ({
        ...tags,
        stroke: '#164154',
        "stroke-width": 5,
    }),
    stopNameSeparator: ' and ',
    stopNameFallback: 'unnamed',
    // osmDataGetter: new OSMOverpassDownloader({
    //     south: 17.958761,
    //     west: -16.025151,
    //     north: 18.192123,
    //     east: -15.874505,
    // })
    // https://nominatim.openstreetmap.org/search?q=Recife,Pernambuco&format=geojson
    osmDataGetter: new OSMOverpassDownloader({
        south: -8.1551869,
        west: -35.0186478,
        north: -7.928967,
        east: -34.8515401
    })
    // https://nominatim.openstreetmap.org/search?q=Porto%20Alegre,Brazil&format=geojson
    // "bbox": [
    //     -51.3034404,
    //     -30.2694499,
    //     -51.0188522,
    //     -29.9324744
    //   ],
    // osmDataGetter: new OSMOverpassDownloader({
    //     south: -30.2694499,
    //     west: -51.3034404,
    //     north: -29.9324744,
    //     east: -51.0188522
    // })
})
    .catch(error => console.error(error))

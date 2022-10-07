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
        south: -35.0186478,
        west: -8.1551869,
        north: -34.8515401,
        east: -7.928967
    })
})
    .catch(error => console.error(error))

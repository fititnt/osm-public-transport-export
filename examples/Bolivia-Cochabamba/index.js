const { osmToGeojson, OSMPBFReader, OSMOverpassDownloader } = require('../../')
const fs = require('fs')
const path = require('path')
osmToGeojson({
    outputDir: __dirname + '/out',
    mapProperties: (tags) => ({
        ...tags,
        stroke: '#164154',
        "stroke-width": 5,
    }),
    stopNameSeparator: ' y ',
    stopNameFallback: 'innominada',
    // left=-66.440262 bottom=-17.709721 right=-65.577835 top=-17.261759
    osmDataGetter: new OSMPBFReader(path.join(__dirname, "cochabamba.osm.pbf"))
    // osmDataGetter: new OSMOverpassDownloader({
    //     south: -17.709721,
    //     west: -66.440262,
    //     north: -17.261759,
    //     east: -65.577835,
    // })
}).catch(error => console.error(error))

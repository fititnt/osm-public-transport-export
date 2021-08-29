const OSMOverpassDownloader = require('./src/osm_getter/overpass_downloader')
const OSMPBFReader = require('./src/osm_getter/pbf_reader')
const convertGeoJSON = require('./src/OSM_dataTool')
const fs = require('fs')
const path = require('path')

const defaultOptions = {
    outputDir: null,
    geojsonFilename: 'routes.geojson',
    logFilename: 'log.json',
    stopsFilename: 'stops.json',
    stopNameSeparator: ' and ',
    stopNameFallback: 'Unnamed Street',
    formatStopName: function (names) { return names.join(this.stopNameSeparator) || this.stopNameFallback },
    mapProperties: function (tags) { return tags },
    osmDataGetter: null
}

async function osmToGeojson(options = {}) {
    options = Object.assign({}, defaultOptions, options)

    // Rebind functions to new options object
    Object.keys(options).forEach(key => {
        if (typeof options[key] === "function") {
            options[key] = options[key].bind(options)
        }
    });
    const {
        outputDir,
        geojsonFilename,
        logFilename,
        stopsFilename,
        formatStopName,
        mapProperties,
    } = options;

    if (options.osmDataGetter == null) {
        throw new Error('osmDataGetter missing')
    }

    if (outputDir !== null && typeof outputDir !== "string") {
        throw new Error('Invalid outputDir');
    }

    if (outputDir && !fs.existsSync(path.dirname(outputDir))) {
        throw new Error('Output directory does not exist')
    }

    const routes = await options.osmDataGetter.getRoutes()
    const ways = await options.osmDataGetter.getWays()
    const data = convertGeoJSON({ routes, ways, mapProperties, formatStopName })

    if (outputDir) {
        fs.writeFileSync(path.join(outputDir, geojsonFilename), JSON.stringify(data.geojson))
        fs.writeFileSync(path.join(outputDir, logFilename), JSON.stringify(data.log))
        fs.writeFileSync(path.join(outputDir, stopsFilename), JSON.stringify(data.stops))
    }

    return data
}

module.exports = {
    osmToGeojson,
    OSMOverpassDownloader,
    OSMPBFReader
}

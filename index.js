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
    readmeFilename: 'README.md',
    stopNameSeparator: ' and ',
    stopNameFallback: 'Unnamed Street',
    formatStopName: function (names) { return names.join(this.stopNameSeparator) || this.stopNameFallback },
    mapProperties: function (tags) { return tags },
    osmDataGetter: null,
    transformTypes: ["bus", "share_taxi", "aerialway", "train", "subway", "monorail", "tram", "trolleybus", "ferry"]
}

function readmeGenerator(data) {
    let route_with_error = 0
    let out_file = `
| Id | Name | Ref | From | To | State |
| -- | ---- | --- | ---- | -- | ----- |`
    data.log.forEach(element => {
        const tags = element.tags
        if (element.error) route_with_error++
        const state = element.error ? element.error.extractor_error ? `[${element.error.extractor_error}](${element.error.uri})` : element.error : "✅"
        out_file += `\n[${element.id}](https://www.openstreetmap.org/relation/${element.id}) | ${tags.name} | ${tags.ref} | ${tags.from} | ${tags.to} | ${state}`
    });
    const response = `### Count
**Total**: ${data.log.length}  **Correct**: ${data.log.length - route_with_error}  **With error**: ${route_with_error}

${out_file}`
    return response;
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
        readmeFilename,
        formatStopName,
        mapProperties,
        transformTypes,
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

    const routes = await options.osmDataGetter.getRoutes(transformTypes)
    const ways = await options.osmDataGetter.getWays()
    const data = convertGeoJSON({ routes, ways, mapProperties, formatStopName })
    const readme = readmeGenerator(data)

    if (outputDir) {
        fs.writeFileSync(path.join(outputDir, geojsonFilename), JSON.stringify(data.geojson))
        fs.writeFileSync(path.join(outputDir, logFilename), JSON.stringify(data.log))
        fs.writeFileSync(path.join(outputDir, stopsFilename), JSON.stringify(data.stops))
        fs.writeFileSync(path.join(outputDir, readmeFilename), readme)
    }

    return data
}

module.exports = {
    osmToGeojson,
    OSMOverpassDownloader,
    OSMPBFReader
}

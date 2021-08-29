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
})
    .then(data => {
        let route_with_error = 0
        let out_file = `### Bolivia-Cochabamba
| Id | Name | Ref | From | To | State |
| -- | ---- | --- | ---- | -- | ----- |`
        data.log.forEach(element => {
            let tags = element.tags
            if (element.error) route_with_error++
            let state = element.error ? element.error.extractor_error ? `[${element.error.extractor_error}](${element.error.uri})` : element.error : "✅"
            out_file += `\n[${element.id}](https://www.openstreetmap.org/relation/${element.id}) | ${tags.name} | ${tags.ref} | ${tags.from} | ${tags.to} | ${state}`
        });
        // console.log(out_file)
        out_file = `### Count
**Total**: ${data.log.length}  **Correct**: ${data.log.length - route_with_error}  **With error**: ${route_with_error}

${out_file}`
        fs.writeFileSync(path.join(__dirname, "README.md"), out_file)
    })
    .catch(error => console.error(error))
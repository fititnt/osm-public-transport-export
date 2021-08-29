const { osmToGeojson, OsmPbfReader, OSMDownloader } = require('../../')
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
    osmDataGetter: new OSMDownloader({
        south: 17.958761,
        west: -16.025151,
        north: 18.192123,
        east: -15.874505,
    })
})
    .then(data => {
        let route_with_error = 0
        let out_file = `### Mauritania-Nouakchott
| Id | Name | Ref | From | To | State |
| -- | ---- | --- | ---- | -- | ----- |`
        data.log.forEach(element => {
            let tags = element.tags
            if (element.error) route_with_error++
            let state = element.error ? element.error.extractor_error ? `[${element.error.extractor_error}](${element.error.uri})` : element.error : "✅"
            out_file += `\n[${element.id}](https://www.openstreetmap.org/relation/${element.id}) | ${tags.name} | ${tags.ref} | ${tags.from} | ${tags.to} | ${state}`
        });
        out_file = `### Count
**Total**: ${data.log.length}  **Correct**: ${data.log.length - route_with_error}  **With error**: ${route_with_error}

${out_file}`
        fs.writeFileSync(path.join(__dirname, "README.md"), out_file)
    })
    .catch(error => console.error(error))
const request = require('request-promise-native');
const safeEval = require('safe-eval');
const uaString = require('ua-string');

async function main() {
    const js_array_promises = ["https://millennium-war.net/assets/javascripts/aigis.js", "https://all.millennium-war.net/assets/javascripts/aigis_all.js"]
        .map(url => request({url, headers: {'User-Agent': uaString}}));
    const js_array = await Promise.all(js_array_promises);
    require('browser-env')();
    console.log(js_array.map(js => `// @match        ${safeEval(`(() => { ${js}; return URLConst.GAME; })()`, window)}`).join("\n"));
}
main().catch(err => {
    console.error(err);
    process.exit(255);
});

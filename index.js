var fs = require('fs');
var path = require('path');
var path = process.argv[2];
let arr = [];
getFiles(path);
fs.writeFile(`${path}summary.js`, createSummaryFile(arr), function () {
});

function getFiles(p_path) {
    let files = fs.readdirSync(p_path);
    for (let i in files) {
        let name = p_path + files[i];
        if (fs.statSync(name).isDirectory()) {
            name += '\\\\';
            getFiles(name);
        } else {
            arr.push("\\\\" + (name).substring(path.length));
        }
    }
}

function createSummaryFile(p_arr) {
    let str = "";
    p_arr.forEach(function (item) {
        str += `console.log(\"${item}\");\n`;
    });
    // for (var i in p_arr)
    //     str += `Console.log(${i)});\n`;
    return str;
}
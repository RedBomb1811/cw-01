let fs = require('fs');
let pathLib = require('path');
let path = "";
if (process.argv.length >= 3)
    path = process.argv[2];
else
    path = "D:\\temp2\\";
let newDir = path + path.split("\\").slice(-2, -1).pop();
startDoWork(path);
fs.watch(path, function (eventType, fileName) {
    if(fileName)
        fs.appendFile(newDir+"\\watcher.log", `${new Date().toString()} || ${fileName} >>> ${eventType}` + '\n', function (err) {
            if (err) throw err;
        })
})

function startDoWork(p_path) {
    if (fs.existsSync(`${p_path}\\summary.js`))
        fs.unlink(p_path + "\\summary.js", function (err) {
            if (err) throw err;
        });
    if (fs.existsSync(newDir)) {
        let files = fs.readdirSync(newDir);
        for (let i in files) {
            fs.unlinkSync(newDir + "\\" + files[i]);
        }
        fs.rmdir(newDir, function (err) {
            if (err) throw err;
        });
    }
    fs.mkdir(newDir, function () {
        doWork(p_path);
    });
}

function doWork(p_path) {
    let files = fs.readdirSync(p_path);
    let copyright;
    fs.readFile("D:\\Работы\\5 семестр\\Node.js\\Labs\\Laba1\\cw-01\\config.json", "utf-8", function (err, data) {
        if (err) throw err;
        copyright = JSON.parse(data).copyright;
        for (let i in files) {
            let name = p_path + files[i];
            fs.stat(name, function (err, statObj) {
                if (err) throw err;
                if (statObj.isDirectory()) {
                    doWork(name + "\\");
                } else {
                    if (pathLib.extname(name) === ".txt") {
                        let newFilePath = newDir + "\\" + pathLib.basename(name);
                        fs.copyFile(name, newFilePath, function (err) {
                            if (err) throw err;
                            fs.appendFile(`${newFilePath}`, `\nCopyright: ${copyright}`, function (err) {
                                if (err) throw err;
                            });
                        });
                    }
                    fs.appendFile(`${path}summary.js`, `console.log(\"${("\\" + name.substring(path.length)).replace(/\\/g, "\\\\")}\");\n`, function (err) {
                        if (err) throw err;
                    });
                }
            });
        }
    });
}
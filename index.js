"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameters = void 0;
exports.readData = readData;
var vscode = require("vscode");
exports.Parameters = ["opt", "req"];
function readData(context) {
    return new Promise(function (res, rej) {
        var mug = {
            trigger: {},
            sctrl: {}
        };
        var datapath = vscode.Uri.joinPath(context.extension.extensionUri, "out/data/data.tsv");
        vscode.workspace.fs.readFile(datapath).then(function (array) {
            var data = Buffer
                .from(array)
                .toString("utf-8");
            var lines = data
                .split(/(?:\r\n|\n)/)
                .filter(function (x) { return x.length > 0; });
            var obj;
            var doc;
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                var fields = line.split("\t");
                if (fields.length >= 1) {
                    var command = fields[0];
                    var key = command;
                    switch (command) {
                        case "sctrl":
                        case "trigger":
                            obj = {
                                doc: "",
                                ikgo: fields[2] === "ikgo"
                            };
                            mug[command][fields[1]] = obj;
                            break;
                        case "opt":
                        case "req":
                            var item = {
                                name: fields[1],
                                value: []
                            };
                            for (var i = fields.length - 1; i > 1; i--) {
                                item.value.unshift(fields[i]);
                            }
                            if (obj) {
                                if (obj[key]) {
                                    obj[key].push(item);
                                }
                                else {
                                    obj[key] = [item];
                                }
                            }
                            break;
                        case "docbgn":
                            doc = "";
                            break;
                        case "docend":
                            if (obj)
                                obj.doc = doc === null || doc === void 0 ? void 0 : doc.trim();
                            doc = undefined;
                            break;
                        default:
                            if (doc != null) {
                                doc += line.trim() + "\n";
                            }
                            else {
                                if (obj)
                                    obj[key] = fields[1];
                            }
                            break;
                    }
                }
            }
            res(mug);
        }, rej);
    });
}

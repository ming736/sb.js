let isNode = typeof window === "undefined"

var sb = {}

function extend(base, ex) {
    for (var key in ex) {
        if (ex.hasOwnProperty(key)) {
            base[key] = ex[key];
        }
    }
}
if (isNode) {
    sb.canvas = require('canvas').createCanvas;
    exports.sb = sb;
}

/*sb.Project = function (pathOrBuffer) {
    if (typeof pathOrBuffer === 'string') { 
        this.path = pathOrBuffer;
    } else {
        this.buffer = pathOrBuffer;
    }
    this.stage = null;
    this.info = null;
};*/
/**
 * @typedef {Object} ProjectInfo
 * @property {string?} derived-from Possibly the original filename.
 * @property {string?} history The history data.
 * @property {string?} comment The project author's comment about the project. More commonly known as the `Project Notes` or `Notes and Credits`.
 * @property {import("canvas").Canvas?} thumbnail The project's thumbnail.
 * @property {string?} author The project's author.
 * @property {string?} organization The organization that created this project.
 * @property {string?} os-version The OS version.
 * @property {string?} language The language code used when this project was last saved.
 * @property {string?} platform The platform used when this project was last saved.
 * @property {string?} scratch-version The version of `Scratch` that was used to save this project.
 */
/**
 * @typedef {Object} BaseSprite
 * @property {string} objName The name of this sprite.
 * @property {Array<Sound>} sounds The sounds that this sprite has.
 * @property {Array<Costume>} costumes The costumes that this sprite has.
 * @property {number} currentCostumeIndex The current costume index.
 * @property {Array<Variable>} variables The variables this sprite has.
 * @property {Array<object>} lists The lists this sprite has.
 * @property {Array<object>} scripts The scripts this sprite has.
 * @property {number} volume The current sound volume of this sprite.
 * @property {number} tempoBPM
 */
/**
 * @typedef {Object} UserClassObject
 * @property {number} id The id of this `UserClassObject`.
 * @property {number} version The version of this `UserClassObject`.
 * @property {Array} fields The fields that this `UserClassObject` has.
 */
/**
 * @typedef {Object} UnparsedMorph
 * @property {number} id
 * @property {number} version
 * @property {Array<any>} fields
 */
/**
 * @typedef {Object} Stage
 * @property {"Stage" | "Background"} objName The name of the stage.
 * @property {Array<Sound>} sounds The sounds that the stage has.
 * @property {Array<Costume>} costumes The costumes that the stage has.
 * @property {number} currentCostumeIndex The current backdrop index.
 * @property {Array<Variable>} variables The variables the stage has.
 * @property {Array<object>} lists The lists the stage has.
 * @property {Array<object>} scripts The scripts the stage has.
 * @property {number} volume The current sound volume of the stage.
 * @property {number} tempoBPM
 * @property {Array<Sprite | UnparsedMorph>} children Contains every `Sprite` in the project.
 */
/**
 * @typedef {Object} Sprite
 * @property {string} objName The name of this sprite.
 * @property {Array<Sound>} sounds The sounds that this sprite has.
 * @property {Array<Costume>} costumes The costumes that this sprite has.
 * @property {number} currentCostumeIndex The current costume index.
 * @property {Array<Variable>} variables The variables this sprite has.
 * @property {Array<object>} scripts The scripts this sprite has.
 * @property {number?} volume The current sound volume of this sprite.
 * @property {number?} tempoBPM
 * @property {number} scratchX The X position of this sprite.
 * @property {number} scratchY The Y position of this sprite.
 * @property {number} scale The scale value of this sprite.
 * @property {number} direction The direction this sprite is pointing in.
 * @property {"normal" | string} rotationStyle The rotation style of this sprite.
 * @property {boolean?} isDraggable Whether or not this sprite can be dragged around.
 * @property {number} indexInLibrary The sprite's index in the library. If it was not taken from the library, this will have a value of `-1`.
 * @property {boolean} visible Whether or not the sprite is currently visible.
 * @property {object?} lists This sprite's lists.
 */
/**
 * @typedef {Object} Variable
 * @property {string} name The name of this variable.
 * @property {any} value The value of this variable.
 * @property {boolean} isPersistent
 */
/**
 * @typedef {Object} Costume
 * @property {string} costumeName The name of this costume.
 * @property {number} rotationCenterX
 * @property {number} rotationCenterY
 * @property {import("canvas").Canvas} image
 */
/**
 * Not implemented
 * @typedef {Object} Sound
 * @property {string} soundName The name of this sound.
 * @property {null} sound Not implemented.
 */

class Project {
    /**
     * @type {ProjectInfo | null}
     */
    info;
    /**
     * @type {Stage | null}
     */
    stage;
    /**
     * @type {string?}
     */
    path;
    /**
     * @type {Buffer?}
     */
    buffer;
    constructor(pathOrBuffer) {
        if (typeof pathOrBuffer === 'string') {
            this.path = pathOrBuffer;
        } else {
            this.buffer = pathOrBuffer;
        }
        this.stage = null;
        this.info = null;
    };
    /**
     * @warn This method will be deprecated in v1.0.
     * @param {Function} onload 
     */
    open(onload) {
        var self = this;
        if (this.path) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.path, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                self.read(xhr.response, onload);
            };
            xhr.send();
        } else {
            this.read(this.buffer, onload);
        }
    };
    /**
     * @warn This method will be deprecated in v1.0.
     */
    read(data, onload) {
        var stream = new sb.ReadStream(data);
        let head = stream.utf8(8)
        if (head === 'ScratchV') {
            if (Number(stream.utf8(2) > 0)) {
                this.read1(stream, onload);
                return;
            }
        } else {
            stream.set(0);
            if (stream.utf8(2) === 'PK') {
                stream.set(0);
                this.read2(stream, onload);
                return;
            }
        }
        if (head === "BloxExpV") {
            this.read1(stream, onload);
            return;
        }
        if (!onload) {
            throw new Error("Unknown project file")
            //return false
        }
        onload(false);
    };
    /**
     * @warn This method will be deprecated in v1.0.
     */
    read1(stream, onload) {
        stream.uint32();
        var ostream = new sb.ObjectStream(stream);
        this.info = ostream.readObject();
        this.stage = ostream.readObject();
        if (onload) {
            onload(true);
        } else {
            return true
        }
    };
    /**
     * @warn This method will be deprecated in v1.0.
     */
    read2(stream, onload) {
        var array = stream.uint8array,
            string = '',
            i;
        for (i = 0; i < array.length; i++) {
            string += String.fromCharCode(array[i]);
        }
        var zip = new JSZip(string, { base64: false });
        var images = zip.file(/[0-9]+\.png/).sort(function (a, b) {
            return parseInt(a.name, 10) - parseInt(b.name, 10);
        }).map(function (file) {
            var canvas = sb.createCanvas(1, 1);
            var image = new Image();
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(image, 0, 0);
            };
            image.src = 'data:image/png;base64,' + btoa(file.data);
            return canvas;
        });
        var fixImages = function (costumes) {
            var i = costumes.length;
            while (i--) {
                var obj = costumes[i];
                obj.image = images[obj.baseLayerID - 1];
                delete obj.baseLayerID;
                delete obj.baseLayerMD5;
            }
        };
        var stage = JSON.parse(zip.file('project.json').data);
        fixImages(stage.costumes);

        var children = stage.children;
        i = children.length;
        while (i--) {
            if (children[i].costumes) {
                fixImages(children[i].costumes);
            }
        }

        var defaults = {
            variables: [],
            volume: 100, // TODO: is this in sb2?
            tempoBPM: 60
        };
        var sprites = stage.children.filter(function (child) {
            return child.objName;
        });

        sprites.concat([stage]).forEach(function (object) {
            Object.keys(defaults).forEach(function (d) {
                if (!object[d]) {
                    object[d] = defaults[d];
                }
            })
        });

        this.info = stage.info;
        delete stage.info;
        this.stage = stage;

        if (onload) {
            onload(true);
        } else {
            return true
        }
    };
    save1() {
        var stream = new sb.WriteStream();
        var objectStream = new sb.ObjectStream(stream);

        stream.utf8('ScratchV02');

        var sizeIndex = stream.index;
        stream.uint32(0);

        var self = this;
        var size = objectStream.writeObject(Object.keys(this.info).map(function (key) {
            return [key, self.info[key]];
        }), 24, function (key, value) {
            return [14, ['penTrails', 'thumbnail'].indexOf(key) === -1 ? 14 : 34];
        });
        var end = stream.index;
        stream.index = sizeIndex;
        stream.uint32(size);
        stream.index = end;

        objectStream.writeObject(this.stage, 125);

        return stream.bytes();
    }
}

class ReadStream {
    constructor(arraybuffer) {
        this.buffer = arraybuffer;
        this.index = 0;
        this.uint8array = new Uint8Array(this.buffer);
    };
    set(index) {
        this.index = index;
    };
    skip(i) {
        this.index += i;
    };
    utf8(length) {
        var string = '';
        for (var i = 0; i < length; i++) {
            string += String.fromCharCode(this.uint8());
        }
        return string;
    };
    arrayBuffer(length, reverse) {
        if (reverse) {
            var array = new Uint8Array(length);
            var i = length;
            while (i--) {
                array[i] = this.uint8();
            }
            return array.buffer;
        }
        return this.buffer.slice(this.index, this.index += length);
    };
    uint8() {
        return this.uint8array[this.index++];
    };
    int8() {
        var i = this.uint8();
        return i > 0x7f ? i - 0x100 : i;
    };
    uint16() {
        return this.uint8() << 8 | this.uint8();
    };
    int16() {
        var i = this.uint16();
        return i > 0x7fff ? i - 0x10000 : i;
    };
    uint24() {
        return this.uint8() << 16 | this.uint8() << 8 | this.uint8();
    };
    uint32() {
        return this.uint8() * 0x1000000 + (this.uint8() << 16) + (this.uint8() << 8) + this.uint8();
    };
    int32() {
        var i = this.uint32();
        return i > 0x7fffffff ? i - 0x100000000 : i;
    };
    float64() {
        return new Float64Array(this.arrayBuffer(8, true))[0];
    }
}
class WriteStream {
    constructor() {
        this.allocated = 1024;
        this.index = 0;
        this.array = new Uint8Array(this.allocated);
    };
    allocate(size) {
        if (size + this.index < this.allocated) {
            return;
        }
        var total = size + this.index;
        while (this.allocated < total) {
            this.allocated <<= 1;
        }
        var newArray = new Uint8Array(this.allocated);
        newArray.set(this.array, 0);
        this.array = newArray;
    };
    bytes() {
        return new Uint8Array(this.array.buffer, 0, this.index);
    };
    utf8(string) {
        for (var i = 0; i < string.length; i++) {
            this.uint8(string.charCodeAt(i));
        }
    };
    arrayBuffer(buffer, reverse) {
        var array = new Uint8Array(buffer);
        if (reverse) {
            var i = array.length;
            while (i--) {
                this.uint8(array[i]);
            }
            return;
        }
        this.allocate(array.length);
        this.array.set(array, this.index);
        this.index += array.length;
    };
    uint8(n) {
        this.allocate(1);
        this.array[this.index++] = n;
    };
    int8(n) {
        this.uint8(n > 0x7f ? i - 0xff : n);
    };
    uint16(n) {
        this.uint8(n >> 8 & 0xff);
        this.uint8(n & 0xff);
    };
    int16(n) {
        this.uint16(n > 0x7fff ? n - 0xffff : n);
    };
    uint24(n) {
        this.uint8(n >> 16 & 0xff);
        this.uint8(n >> 8 & 0xff);
        this.uint8(n & 0xff);
    };
    uint32(n) {
        this.uint8(n >> 24 & 0xff);
        this.uint8(n >> 16 & 0xff);
        this.uint8(n >> 8 & 0xff);
        this.uint8(n & 0xff);
    };
    int32(n) {
        this.uint32(n > 0x7fffffff ? n - 0xffffffff : n);
    };
    float64(n) {
        var b = new Float64Array(1);
        b[0] = n;
        this.arrayBuffer(b.buffer, true);
    }
}
class ObjectStream {
    changingIds = [
        30, 31, // colors
        34, 35  // forms
    ];
    formats = {
        20: {
            write: function (object, table, hint) {
                var self = this;
                return object.map(function (value, i) {
                    var id = hint || null;
                    if (id) {
                        id = Array.isArray(id) ? (id[i]) : id;
                        id = typeof id === 'function' ? id(value, i) : id;
                    }
                    if (id && id.id && id.hint) {
                        return self.createObject(table, value, id.id, id.hint);
                    } else {
                        return self.createObject(table, value, id);
                    }
                });
            }
        },
        21: {
            write: function (object, table, hint) {
                var self = this;
                return object.map(function (value, i) {
                    var id = hint || null;
                    if (id) {
                        id = Array.isArray(id) ? (id[i]) : id;
                        id = typeof id === 'number' ? id : keyId(value, i);
                    }
                    return self.createObject(table, value, id)
                });
            }
        },
        24: {
            write: function (object, table, hint) {
                var self = this;
                var ids;
                return object.map(function (pair, i) {
                    ids = hint || null;
                    if (ids) {
                        ids = Array.isArray(ids) ? (ids[i]) : ids;
                        ids = Array.isArray(ids) ? ids : (typeof ids === 'function' ? ids(pair[0], pair[1]) : [ids, ids]);
                    } else {
                        ids = [null, null]
                    }
                    return [self.createObject(table, pair[0], ids[0]), self.createObject(table, pair[1], ids[1])];
                });
            }
        },
        34: {
            write: function (object, table, hint) {
                return {
                    width: object.width,
                    height: object.height,
                    depth: 32,
                    offset: null,
                    bitmap: this.createObject(table, object.getContext('2d').getImageData(0, 0, object.width, object.height).data, 13)
                }
            }
        },
        124: {
            version: 3,
            read: {
                objName: 6,
                scripts: function (fields) {
                    var scripts = fields[8];
                    return scripts.map(function (script) {
                        return [script[0].x, script[0].y, sb.buildScript(script[1])];
                    });
                },
                sounds: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 164;
                    });
                },
                costumes: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    });
                },
                currentCostumeIndex: function (fields, parent) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    }).indexOf(fields[11]);
                },
                scratchX: function (fields, parent) {
                    return fields[0].ox + fields[11].fields[2].x - parent.fields[0].cx / 2;
                },
                scratchY: function (fields, parent) {
                    return parent.fields[0].cy / 2 - (fields[0].oy + fields[11].fields[2].y);
                },
                scale: function (fields) {
                    return fields[13].x;
                },
                direction: function (fields, parent) {
                    return fields[14] + 90;
                },
                rotationStyle: 15,
                isDraggable: 18,
                indexInLibrary: function (fields, parent) {
                    var library = parent.fields[16];
                    if (!library) {
                        return -1;
                    }
                    var i = library.length;
                    while (i--) {
                        if (library[i].fields === fields) {
                            return i;
                        }
                    }
                    return -1;
                },
                visible: function (fields) {
                    return !(fields[4] & 1);
                },
                variables: function (fields) {
                    var vars = fields[7];
                    var varNames = Object.keys(vars);
                    return varNames.map(function (d) {
                        return {
                            name: d,
                            value: vars[d],
                            isPersistent: false
                        };
                    });
                },
                lists: 20,
                volume: 16,
                tempoBPM: 17
            },
            write: [
                function (object, table) { // bounds
                    var costume = object.costumes[object.currentCostumeIndex];
                    var x = object.scratchX - costume.rotationCenterX;
                    var y = object.scratchY - costume.rotationCenterY;
                    return this.createObject(table, {
                        ox: x,
                        oy: y,
                        cx: x + costume.image.width,
                        cy: y + costume.image.height
                    }, 33);
                },
                function (object, table) { // owner
                    return this.createObject(table, this.object, 125);
                },
                function (object, table) { // submorphs
                    return this.createObject(table, [], 20);
                },
                function (object, table) { // color
                    return this.createObject(table, {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 255
                    }, 30);
                },
                0, // flags
                null, // nil
                function (object, table) { // objName
                    return this.createObject(table, object.objName, 14);
                },
                function (object, table) { // vars
                    return this.createObject(table, object.variables.map(function (v) {
                        return [v.name, v.value];
                    }), 24, function (key, value) {
                        return [14, typeof value === 'number' ? null : 14];
                    });
                },
                sb.blocksBinWrite, // blocksBin
                false, // isClone
                function (object, table) { // media
                    return this.createObject(table, object.costumes, 20, 162);
                },
                function (object, table) { // costume
                    return this.createObject(table, object.costumes[object.currentCostumeIndex], 162);
                },
                100, // visibility
                function (object, table) { // scalePoint
                    return this.createObject(table, {
                        x: 1,
                        y: 1
                    }, 32);
                },
                function (object, table) { // rotationDegrees
                    return object.direction - 90;
                },
                function (object, table) { // rotationStyle
                    return this.createObject(table, object.rotationStyle, 10);
                },
                function (object, table) { // volume
                    return object.volume;
                },
                function (object, table) { // tempoBPM
                    return object.tempoBPM;
                },
                function (object, table) { // draggable
                    return object.isDraggable;
                },
                function (object, table) { // sceneStates
                    return this.createObject(table, [], 24);
                },
                function (object, table) { // lists
                    return this.createObject(table, [], 24);
                }
            ]
        },
        125: {
            version: 5,
            read: {
                objName: 6,
                sounds: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 164;
                    });
                },
                costumes: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    });
                },
                currentCostumeIndex: function (fields, parent) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    }).indexOf(fields[11]);
                },
                children: 2,
                variables: function (fields) {
                    var vars = fields[7];
                    var varNames = Object.keys(vars);
                    return varNames.map(function (d) {
                        return {
                            name: d,
                            value: vars[d],
                            isPersistent: false
                        };
                    });
                },
                lists: function (fields) {
                    var lists = fields[20];
                    if (!lists) {
                        return []
                    }
                    var listNames = Object.keys(lists);
                    return listNames.map(function (d) {
                        return lists[d];
                    });
                },
                scripts: function (fields) {
                    var scripts = fields[8];
                    return scripts.map(function (script) {
                        return [script[0].x, script[0].y, sb.buildScript(script[1])];
                    });
                },
                volume: 17,
                tempoBPM: 18
            },
            write: [
                function (object, table) { // bounds
                    // TODO: Dynamic size
                    return this.createObject(table, {
                        ox: 0,
                        oy: 0,
                        cx: 480,
                        cy: 360,
                    }, 33);
                },
                null, // owner
                function (object, table) { // submorphs
                    return this.createObject(table, object.children, 20, 124);
                },
                function (object, table) { // color
                    return this.createObject(table, {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 255
                    }, 30);
                },
                0, // flags
                null, // nil
                function (object, table) { // objName
                    return this.createObject(table, object.objName, 14);
                },
                function (object, table) { // vars
                    return this.createObject(table, object.variables.map(function (v) {
                        return [v.name, v.value];
                    }), 24, function (key, value) {
                        return [14, typeof value === 'number' ? null : 14];
                    });
                },
                sb.blocksBinWrite, // blocksBin
                false, // isClone
                function (object, table) { // media
                    return this.createObject(table, object.costumes, 21, 162);
                },
                function (object, table) { // costume
                    return this.createObject(table, object.costumes[object.currentCostumeIndex], 162);
                },
                1, // zoom
                0, // hPan
                0, // vPan
                null, // obsoleteSavedState
                function (object, table) { // sprites
                    return this.createObject(table, [], 21);
                },
                function (object, table) { // volume
                    return object.volume;
                },
                function (object, table) { // tempoBPM
                    return object.tempoBPM;
                },
                function (object, table) { // sceneStates
                    return this.createObject(table, [], 24);
                }
            ]
        },
        155: {
            read: {
                objName: function (fields) {
                    return fields[19] ?? fields[13].fields[8]
                },
                displayName: function (fields) {
                    return fields[13].fields[8]
                }
            },
            write: []
        },
        162: {
            read: {
                costumeName: 0,
                rotationCenterX: function (fields) {
                    return fields[2].x;
                },
                rotationCenterY: function (fields) {
                    return fields[2].y;
                },
                image: function (fields) {
                    return (fields[6] || fields[1]);
                }
            },
            write: [
                function (object, table) { // mediaName
                    return this.createObject(table, object.costumeName, 14);
                },
                function (object, table) { // form
                    return this.createObject(table, object.image, 34);
                },
                function (object, table) { // rotationCenter
                    return this.createObject(table, {
                        x: object.rotationCenterX,
                        y: object.rotationCenterY
                    }, 32);
                },
                null, // textBox
                null, // jpegBytes
                null // compositeForm
                // TODO: Implement textBox/compositeForm?
            ]
        },
        164: { // TODO: implement sound
            read: {
                soundName: 0,
                sound: null
            },
            write: [

            ]
        },
        175: {
            read: {
                listName: 8,
                contents: 9,
                isPersistent: false,
                target: function (fields) {
                    return fields[10].fields[6];
                },
                x: function (fields) {
                    return fields[0].ox;
                },
                y: function (fields) {
                    return fields[0].oy;
                },
                width: function (fields) {
                    return fields[0].cx - fields[0].ox;
                },
                height: function (fields) {
                    return fields[0].cy - fields[0].oy;
                },
                visible: function (fields) {
                    return !!fields[1];
                }
            },
            write: [

            ]
        }
    }

    constructor(stream) {
        this.stream = stream;
    };

    writeObject(object, id, hint) {
        var start = this.stream.index;
        this.stream.utf8('ObjS\x01Stch\x01');

        var table = [];
        table.raw = [];

        this.object = object;

        this.createObject(table, object, id, hint);

        this.stream.uint32(table.length);

        var self = this;
        table.forEach(function (object) {
            self.writeTableObject(object);
        });

        delete this.object;

        return this.stream.index - start;
    };
    createObject(table, object, id, hint) {
        if (!id) {
            return object;
        }
        var i = table.raw.indexOf(object);
        if (i !== -1 && typeof object === 'object') {
            return { $: i + 1 };
        }
        table.raw.push(object);
        var record = {
            id: id
        };
        table.push(record);
        var ref = { $: table.length };

        var format = this.formats[id];
        if (format) {
            var self = this;
            if (id < 99) {
                record.value = format.write.call(this, object, table, hint);
            } else {
                record.version = format.version;
                record.value = format.write.map(function (field) {
                    return typeof field === 'function' ? field.call(self, object, table) : field;
                });
            }
        } else {
            record.value = object;
        }
        return ref;
    };
    writeTableObject(object) {
        if (this.changingIds.indexOf(object.id) === -1) {
            this.stream.uint8(object.id);
        }

        if (object.id < 99) {
            this.writeFixedFormat(object);
        } else {
            this.writeUserFormat(object);
        }
    };
    writeUserFormat(object) {
        this.stream.uint8(object.version);
        this.stream.uint8(object.value.length);

        var self = this;
        object.value.forEach(function (field) {
            self.writeInline(field);
        });
    };
    writeFixedFormat(object) {
        var self = this;
        switch (object.id) {
            case 9:
            case 10:
            case 14:
                this.stream.uint32(object.value.length);
                this.stream.utf8(object.value); // TODO: Non-utf8 store
                break;
            case 13: // Bitmap
                this.stream.uint32(object.value.length / 4);
                var array = new Uint8Array(object.value);
                var i = 0;
                while (i < array.length) {
                    this.stream.uint8(array[i + 3]);
                    this.stream.uint8(array[i + 0]);
                    this.stream.uint8(array[i + 1]);
                    this.stream.uint8(array[i + 2]);
                    i += 4;
                }
                break;
            case 20: // Array
            case 21: // OrderedCollection
                this.stream.uint32(object.value.length);
                object.value.forEach(function (field) {
                    self.writeInline(field);
                });
                break;
            case 24: // Dictionary
            case 25: // IdentityDictionary
                this.stream.uint32(object.value.length);
                object.value.forEach(function (pair) {
                    self.writeInline(pair[0]);
                    self.writeInline(pair[1]);
                });
                break;
            case 30: // Color
            case 31: // TranslucentColor
                var c = object.value;
                this.stream.uint8(c.a === 255 ? 30 : 31);
                this.stream.uint32(c.r << 22 | c.g << 12 | c.b << 2);
                if (c.a !== 255) {
                    this.stream.uint8(c.a);
                }
                break;
            case 32: // Point
                this.writeInline(object.value.x);
                this.writeInline(object.value.y);
                break;
            case 33: // Rectangle
                this.writeInline(object.value.ox);
                this.writeInline(object.value.oy);
                this.writeInline(object.value.cx);
                this.writeInline(object.value.cy);
                break;
            case 34: // Form
            case 35: // ColorForm
                var colorForm = !!object.value.colors;
                this.stream.uint8(colorForm ? 35 : 34);
                this.writeInline(object.value.width);
                this.writeInline(object.value.height);
                this.writeInline(object.value.depth);
                this.writeInline(object.value.offset);
                this.writeInline(object.value.bitmap);
                if (colorForm) {
                    this.writeInlint(object.value.colors);
                }
                break;
            default:
                console.warn('No fixed format write for id', object.id);
        }
    };
    writeInline(object) {
        var id;
        if (object && object.$) { // ObjectRef
            id = 99;
        } else if (object === null) {
            id = 1;
        } else if (object === true) {
            id = 2;
        } else if (object === false) {
            id = 3;
        } else if (typeof object === 'number') {
            if (object !== Math.floor(object)) {
                id = 8;
            } else if (object >= -0x10000 && object <= 0xffff) {
                id = 5;
            } else if (object >= -0x100000000 && object <= 0xffffffff) {
                id = 4;
            } else {
                id = object < 0 ? 7 : 6;
            }
        } else {
            console.warn('Cannot determine type of', object);
        }

        this.stream.uint8(id);

        switch (id) {
            case 4: // SmallInteger
                this.stream.int32(object);
                break;
            case 5: // SmallInteger16
                this.stream.int16(object);
                break;
            case 6:
            case 7:
            // TODO: large numbers
            case 8:
                this.stream.float64(object);
                break;
            case 99:
                this.stream.uint24(object.$);
                break;
        }
    };
    readObject() {
        let objHeader = this.stream.utf8(10)
        if (objHeader !== 'ObjS\x01Stch\x01') {
            throw new Error(`${objHeader.toString("utf-8")} is not an object`);
        }
        var size = this.stream.uint32();

        var table = [];

        var i = size;
        while (i--) {
            table.push(this.readTableObject());
        }

        i = size;
        while (i--) {
            this.fixObjectRefs(table, table[i]);
        }

        return this.jsonify(this.deRef(table, table[0]));
    };
    readTableObject() {
        var id = this.stream.uint8();
        if (id < 99) {
            return {
                id: id,
                object: this.readFixedFormat(id)
            };
        }
        return this.readUserFormat(id);
    };
    readUserFormat(id) {
        var object = {
            id: id,
            version: this.stream.uint8(),
            fields: []
        };
        var i = this.stream.uint8();
        while (i--) {
            object.fields.push(this.readInline());
        }
        return object;
    };
    readFixedFormat(id) {
        var array,
            i,
            color,
            canvas;
        switch (id) {
            case 9: // String
            case 10: // Symbol
            case 14: // Utf8
                return this.stream.utf8(this.stream.uint32());
            case 11: // ByteArray
                return new Uint8Array(this.stream.arrayBuffer(this.stream.uint32()));
            case 12: // SoundBuffer
                return new Uint8Array(this.stream.arrayBuffer(this.stream.uint32() * 2));
            case 13: // Bitmap
                var a = new Uint8Array(this.stream.arrayBuffer(this.stream.uint32() * 4));
                a.bitmap = true;
                return a;
            case 20: // Array
            case 21: // OrderedCollection
                array = [];
                i = this.stream.uint32();
                while (i--) {
                    array.push(this.readInline());
                }
                return array;
            case 24: // Dictionary
            case 25: // IdentityDictionary
                array = new sb.Dict();
                i = this.stream.uint32();
                while (i--) {
                    array[i] = [this.readInline(), this.readInline()];
                }
                return array;
            case 30: // Color
                color = this.stream.uint32();
                return {
                    r: color >> 22 & 0xff,
                    g: color >> 12 & 0xff,
                    b: color >> 2 & 0xff,
                    a: 255
                };
            case 31: // TranslucentColor
                color = this.stream.uint32();
                return {
                    r: color >> 22 & 0xff,
                    g: color >> 12 & 0xff,
                    b: color >> 2 & 0xff,
                    a: this.stream.uint8()
                };
            case 32: // Point
                return {
                    x: this.readInline(),
                    y: this.readInline()
                };
            case 33: // Rectangle
                return {
                    ox: this.readInline(),
                    oy: this.readInline(),
                    cx: this.readInline(),
                    cy: this.readInline()
                };
            case 34: // Form
                var canvas = sb.createCanvas(1, 1);
                extend(canvas, {
                    width: this.readInline(),
                    height: this.readInline(),
                    depth: this.readInline(),
                    offset: this.readInline(),
                    bitmap: this.readInline()
                });
                return canvas;
            case 35: // ColorForm
                var canvas = sb.createCanvas(1, 1);
                extend(canvas, {
                    width: this.readInline(),
                    height: this.readInline(),
                    depth: this.readInline(),
                    offset: this.readInline(),
                    bitmap: this.readInline(),
                    colors: this.readInline()
                });
                return canvas;
        }
        throw new Error('Unknown fixed format class ' + id);
    };
    readInline() {
        var id = this.stream.uint8();
        switch (id) {
            case 1: // nil
                return null;
            case 2: // True
                return true;
            case 3: // False
                return false;
            case 4: // SmallInteger
                return this.stream.int32();
            case 5: // SmallInteger16
                return this.stream.int16();
            case 6: //LargePositiveInteger
            case 7: //LargeNegativeInteger
                var d1 = 0;
                var d2 = 1;
                var i = this.stream.uint16();
                while (i--) {
                    var k = this.stream.uint8();
                    d1 += d2 * k;
                    d2 *= 256;
                }
                return id == 7 ? -d1 : d1;
            case 8: // Float
                return this.stream.float64();
            case 99:
                return {
                    isRef: true,
                    index: this.stream.uint24()
                };
        }
        throw new Error('Unknown inline class ' + id);
    };
    fixObjectRefs(table, object) {
        var id = object.id;
        if (id < 99) {
            this.fixFixedFormat(table, object);
            return;
        }
        var fields = object.fields;
        var i = fields.length;
        while (i--) {
            fields[i] = this.deRef(table, fields[i]);
        }
    };
    fixFixedFormat(table, object) {
        var id = object.id,
            fields,
            i;
        switch (id) {
            case 20:
            case 21:
                fields = object.object;
                i = fields.length;
                while (i--) {
                    fields[i] = this.deRef(table, fields[i]);
                }
                break;
            case 24:
            case 25:
                fields = object.object;
                i = 0;
                while (fields[i]) {
                    fields[this.deRef(table, fields[i][0])] = this.deRef(table, fields[i][1]);
                    delete fields[i];
                    i++;
                }
                break;
            case 34:
                object.object.bitmap = this.deRef(table, object.object.bitmap);
                this.buildImage(object.object);
                break;
            case 35:
                object.object.bitmap = this.deRef(table, object.object.bitmap);
                object.object.colors = this.deRef(table, object.object.colors);
                this.buildImage(object.object);
                break;
        }
    };
    deRef(table, object) {
        if (object && object.isRef) {
            var obj = table[object.index - 1];
            return typeof obj.object === 'undefined' ? obj : obj.object;
        }
        return object && object.object || object;
    };
    buildImage(image) {
        var bitmap = image.bitmap;

        var canvas = image;
        var ctx = canvas.getContext('2d');

        var data = ctx.createImageData(image.width, image.height);

        if (image.depth === 32) {
            if (!bitmap.bitmap) {
                this.decompressBitmapFlip(bitmap, data.data);
            }
        } else if (image.depth <= 8) {
            var indexes = bitmap.bitmap ? bitmap : this.decompressBitmap(bitmap);

            var bits;


            var i,
                j = 0,
                k, l;

            if (image.depth === 8) {
                bits = indexes;
            } else {
                bits = new Uint8Array(indexes.length * (8 / image.depth));

                var mask = (1 << image.depth) - 1;

                var parts = 8 / image.depth;

                for (i = 0; i < indexes.length; i++) {
                    l = indexes[i];
                    k = 8;
                    while ((k -= image.depth) >= 0) {
                        bits[j++] = (l >> k) & mask;
                    }
                }
            }

            var colors = image.colors || this.squeakColors;
            var array = data.data;

            i = 0;
            j = 0;

            var c, b;

            k = array.length;
            while (k--) {
                c = colors[bits[j++]];
                if (c) {
                    array[i++] = c.r;
                    array[i++] = c.g;
                    array[i++] = c.b;
                    array[i++] = c.a === 0 ? 0 : 0xff;
                } else {
                    i += 4;
                }
            }
        }

        ctx.putImageData(data, 0, 0);

        return canvas;
    };
    decompressBitmapFlip(src, out) {
        var stream = new sb.ReadStream(src.buffer);
        var nInt = function () {
            var i = stream.uint8();
            return i <= 223 ? i : (i <= 254 ? (i - 224) * 256 + stream.uint8() : stream.uint32());
        };
        var length = nInt() * 4;
        if (!out) {
            out = new Uint8Array(length);
        }

        var j, k, l, m, n, i = 0;

        while (i < length) {
            k = nInt();
            l = k >> 2;
            switch (k & 3) {
                case 0:
                    i += 4;
                    break;
                case 1:
                    m = stream.uint8();
                    while (l--) {
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                    }
                    break;
                case 2:
                    m = [stream.uint8(), stream.uint8(), stream.uint8(), stream.uint8()];
                    while (l--) {
                        out[i++] = m[1];
                        out[i++] = m[2];
                        out[i++] = m[3];
                        out[i++] = m[0];
                    }
                    break;
                case 3:
                    while (l--) {
                        n = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = n;
                    }
                    break;
            }
        }
    };
    decompressBitmap(src) {
        var stream = new sb.ReadStream(src.buffer);
        var nInt = function () {
            var i = stream.uint8();
            return i <= 223 ? i : (i <= 254 ? (i - 224) * 256 + stream.uint8() : stream.uint32());
        };
        var length = nInt() * 4;
        var out = new Uint8Array(length);

        var j, k, l, m, n, i = 0;

        while (i < length) {
            k = nInt();
            l = k >> 2;
            switch (k & 3) {
                case 0:
                    i += 4;
                    break;
                case 1:
                    m = stream.uint8();
                    while (l--) {
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                    }
                    break;
                case 2:
                    m = [stream.uint8(), stream.uint8(), stream.uint8(), stream.uint8()];
                    while (l--) {
                        out[i++] = m[0];
                        out[i++] = m[1];
                        out[i++] = m[2];
                        out[i++] = m[3];
                    }
                    break;
                case 3:
                    while (l--) {
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                    }
                    break;
            }
        }
        return out;
    };
    fixObjectRefs(table, object) {
        var id = object.id;
        if (id < 99) {
            this.fixFixedFormat(table, object);
            return;
        }
        var fields = object.fields;
        var i = fields.length;
        while (i--) {
            fields[i] = this.deRef(table, fields[i]);
        }
    };
    fixFixedFormat(table, object) {
        var id = object.id,
            fields,
            i;
        switch (id) {
            case 20:
            case 21:
                fields = object.object;
                i = fields.length;
                while (i--) {
                    fields[i] = this.deRef(table, fields[i]);
                }
                break;
            case 24:
            case 25:
                fields = object.object;
                i = 0;
                while (fields[i]) {
                    fields[this.deRef(table, fields[i][0])] = this.deRef(table, fields[i][1]);
                    delete fields[i];
                    i++;
                }
                break;
            case 34:
                object.object.bitmap = this.deRef(table, object.object.bitmap);
                this.buildImage(object.object);
                break;
            case 35:
                object.object.bitmap = this.deRef(table, object.object.bitmap);
                object.object.colors = this.deRef(table, object.object.colors);
                this.buildImage(object.object);
                break;
        }
    };
    deRef(table, object) {
        if (object && object.isRef) {
            var obj = table[object.index - 1];
            return typeof obj.object === 'undefined' ? obj : obj.object;
        }
        return object && object.object || object;
    };
    buildImage(image) {
        var bitmap = image.bitmap;

        var canvas = image;
        var ctx = canvas.getContext('2d');

        var data = ctx.createImageData(image.width, image.height);

        if (image.depth === 32) {
            if (!bitmap.bitmap) {
                this.decompressBitmapFlip(bitmap, data.data);
            }
        } else if (image.depth <= 8) {
            var indexes = bitmap.bitmap ? bitmap : this.decompressBitmap(bitmap);

            var bits;


            var i,
                j = 0,
                k, l;

            if (image.depth === 8) {
                bits = indexes;
            } else {
                bits = new Uint8Array(indexes.length * (8 / image.depth));

                var mask = (1 << image.depth) - 1;

                var parts = 8 / image.depth;

                for (i = 0; i < indexes.length; i++) {
                    l = indexes[i];
                    k = 8;
                    while ((k -= image.depth) >= 0) {
                        bits[j++] = (l >> k) & mask;
                    }
                }
            }

            var colors = image.colors || this.squeakColors;
            var array = data.data;

            i = 0;
            j = 0;

            var c, b;

            k = array.length;
            while (k--) {
                c = colors[bits[j++]];
                if (c) {
                    array[i++] = c.r;
                    array[i++] = c.g;
                    array[i++] = c.b;
                    array[i++] = c.a === 0 ? 0 : 0xff;
                } else {
                    i += 4;
                }
            }
        }

        ctx.putImageData(data, 0, 0);

        return canvas;
    };
    decompressBitmapFlip(src, out) {
        var stream = new sb.ReadStream(src.buffer);
        var nInt = function () {
            var i = stream.uint8();
            return i <= 223 ? i : (i <= 254 ? (i - 224) * 256 + stream.uint8() : stream.uint32());
        };
        var length = nInt() * 4;
        if (!out) {
            out = new Uint8Array(length);
        }

        var j, k, l, m, n, i = 0;

        while (i < length) {
            k = nInt();
            l = k >> 2;
            switch (k & 3) {
                case 0:
                    i += 4;
                    break;
                case 1:
                    m = stream.uint8();
                    while (l--) {
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                    }
                    break;
                case 2:
                    m = [stream.uint8(), stream.uint8(), stream.uint8(), stream.uint8()];
                    while (l--) {
                        out[i++] = m[1];
                        out[i++] = m[2];
                        out[i++] = m[3];
                        out[i++] = m[0];
                    }
                    break;
                case 3:
                    while (l--) {
                        n = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = n;
                    }
                    break;
            }
        }
    };
    decompressBitmap(src) {
        var stream = new sb.ReadStream(src.buffer);
        var nInt = function () {
            var i = stream.uint8();
            return i <= 223 ? i : (i <= 254 ? (i - 224) * 256 + stream.uint8() : stream.uint32());
        };
        var length = nInt() * 4;
        var out = new Uint8Array(length);

        var j, k, l, m, n, i = 0;

        while (i < length) {
            k = nInt();
            l = k >> 2;
            switch (k & 3) {
                case 0:
                    i += 4;
                    break;
                case 1:
                    m = stream.uint8();
                    while (l--) {
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                    }
                    break;
                case 2:
                    m = [stream.uint8(), stream.uint8(), stream.uint8(), stream.uint8()];
                    while (l--) {
                        out[i++] = m[0];
                        out[i++] = m[1];
                        out[i++] = m[2];
                        out[i++] = m[3];
                    }
                    break;
                case 3:
                    while (l--) {
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                    }
                    break;
            }
        }
        return out;
    };
    jsonify(object, parent) {
        var self = this,
            json;
        if (object && object.id && this.formats[object.id]) {
            var format = this.formats[object.id].read;
            json = {};
            for (var field in format) {
                var value = format[field];
                var type = typeof value;
                var tmp;
                if (type === 'number') {
                    tmp = object.fields[value];
                } else if (type === 'function') {
                    tmp = value(object.fields, parent);
                } else {
                    tmp = value;
                }

                json[field] = this.jsonify(tmp, object);
            }
            return json;
        } else if (object instanceof sb.Dict) {
            json = {};
            for (var key in object) {
                json[key] = this.jsonify(object[key], parent);
            }
            return json;
        } else if (object instanceof Array) {
            return object.map(function (d) {
                return self.jsonify(d, parent);
            });
        }
        return object;
    };
};
sb.Project = Project
sb.ReadStream = ReadStream
sb.WriteStream = WriteStream
sb.ObjectStream = ObjectStream

sb.blocksBinWrite = function (object, table) {
    function crawl(block) {
        if (typeof block !== 'object') {
            return block;
        }
        if (Array.isArray(block) && Array.isArray(block[0])) {
            return block.map(function (b) {
                return crawl(b);
            })
        } else if (sb.blocks.write[block[0]]) {
            return block = sb.blocks.write[block[0]].map(function (part) {
                return typeof part === 'number' ? block[part] : (typeof part === 'function' ? part(block) : part);
            })
        }
        return block.map(function (part) {
            if (Array.isArray(part)) {
                return crawl(part);
            }
            return part;
        });
    }
    return this.createObject(table, object.scripts.map(function (script) {
        script[2] = crawl(script[2]);
        return [{
            x: script[0],
            y: script[1]
        },
        script[2]
        ];
    }), 20, {
        id: 20,
        hint: [
            32,
            {
                id: 20,
                hint: {
                    id: 20,
                    hint: function block(object, i) {
                        if (Array.isArray(object)) {
                            return {
                                id: 20,
                                hint: block
                            };
                        }
                        var inline = [null, true, false];
                        if (inline.indexOf(object) !== -1) {
                            return null;
                        }
                        var type = typeof object;
                        if (i === 0) {
                            return 10;
                        } else if (type === 'string') {
                            return 9;
                        } else if (type === 'number') {
                            return null;
                        }
                        throw new Error('No idea');
                    }
                }
            }
        ]
    });
};

/*sb.ObjectStream = function (stream) {
    this.stream = stream;
};*/

/*extend(sb.ObjectStream.prototype, {
    writeObject: function (object, id, hint) {
        var start = this.stream.index;
        this.stream.utf8('ObjS\x01Stch\x01');

        var table = [];
        table.raw = [];

        this.object = object;

        this.createObject(table, object, id, hint);

        this.stream.uint32(table.length);

        var self = this;
        table.forEach(function (object) {
            self.writeTableObject(object);
        });

        delete this.object;

        return this.stream.index - start;
    },
    createObject: function (table, object, id, hint) {
        if (!id) {
            return object;
        }
        var i = table.raw.indexOf(object);
        if (i !== -1 && typeof object === 'object') {
            return { $: i + 1 };
        }
        table.raw.push(object);
        var record = {
            id: id
        };
        table.push(record);
        var ref = { $: table.length };

        var format = this.formats[id];
        if (format) {
            var self = this;
            if (id < 99) {
                record.value = format.write.call(this, object, table, hint);
            } else {
                record.version = format.version;
                record.value = format.write.map(function (field) {
                    return typeof field === 'function' ? field.call(self, object, table) : field;
                });
            }
        } else {
            record.value = object;
        }
        return ref;
    },
    changingIds: [
        30, 31, // colors
        34, 35  // forms
    ],
    writeTableObject: function (object) {
        if (this.changingIds.indexOf(object.id) === -1) {
            this.stream.uint8(object.id);
        }

        if (object.id < 99) {
            this.writeFixedFormat(object);
        } else {
            this.writeUserFormat(object);
        }
    },
    writeUserFormat: function (object) {
        this.stream.uint8(object.version);
        this.stream.uint8(object.value.length);

        var self = this;
        object.value.forEach(function (field) {
            self.writeInline(field);
        });
    },
    writeFixedFormat: function (object) {
        var self = this;
        switch (object.id) {
            case 9:
            case 10:
            case 14:
                this.stream.uint32(object.value.length);
                this.stream.utf8(object.value); // TODO: Non-utf8 store
                break;
            case 13: // Bitmap
                this.stream.uint32(object.value.length / 4);
                var array = new Uint8Array(object.value);
                var i = 0;
                while (i < array.length) {
                    this.stream.uint8(array[i + 3]);
                    this.stream.uint8(array[i + 0]);
                    this.stream.uint8(array[i + 1]);
                    this.stream.uint8(array[i + 2]);
                    i += 4;
                }
                break;
            case 20: // Array
            case 21: // OrderedCollection
                this.stream.uint32(object.value.length);
                object.value.forEach(function (field) {
                    self.writeInline(field);
                });
                break;
            case 24: // Dictionary
            case 25: // IdentityDictionary
                this.stream.uint32(object.value.length);
                object.value.forEach(function (pair) {
                    self.writeInline(pair[0]);
                    self.writeInline(pair[1]);
                });
                break;
            case 30: // Color
            case 31: // TranslucentColor
                var c = object.value;
                this.stream.uint8(c.a === 255 ? 30 : 31);
                this.stream.uint32(c.r << 22 | c.g << 12 | c.b << 2);
                if (c.a !== 255) {
                    this.stream.uint8(c.a);
                }
                break;
            case 32: // Point
                this.writeInline(object.value.x);
                this.writeInline(object.value.y);
                break;
            case 33: // Rectangle
                this.writeInline(object.value.ox);
                this.writeInline(object.value.oy);
                this.writeInline(object.value.cx);
                this.writeInline(object.value.cy);
                break;
            case 34: // Form
            case 35: // ColorForm
                var colorForm = !!object.value.colors;
                this.stream.uint8(colorForm ? 35 : 34);
                this.writeInline(object.value.width);
                this.writeInline(object.value.height);
                this.writeInline(object.value.depth);
                this.writeInline(object.value.offset);
                this.writeInline(object.value.bitmap);
                if (colorForm) {
                    this.writeInlint(object.value.colors);
                }
                break;
            default:
                console.warn('No fixed format write for id', object.id);
        }
    },
    writeInline: function (object) {
        var id;
        if (object && object.$) { // ObjectRef
            id = 99;
        } else if (object === null) {
            id = 1;
        } else if (object === true) {
            id = 2;
        } else if (object === false) {
            id = 3;
        } else if (typeof object === 'number') {
            if (object !== Math.floor(object)) {
                id = 8;
            } else if (object >= -0x10000 && object <= 0xffff) {
                id = 5;
            } else if (object >= -0x100000000 && object <= 0xffffffff) {
                id = 4;
            } else {
                id = object < 0 ? 7 : 6;
            }
        } else {
            console.warn('Cannot determine type of', object);
        }

        this.stream.uint8(id);

        switch (id) {
            case 4: // SmallInteger
                this.stream.int32(object);
                break;
            case 5: // SmallInteger16
                this.stream.int16(object);
                break;
            case 6:
            case 7:
            // TODO: large numbers
            case 8:
                this.stream.float64(object);
                break;
            case 99:
                this.stream.uint24(object.$);
                break;
        }
    },

    readObject: function () {
        let objHeader = this.stream.utf8(10)
        if (objHeader !== 'ObjS\x01Stch\x01') {
            throw new Error(`${objHeader.toString("utf-8")} is not an object`);
        }
        var size = this.stream.uint32();

        var table = [];

        var i = size;
        while (i--) {
            table.push(this.readTableObject());
        }

        i = size;
        while (i--) {
            this.fixObjectRefs(table, table[i]);
        }

        return this.jsonify(this.deRef(table, table[0]));
    },
    readTableObject: function () {
        var id = this.stream.uint8();
        if (id < 99) {
            return {
                id: id,
                object: this.readFixedFormat(id)
            };
        }
        return this.readUserFormat(id);
    },
    readUserFormat: function (id) {
        var object = {
            id: id,
            version: this.stream.uint8(),
            fields: []
        };
        var i = this.stream.uint8();
        while (i--) {
            object.fields.push(this.readInline());
        }
        return object;
    },
    readFixedFormat: function (id) {
        var array,
            i,
            color,
            canvas;
        switch (id) {
            case 9: // String
            case 10: // Symbol
            case 14: // Utf8
                return this.stream.utf8(this.stream.uint32());
            case 11: // ByteArray
                return new Uint8Array(this.stream.arrayBuffer(this.stream.uint32()));
            case 12: // SoundBuffer
                return new Uint8Array(this.stream.arrayBuffer(this.stream.uint32() * 2));
            case 13: // Bitmap
                var a = new Uint8Array(this.stream.arrayBuffer(this.stream.uint32() * 4));
                a.bitmap = true;
                return a;
            case 20: // Array
            case 21: // OrderedCollection
                array = [];
                i = this.stream.uint32();
                while (i--) {
                    array.push(this.readInline());
                }
                return array;
            case 24: // Dictionary
            case 25: // IdentityDictionary
                array = new sb.Dict();
                i = this.stream.uint32();
                while (i--) {
                    array[i] = [this.readInline(), this.readInline()];
                }
                return array;
            case 30: // Color
                color = this.stream.uint32();
                return {
                    r: color >> 22 & 0xff,
                    g: color >> 12 & 0xff,
                    b: color >> 2 & 0xff,
                    a: 255
                };
            case 31: // TranslucentColor
                color = this.stream.uint32();
                return {
                    r: color >> 22 & 0xff,
                    g: color >> 12 & 0xff,
                    b: color >> 2 & 0xff,
                    a: this.stream.uint8()
                };
            case 32: // Point
                return {
                    x: this.readInline(),
                    y: this.readInline()
                };
            case 33: // Rectangle
                return {
                    ox: this.readInline(),
                    oy: this.readInline(),
                    cx: this.readInline(),
                    cy: this.readInline()
                };
            case 34: // Form
                var canvas = sb.createCanvas(1, 1);
                extend(canvas, {
                    width: this.readInline(),
                    height: this.readInline(),
                    depth: this.readInline(),
                    offset: this.readInline(),
                    bitmap: this.readInline()
                });
                return canvas;
            case 35: // ColorForm
                var canvas = sb.createCanvas(1, 1);
                extend(canvas, {
                    width: this.readInline(),
                    height: this.readInline(),
                    depth: this.readInline(),
                    offset: this.readInline(),
                    bitmap: this.readInline(),
                    colors: this.readInline()
                });
                return canvas;
        }
        throw new Error('Unknown fixed format class ' + id);
    },
    readInline: function () {
        var id = this.stream.uint8();
        switch (id) {
            case 1: // nil
                return null;
            case 2: // True
                return true;
            case 3: // False
                return false;
            case 4: // SmallInteger
                return this.stream.int32();
            case 5: // SmallInteger16
                return this.stream.int16();
            case 6: //LargePositiveInteger
            case 7: //LargeNegativeInteger
                var d1 = 0;
                var d2 = 1;
                var i = this.stream.uint16();
                while (i--) {
                    var k = this.stream.uint8();
                    d1 += d2 * k;
                    d2 *= 256;
                }
                return id == 7 ? -d1 : d1;
            case 8: // Float
                return this.stream.float64();
            case 99:
                return {
                    isRef: true,
                    index: this.stream.uint24()
                };
        }
        throw new Error('Unknown inline class ' + id);
    },
    fixObjectRefs: function (table, object) {
        var id = object.id;
        if (id < 99) {
            this.fixFixedFormat(table, object);
            return;
        }
        var fields = object.fields;
        var i = fields.length;
        while (i--) {
            fields[i] = this.deRef(table, fields[i]);
        }
    },
    fixFixedFormat: function (table, object) {
        var id = object.id,
            fields,
            i;
        switch (id) {
            case 20:
            case 21:
                fields = object.object;
                i = fields.length;
                while (i--) {
                    fields[i] = this.deRef(table, fields[i]);
                }
                break;
            case 24:
            case 25:
                fields = object.object;
                i = 0;
                while (fields[i]) {
                    fields[this.deRef(table, fields[i][0])] = this.deRef(table, fields[i][1]);
                    delete fields[i];
                    i++;
                }
                break;
            case 34:
                object.object.bitmap = this.deRef(table, object.object.bitmap);
                this.buildImage(object.object);
                break;
            case 35:
                object.object.bitmap = this.deRef(table, object.object.bitmap);
                object.object.colors = this.deRef(table, object.object.colors);
                this.buildImage(object.object);
                break;
        }
    },
    deRef: function (table, object) {
        if (object && object.isRef) {
            var obj = table[object.index - 1];
            return typeof obj.object === 'undefined' ? obj : obj.object;
        }
        return object && object.object || object;
    },
    buildImage: function (image) {
        var bitmap = image.bitmap;

        var canvas = image;
        var ctx = canvas.getContext('2d');

        var data = ctx.createImageData(image.width, image.height);

        if (image.depth === 32) {
            if (!bitmap.bitmap) {
                this.decompressBitmapFlip(bitmap, data.data);
            }
        } else if (image.depth <= 8) {
            var indexes = bitmap.bitmap ? bitmap : this.decompressBitmap(bitmap);

            var bits;


            var i,
                j = 0,
                k, l;

            if (image.depth === 8) {
                bits = indexes;
            } else {
                bits = new Uint8Array(indexes.length * (8 / image.depth));

                var mask = (1 << image.depth) - 1;

                var parts = 8 / image.depth;

                for (i = 0; i < indexes.length; i++) {
                    l = indexes[i];
                    k = 8;
                    while ((k -= image.depth) >= 0) {
                        bits[j++] = (l >> k) & mask;
                    }
                }
            }

            var colors = image.colors || this.squeakColors;
            var array = data.data;

            i = 0;
            j = 0;

            var c, b;

            k = array.length;
            while (k--) {
                c = colors[bits[j++]];
                if (c) {
                    array[i++] = c.r;
                    array[i++] = c.g;
                    array[i++] = c.b;
                    array[i++] = c.a === 0 ? 0 : 0xff;
                } else {
                    i += 4;
                }
            }
        }

        ctx.putImageData(data, 0, 0);

        return canvas;
    },
    decompressBitmapFlip: function (src, out) {
        var stream = new sb.ReadStream(src.buffer);
        var nInt = function () {
            var i = stream.uint8();
            return i <= 223 ? i : (i <= 254 ? (i - 224) * 256 + stream.uint8() : stream.uint32());
        };
        var length = nInt() * 4;
        if (!out) {
            out = new Uint8Array(length);
        }

        var j, k, l, m, n, i = 0;

        while (i < length) {
            k = nInt();
            l = k >> 2;
            switch (k & 3) {
                case 0:
                    i += 4;
                    break;
                case 1:
                    m = stream.uint8();
                    while (l--) {
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                    }
                    break;
                case 2:
                    m = [stream.uint8(), stream.uint8(), stream.uint8(), stream.uint8()];
                    while (l--) {
                        out[i++] = m[1];
                        out[i++] = m[2];
                        out[i++] = m[3];
                        out[i++] = m[0];
                    }
                    break;
                case 3:
                    while (l--) {
                        n = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = n;
                    }
                    break;
            }
        }
    },
    decompressBitmap: function (src) {
        var stream = new sb.ReadStream(src.buffer);
        var nInt = function () {
            var i = stream.uint8();
            return i <= 223 ? i : (i <= 254 ? (i - 224) * 256 + stream.uint8() : stream.uint32());
        };
        var length = nInt() * 4;
        var out = new Uint8Array(length);

        var j, k, l, m, n, i = 0;

        while (i < length) {
            k = nInt();
            l = k >> 2;
            switch (k & 3) {
                case 0:
                    i += 4;
                    break;
                case 1:
                    m = stream.uint8();
                    while (l--) {
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                        out[i++] = m;
                    }
                    break;
                case 2:
                    m = [stream.uint8(), stream.uint8(), stream.uint8(), stream.uint8()];
                    while (l--) {
                        out[i++] = m[0];
                        out[i++] = m[1];
                        out[i++] = m[2];
                        out[i++] = m[3];
                    }
                    break;
                case 3:
                    while (l--) {
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                        out[i++] = stream.uint8();
                    }
                    break;
            }
        }
        return out;
    },

    jsonify: function (object, parent) {
        var self = this,
            json;
        if (object && object.id && this.formats[object.id]) {
            var format = this.formats[object.id].read;
            json = {};
            for (var field in format) {
                var value = format[field];
                var type = typeof value;
                var tmp;
                if (type === 'number') {
                    tmp = object.fields[value];
                } else if (type === 'function') {
                    tmp = value(object.fields, parent);
                } else {
                    tmp = value;
                }

                json[field] = this.jsonify(tmp, object);
            }
            return json;
        } else if (object instanceof sb.Dict) {
            json = {};
            for (var key in object) {
                json[key] = this.jsonify(object[key], parent);
            }
            return json;
        } else if (object instanceof Array) {
            return object.map(function (d) {
                return self.jsonify(d, parent);
            });
        }
        return object;
    },

    formats: {
        20: {
            write: function (object, table, hint) {
                var self = this;
                return object.map(function (value, i) {
                    var id = hint || null;
                    if (id) {
                        id = Array.isArray(id) ? (id[i]) : id;
                        id = typeof id === 'function' ? id(value, i) : id;
                    }
                    if (id && id.id && id.hint) {
                        return self.createObject(table, value, id.id, id.hint);
                    } else {
                        return self.createObject(table, value, id);
                    }
                });
            }
        },
        21: {
            write: function (object, table, hint) {
                var self = this;
                return object.map(function (value, i) {
                    var id = hint || null;
                    if (id) {
                        id = Array.isArray(id) ? (id[i]) : id;
                        id = typeof id === 'number' ? id : keyId(value, i);
                    }
                    return self.createObject(table, value, id)
                });
            }
        },
        24: {
            write: function (object, table, hint) {
                var self = this;
                var ids;
                return object.map(function (pair, i) {
                    ids = hint || null;
                    if (ids) {
                        ids = Array.isArray(ids) ? (ids[i]) : ids;
                        ids = Array.isArray(ids) ? ids : (typeof ids === 'function' ? ids(pair[0], pair[1]) : [ids, ids]);
                    } else {
                        ids = [null, null]
                    }
                    return [self.createObject(table, pair[0], ids[0]), self.createObject(table, pair[1], ids[1])];
                });
            }
        },
        34: {
            write: function (object, table, hint) {
                return {
                    width: object.width,
                    height: object.height,
                    depth: 32,
                    offset: null,
                    bitmap: this.createObject(table, object.getContext('2d').getImageData(0, 0, object.width, object.height).data, 13)
                }
            }
        },
        124: {
            version: 3,
            read: {
                objName: 6,
                scripts: function (fields) {
                    var scripts = fields[8];
                    return scripts.map(function (script) {
                        return [script[0].x, script[0].y, sb.buildScript(script[1])];
                    });
                },
                sounds: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 164;
                    });
                },
                costumes: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    });
                },
                currentCostumeIndex: function (fields, parent) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    }).indexOf(fields[11]);
                },
                scratchX: function (fields, parent) {
                    return fields[0].ox + fields[11].fields[2].x - parent.fields[0].cx / 2;
                },
                scratchY: function (fields, parent) {
                    return parent.fields[0].cy / 2 - (fields[0].oy + fields[11].fields[2].y);
                },
                scale: function (fields) {
                    return fields[13].x;
                },
                direction: function (fields, parent) {
                    return fields[14] + 90;
                },
                rotationStyle: 15,
                isDraggable: 18,
                indexInLibrary: function (fields, parent) {
                    var library = parent.fields[16];
                    if (!library) {
                        return -1;
                    }
                    var i = library.length;
                    while (i--) {
                        if (library[i].fields === fields) {
                            return i;
                        }
                    }
                    return -1;
                },
                visible: function (fields) {
                    return !(fields[4] & 1);
                },
                variables: function (fields) {
                    var vars = fields[7];
                    var varNames = Object.keys(vars);
                    return varNames.map(function (d) {
                        return {
                            name: d,
                            value: vars[d],
                            isPersistent: false
                        };
                    });
                },
                lists: 20,
                volume: 16,
                tempoBPM: 17
            },
            write: [
                function (object, table) { // bounds
                    var costume = object.costumes[object.currentCostumeIndex];
                    var x = object.scratchX - costume.rotationCenterX;
                    var y = object.scratchY - costume.rotationCenterY;
                    return this.createObject(table, {
                        ox: x,
                        oy: y,
                        cx: x + costume.image.width,
                        cy: y + costume.image.height
                    }, 33);
                },
                function (object, table) { // owner
                    return this.createObject(table, this.object, 125);
                },
                function (object, table) { // submorphs
                    return this.createObject(table, [], 20);
                },
                function (object, table) { // color
                    return this.createObject(table, {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 255
                    }, 30);
                },
                0, // flags
                null, // nil
                function (object, table) { // objName
                    return this.createObject(table, object.objName, 14);
                },
                function (object, table) { // vars
                    return this.createObject(table, object.variables.map(function (v) {
                        return [v.name, v.value];
                    }), 24, function (key, value) {
                        return [14, typeof value === 'number' ? null : 14];
                    });
                },
                sb.blocksBinWrite, // blocksBin
                false, // isClone
                function (object, table) { // media
                    return this.createObject(table, object.costumes, 20, 162);
                },
                function (object, table) { // costume
                    return this.createObject(table, object.costumes[object.currentCostumeIndex], 162);
                },
                100, // visibility
                function (object, table) { // scalePoint
                    return this.createObject(table, {
                        x: 1,
                        y: 1
                    }, 32);
                },
                function (object, table) { // rotationDegrees
                    return object.direction - 90;
                },
                function (object, table) { // rotationStyle
                    return this.createObject(table, object.rotationStyle, 10);
                },
                function (object, table) { // volume
                    return object.volume;
                },
                function (object, table) { // tempoBPM
                    return object.tempoBPM;
                },
                function (object, table) { // draggable
                    return object.isDraggable;
                },
                function (object, table) { // sceneStates
                    return this.createObject(table, [], 24);
                },
                function (object, table) { // lists
                    return this.createObject(table, [], 24);
                }
            ]
        },
        125: {
            version: 5,
            read: {
                objName: 6,
                sounds: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 164;
                    });
                },
                costumes: function (fields) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    });
                },
                currentCostumeIndex: function (fields, parent) {
                    return fields[10].filter(function (media) {
                        return media.id === 162;
                    }).indexOf(fields[11]);
                },
                children: 2,
                variables: function (fields) {
                    var vars = fields[7];
                    var varNames = Object.keys(vars);
                    return varNames.map(function (d) {
                        return {
                            name: d,
                            value: vars[d],
                            isPersistent: false
                        };
                    });
                },
                lists: function (fields) {
                    var lists = fields[20];
                    if (!lists) {
                        return []
                    }
                    var listNames = Object.keys(lists);
                    return listNames.map(function (d) {
                        return lists[d];
                    });
                },
                scripts: function (fields) {
                    var scripts = fields[8];
                    return scripts.map(function (script) {
                        return [script[0].x, script[0].y, sb.buildScript(script[1])];
                    });
                },
                volume: 17,
                tempoBPM: 18
            },
            write: [
                function (object, table) { // bounds
                    // TODO: Dynamic size
                    return this.createObject(table, {
                        ox: 0,
                        oy: 0,
                        cx: 480,
                        cy: 360,
                    }, 33);
                },
                null, // owner
                function (object, table) { // submorphs
                    return this.createObject(table, object.children, 20, 124);
                },
                function (object, table) { // color
                    return this.createObject(table, {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 255
                    }, 30);
                },
                0, // flags
                null, // nil
                function (object, table) { // objName
                    return this.createObject(table, object.objName, 14);
                },
                function (object, table) { // vars
                    return this.createObject(table, object.variables.map(function (v) {
                        return [v.name, v.value];
                    }), 24, function (key, value) {
                        return [14, typeof value === 'number' ? null : 14];
                    });
                },
                sb.blocksBinWrite, // blocksBin
                false, // isClone
                function (object, table) { // media
                    return this.createObject(table, object.costumes, 21, 162);
                },
                function (object, table) { // costume
                    return this.createObject(table, object.costumes[object.currentCostumeIndex], 162);
                },
                1, // zoom
                0, // hPan
                0, // vPan
                null, // obsoleteSavedState
                function (object, table) { // sprites
                    return this.createObject(table, [], 21);
                },
                function (object, table) { // volume
                    return object.volume;
                },
                function (object, table) { // tempoBPM
                    return object.tempoBPM;
                },
                function (object, table) { // sceneStates
                    return this.createObject(table, [], 24);
                }
            ]
        },
        162: {
            read: {
                costumeName: 0,
                rotationCenterX: function (fields) {
                    return fields[2].x;
                },
                rotationCenterY: function (fields) {
                    return fields[2].y;
                },
                image: function (fields) {
                    return (fields[6] || fields[1]);
                }
            },
            write: [
                function (object, table) { // mediaName
                    return this.createObject(table, object.costumeName, 14);
                },
                function (object, table) { // form
                    return this.createObject(table, object.image, 34);
                },
                function (object, table) { // rotationCenter
                    return this.createObject(table, {
                        x: object.rotationCenterX,
                        y: object.rotationCenterY
                    }, 32);
                },
                null, // textBox
                null, // jpegBytes
                null // compositeForm
                // TODO: Implement textBox/compositeForm?
            ]
        },
        164: { // TODO: implement sound
            read: {
                soundName: 0,
                sound: null
            },
            write: [

            ]
        },
        175: {
            read: {
                listName: 8,
                contents: 9,
                isPersistent: false,
                target: function (fields) {
                    return fields[10].fields[6];
                },
                x: function (fields) {
                    return fields[0].ox;
                },
                y: function (fields) {
                    return fields[0].oy;
                },
                width: function (fields) {
                    return fields[0].cx - fields[0].ox;
                },
                height: function (fields) {
                    return fields[0].cy - fields[0].oy;
                },
                visible: function (fields) {
                    return !!fields[1];
                }
            },
            write: [

            ]
        }
    }
});*/

sb.buildScript = function (script) {
    for (var i = 0; i < script.length; i++) {
        var block = script[i];
        if (Array.isArray(block)) {
            var refactorer = sb.blocks.read[block[0]];
            if (typeof refactorer === 'string') {
                block[0] = refactorer;
            } else if (typeof refactorer === 'function') {
                script[i] = refactorer(script[i]);
            }
            sb.buildScript(script[i]);
        }
    }
    return script;
};

sb.objectName = function (obj) {
    return obj ? (obj.fields && obj.fields[6] || obj) : '';
};

sb.blocks = {
    read: {
        'EventHatMorph': function (block) {
            if (block[1] === 'Scratch-StartClicked') {
                return ['whenGreenFlag'];
            }
            return ['whenIReceive', block[1]];
        },
        'KeyEventHatMorph': 'whenKeyPressed',
        'MouseClickEventHatMorph': 'whenClicked',
        'showBackground:': 'lookLike:',
        'nextBackground': 'nextCostume',
        'changeVariable': function (block) {
            return [block[2], block[1], block[3]];
        },
        'getAttribute:of:': function (block) {
            return ['getAttribute:of:', block[1], sb.objectName(block[2])];
        },
        'touching:': function (block) {
            return ['touching:', sb.objectName(block[1])];
        },
        'distanceTo:': function (block) {
            return ['distanceTo:', sb.objectName(block[1])];
        },
        'pointTowards:': function (block) {
            return ['pointTowards:', sb.objectName(block[1])];
        },
        'gotoSpriteOrMouse:': function (block) {
            return ['gotoSpriteOrMouse:', sb.objectName(block[1])];
        }
    },
    write: {
        'whenGreenFlag': ['EventHatMorph', 'Scratch-StartClicked'],
        'whenIReceive': ['EventHatMorph', 1],
        'whenClicked': ['MouseClickEventHatMorph'],
        'whenKeyPressed': ['KeyEventHatMorph', 1],
        'setVar:to:': ['changeVariable', 1, 0, 2],
        'changeVar:by:': ['changeVariable', 1, 0, 2],
    }
};

sb.createCanvas = function (width, height) {
    if (sb.canvas) {
        return new sb.canvas(width, height);
    }
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

(function () {
    var values = [
        0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x80, 0x80, 0x80, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0xff, 0xff,
        0xff, 0xff, 0x00, 0xff, 0x00, 0xff, 0x20, 0x20, 0x20, 0x40, 0x40, 0x40, 0x60, 0x60, 0x60, 0x9f, 0x9f, 0x9f, 0xbf, 0xbf, 0xbf, 0xdf, 0xdf, 0xdf,
        0x08, 0x08, 0x08, 0x10, 0x10, 0x10, 0x18, 0x18, 0x18, 0x28, 0x28, 0x28, 0x30, 0x30, 0x30, 0x38, 0x38, 0x38, 0x48, 0x48, 0x48, 0x50, 0x50, 0x50,
        0x58, 0x58, 0x58, 0x68, 0x68, 0x68, 0x70, 0x70, 0x70, 0x78, 0x78, 0x78, 0x87, 0x87, 0x87, 0x8f, 0x8f, 0x8f, 0x97, 0x97, 0x97, 0xa7, 0xa7, 0xa7,
        0xaf, 0xaf, 0xaf, 0xb7, 0xb7, 0xb7, 0xc7, 0xc7, 0xc7, 0xcf, 0xcf, 0xcf, 0xd7, 0xd7, 0xd7, 0xe7, 0xe7, 0xe7, 0xef, 0xef, 0xef, 0xf7, 0xf7, 0xf7,
        0x00, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x66, 0x00, 0x00, 0x99, 0x00, 0x00, 0xcc, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x33, 0x00, 0x33, 0x33,
        0x00, 0x66, 0x33, 0x00, 0x99, 0x33, 0x00, 0xcc, 0x33, 0x00, 0xff, 0x33, 0x00, 0x00, 0x66, 0x00, 0x33, 0x66, 0x00, 0x66, 0x66, 0x00, 0x99, 0x66,
        0x00, 0xcc, 0x66, 0x00, 0xff, 0x66, 0x00, 0x00, 0x99, 0x00, 0x33, 0x99, 0x00, 0x66, 0x99, 0x00, 0x99, 0x99, 0x00, 0xcc, 0x99, 0x00, 0xff, 0x99,
        0x00, 0x00, 0xcc, 0x00, 0x33, 0xcc, 0x00, 0x66, 0xcc, 0x00, 0x99, 0xcc, 0x00, 0xcc, 0xcc, 0x00, 0xff, 0xcc, 0x00, 0x00, 0xff, 0x00, 0x33, 0xff,
        0x00, 0x66, 0xff, 0x00, 0x99, 0xff, 0x00, 0xcc, 0xff, 0x00, 0xff, 0xff, 0x33, 0x00, 0x00, 0x33, 0x33, 0x00, 0x33, 0x66, 0x00, 0x33, 0x99, 0x00,
        0x33, 0xcc, 0x00, 0x33, 0xff, 0x00, 0x33, 0x00, 0x33, 0x33, 0x33, 0x33, 0x33, 0x66, 0x33, 0x33, 0x99, 0x33, 0x33, 0xcc, 0x33, 0x33, 0xff, 0x33,
        0x33, 0x00, 0x66, 0x33, 0x33, 0x66, 0x33, 0x66, 0x66, 0x33, 0x99, 0x66, 0x33, 0xcc, 0x66, 0x33, 0xff, 0x66, 0x33, 0x00, 0x99, 0x33, 0x33, 0x99,
        0x33, 0x66, 0x99, 0x33, 0x99, 0x99, 0x33, 0xcc, 0x99, 0x33, 0xff, 0x99, 0x33, 0x00, 0xcc, 0x33, 0x33, 0xcc, 0x33, 0x66, 0xcc, 0x33, 0x99, 0xcc,
        0x33, 0xcc, 0xcc, 0x33, 0xff, 0xcc, 0x33, 0x00, 0xff, 0x33, 0x33, 0xff, 0x33, 0x66, 0xff, 0x33, 0x99, 0xff, 0x33, 0xcc, 0xff, 0x33, 0xff, 0xff,
        0x66, 0x00, 0x00, 0x66, 0x33, 0x00, 0x66, 0x66, 0x00, 0x66, 0x99, 0x00, 0x66, 0xcc, 0x00, 0x66, 0xff, 0x00, 0x66, 0x00, 0x33, 0x66, 0x33, 0x33,
        0x66, 0x66, 0x33, 0x66, 0x99, 0x33, 0x66, 0xcc, 0x33, 0x66, 0xff, 0x33, 0x66, 0x00, 0x66, 0x66, 0x33, 0x66, 0x66, 0x66, 0x66, 0x66, 0x99, 0x66,
        0x66, 0xcc, 0x66, 0x66, 0xff, 0x66, 0x66, 0x00, 0x99, 0x66, 0x33, 0x99, 0x66, 0x66, 0x99, 0x66, 0x99, 0x99, 0x66, 0xcc, 0x99, 0x66, 0xff, 0x99,
        0x66, 0x00, 0xcc, 0x66, 0x33, 0xcc, 0x66, 0x66, 0xcc, 0x66, 0x99, 0xcc, 0x66, 0xcc, 0xcc, 0x66, 0xff, 0xcc, 0x66, 0x00, 0xff, 0x66, 0x33, 0xff,
        0x66, 0x66, 0xff, 0x66, 0x99, 0xff, 0x66, 0xcc, 0xff, 0x66, 0xff, 0xff, 0x99, 0x00, 0x00, 0x99, 0x33, 0x00, 0x99, 0x66, 0x00, 0x99, 0x99, 0x00,
        0x99, 0xcc, 0x00, 0x99, 0xff, 0x00, 0x99, 0x00, 0x33, 0x99, 0x33, 0x33, 0x99, 0x66, 0x33, 0x99, 0x99, 0x33, 0x99, 0xcc, 0x33, 0x99, 0xff, 0x33,
        0x99, 0x00, 0x66, 0x99, 0x33, 0x66, 0x99, 0x66, 0x66, 0x99, 0x99, 0x66, 0x99, 0xcc, 0x66, 0x99, 0xff, 0x66, 0x99, 0x00, 0x99, 0x99, 0x33, 0x99,
        0x99, 0x66, 0x99, 0x99, 0x99, 0x99, 0x99, 0xcc, 0x99, 0x99, 0xff, 0x99, 0x99, 0x00, 0xcc, 0x99, 0x33, 0xcc, 0x99, 0x66, 0xcc, 0x99, 0x99, 0xcc,
        0x99, 0xcc, 0xcc, 0x99, 0xff, 0xcc, 0x99, 0x00, 0xff, 0x99, 0x33, 0xff, 0x99, 0x66, 0xff, 0x99, 0x99, 0xff, 0x99, 0xcc, 0xff, 0x99, 0xff, 0xff,
        0xcc, 0x00, 0x00, 0xcc, 0x33, 0x00, 0xcc, 0x66, 0x00, 0xcc, 0x99, 0x00, 0xcc, 0xcc, 0x00, 0xcc, 0xff, 0x00, 0xcc, 0x00, 0x33, 0xcc, 0x33, 0x33,
        0xcc, 0x66, 0x33, 0xcc, 0x99, 0x33, 0xcc, 0xcc, 0x33, 0xcc, 0xff, 0x33, 0xcc, 0x00, 0x66, 0xcc, 0x33, 0x66, 0xcc, 0x66, 0x66, 0xcc, 0x99, 0x66,
        0xcc, 0xcc, 0x66, 0xcc, 0xff, 0x66, 0xcc, 0x00, 0x99, 0xcc, 0x33, 0x99, 0xcc, 0x66, 0x99, 0xcc, 0x99, 0x99, 0xcc, 0xcc, 0x99, 0xcc, 0xff, 0x99,
        0xcc, 0x00, 0xcc, 0xcc, 0x33, 0xcc, 0xcc, 0x66, 0xcc, 0xcc, 0x99, 0xcc, 0xcc, 0xcc, 0xcc, 0xcc, 0xff, 0xcc, 0xcc, 0x00, 0xff, 0xcc, 0x33, 0xff,
        0xcc, 0x66, 0xff, 0xcc, 0x99, 0xff, 0xcc, 0xcc, 0xff, 0xcc, 0xff, 0xff, 0xff, 0x00, 0x00, 0xff, 0x33, 0x00, 0xff, 0x66, 0x00, 0xff, 0x99, 0x00,
        0xff, 0xcc, 0x00, 0xff, 0xff, 0x00, 0xff, 0x00, 0x33, 0xff, 0x33, 0x33, 0xff, 0x66, 0x33, 0xff, 0x99, 0x33, 0xff, 0xcc, 0x33, 0xff, 0xff, 0x33,
        0xff, 0x00, 0x66, 0xff, 0x33, 0x66, 0xff, 0x66, 0x66, 0xff, 0x99, 0x66, 0xff, 0xcc, 0x66, 0xff, 0xff, 0x66, 0xff, 0x00, 0x99, 0xff, 0x33, 0x99,
        0xff, 0x66, 0x99, 0xff, 0x99, 0x99, 0xff, 0xcc, 0x99, 0xff, 0xff, 0x99, 0xff, 0x00, 0xcc, 0xff, 0x33, 0xcc, 0xff, 0x66, 0xcc, 0xff, 0x99, 0xcc,
        0xff, 0xcc, 0xcc, 0xff, 0xff, 0xcc, 0xff, 0x00, 0xff, 0xff, 0x33, 0xff, 0xff, 0x66, 0xff, 0xff, 0x99, 0xff, 0xff, 0xcc, 0xff
    ];
    var colors = [];
    var i = 0;
    while (i < values.length) {
        colors.push({
            r: values[i++],
            g: values[i++],
            b: values[i++],
            a: 0xff
        });
    }
    sb.ObjectStream.prototype.squeakColors = colors;
})();


sb.Dict = function () { };

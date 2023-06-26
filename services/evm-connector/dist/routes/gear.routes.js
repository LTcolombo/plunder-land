function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return(g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g);
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import { AuroraTestnet } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Router } from "express";
import { GEAR_PRESET_METADATA } from "../data/metadata.presets";
export var GearRoutes = /*#__PURE__*/ function() {
    "use strict";
    function GearRoutes() {
        _class_call_check(this, GearRoutes);
        _define_property(this, "contract", void 0);
        _define_property(this, "_router", void 0);
    }
    _create_class(GearRoutes, [
        {
            key: "router",
            get: function get() {
                if (this._router == null) {
                    this._router = Router();
                    var _this = this;
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    this._router.get("/balance/:address", function() {
                        var _ref = _async_to_generator(function(req, res) {
                            var _, e;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        _state.trys.push([
                                            0,
                                            2,
                                            ,
                                            3
                                        ]);
                                        _ = res.json;
                                        return [
                                            4,
                                            _this.getBalance(req.params.address)
                                        ];
                                    case 1:
                                        _.apply(res, [
                                            _state.sent()
                                        ]);
                                        return [
                                            3,
                                            3
                                        ];
                                    case 2:
                                        e = _state.sent();
                                        res.status(500).send(e.message);
                                        return [
                                            3,
                                            3
                                        ];
                                    case 3:
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return function(req, res) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                    var _this1 = this;
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    this._router.post("/mint/:address", function() {
                        var _ref = _async_to_generator(function(req, res) {
                            var _, e;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        _state.trys.push([
                                            0,
                                            2,
                                            ,
                                            3
                                        ]);
                                        _ = res.json;
                                        return [
                                            4,
                                            _this1.mint(req.params.address)
                                        ];
                                    case 1:
                                        _.apply(res, [
                                            _state.sent()
                                        ]);
                                        return [
                                            3,
                                            3
                                        ];
                                    case 2:
                                        e = _state.sent();
                                        res.status(500).send(e.message);
                                        return [
                                            3,
                                            3
                                        ];
                                    case 3:
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return function(req, res) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                    var _this2 = this;
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    this._router.get("/equipment/:address", function() {
                        var _ref = _async_to_generator(function(req, res) {
                            var _, e;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        _state.trys.push([
                                            0,
                                            2,
                                            ,
                                            3
                                        ]);
                                        _ = res.json;
                                        return [
                                            4,
                                            _this2.equipment(req.params.address)
                                        ];
                                    case 1:
                                        _.apply(res, [
                                            _state.sent()
                                        ]);
                                        return [
                                            3,
                                            3
                                        ];
                                    case 2:
                                        e = _state.sent();
                                        res.status(500).send(e.message);
                                        return [
                                            3,
                                            3
                                        ];
                                    case 3:
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return function(req, res) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                }
                return this._router;
            }
        },
        {
            key: "lazyInit",
            value: function lazyInit() {
                var _this = this;
                return _async_to_generator(function() {
                    var sdk;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!(_this.contract === undefined && process.env.PRIVATE_KEY !== undefined)) return [
                                    3,
                                    2
                                ];
                                sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, AuroraTestnet);
                                return [
                                    4,
                                    sdk.getContract("0x01c25BecA7B2548367d440FEBC11092446615AF4")
                                ];
                            case 1:
                                _this.contract = _state.sent().erc1155;
                                _state.label = 2;
                            case 2:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getBalance",
            value: function getBalance(address) {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.lazyInit()
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    _this.contract.getOwned(address)
                                ];
                            case 2:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "equipment",
            value: function equipment(address) {
                var _this = this;
                return _async_to_generator(function() {
                    var nfts, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nft, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getBalance(address)
                                ];
                            case 1:
                                nfts = _state.sent();
                                result = {
                                    damage: 0,
                                    armor: 0,
                                    speed: 0
                                };
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(_iterator = nfts[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        nft = _step.value;
                                        if (nft.metadata.attributes == null) {
                                            continue;
                                        }
                                        data = _this.attributesToMap(nft.metadata.attributes);
                                        // todo check slots
                                        if (result.damage < data.damage) {
                                            result.damage = data.damage;
                                        }
                                        if (result.armor < data.armor) {
                                            result.armor = data.armor;
                                        }
                                        if (result.speed < data.speed) {
                                            result.speed = data.speed;
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }
                                return [
                                    2,
                                    result
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "attributesToMap",
            value: function attributesToMap(attributes) {
                var result = {};
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var attibute = _step.value;
                        result[attibute.trait_type] = parseInt(attibute.value);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return result;
            }
        },
        {
            key: "mint",
            value: function mint(address) {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.lazyInit()
                                ];
                            case 1:
                                _state.sent();
                                console.log(address, {
                                    metadata: GEAR_PRESET_METADATA[Math.floor(Math.random() * GEAR_PRESET_METADATA.length)],
                                    supply: 1
                                });
                                return [
                                    4,
                                    _this.contract.mintTo(address, {
                                        metadata: GEAR_PRESET_METADATA[Math.floor(Math.random() * GEAR_PRESET_METADATA.length)],
                                        supply: 1
                                    })
                                ];
                            case 2:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return GearRoutes;
}();

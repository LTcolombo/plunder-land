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
import { BigNumber } from "ethers";
export var RewardRoutes = /*#__PURE__*/ function() {
    "use strict";
    function RewardRoutes() {
        _class_call_check(this, RewardRoutes);
        _define_property(this, "decimals", void 0);
        _define_property(this, "contract", void 0);
        _define_property(this, "_router", void 0);
        _define_property(this, "_paid", {});
        void this.init();
    }
    _create_class(RewardRoutes, [
        {
            key: "router",
            get: function get() {
                if (this._router == null) {
                    this._router = Router();
                    var _this = this;
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    this._router.post("/payout/:address", function() {
                        var _ref = /* authorizeAPI, */ _async_to_generator(function(req, res) {
                            var percentage, transferValue, receipt, e;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        _state.trys.push([
                                            0,
                                            4,
                                            ,
                                            5
                                        ]);
                                        if (_this._paid[req.params.address].lte(0)) {
                                            res.status(403).send("payout forbidden; game not funded");
                                            return [
                                                2
                                            ];
                                        }
                                        if (!(req.body.amount > 0)) return [
                                            3,
                                            2
                                        ];
                                        percentage = _this._paid[req.params.address].div(BigNumber.from(10).pow(_this.decimals)).toNumber();
                                        transferValue = req.body.amount * percentage * 0.01;
                                        return [
                                            4,
                                            _this.contract.transfer(req.params.address, transferValue)
                                        ];
                                    case 1:
                                        receipt = _state.sent().receipt;
                                        res.json(receipt);
                                        return [
                                            3,
                                            3
                                        ];
                                    case 2:
                                        res.json("ok");
                                        _state.label = 3;
                                    case 3:
                                        _this._paid[req.params.address] = BigNumber.from(0);
                                        return [
                                            3,
                                            5
                                        ];
                                    case 4:
                                        e = _state.sent();
                                        console.error(e);
                                        res.status(500).send(e.message);
                                        return [
                                            3,
                                            5
                                        ];
                                    case 5:
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
            key: "init",
            value: function init() {
                var _this = this;
                return _async_to_generator(function() {
                    var sdk, contractBase;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!(_this.contract === undefined && process.env.PRIVATE_KEY !== undefined)) return [
                                    3,
                                    3
                                ];
                                sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, AuroraTestnet);
                                return [
                                    4,
                                    sdk.getContract("0x198543B8f9b83d2477F1eD897834D6890f98e6f1")
                                ];
                            case 1:
                                contractBase = _state.sent();
                                contractBase.events.addEventListener("Transfer", _this.onTransfer.bind(_this));
                                _this.contract = contractBase.erc20;
                                return [
                                    4,
                                    _this.contract.get()
                                ];
                            case 2:
                                _this.decimals = _state.sent().decimals;
                                _state.label = 3;
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "onTransfer",
            value: function onTransfer(event) {
                if (event.data.to === process.env.PUBLIC_KEY) {
                    this._paid[event.data.from] = event.data.value;
                }
            }
        }
    ]);
    return RewardRoutes;
}();

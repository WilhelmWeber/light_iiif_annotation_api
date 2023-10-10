"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manifests_1 = __importDefault(require("../db/manifests"));
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    manifests_1.default
        .find({})
        .then((value) => {
        return res.json(value);
    })
        .catch((err) => {
        console.log(err.toString());
        return res.status(500).send(err.toString());
    });
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uri = req.body.uri;
    const manifest_res = yield fetch(uri);
    const res_json = yield manifest_res.json();
    const data = {
        manifest_id: (0, uuid_1.v4)(),
        label: res_json['label'],
        attribution: res_json['attribution'],
        license: res_json['license'],
        contributor: 'Yuto Takizawa',
        manifest_uri: uri,
    };
    manifests_1.default
        .create(data)
        .then(() => {
        return res.status(200).send('success');
    })
        .catch((err) => {
        console.log(err);
        return res.status(500).send(err.toString());
    });
}));
exports.default = router;

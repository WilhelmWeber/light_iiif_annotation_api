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
const annotations_1 = __importDefault(require("../db/annotations"));
const manifests_1 = __importDefault(require("../db/manifests"));
const router = (0, express_1.Router)();
//マニフェストのURIとアノテーションを同時に返す
router.get('/:manifest_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const manifest_id = req.params.manifest_id;
    const manifest = manifests_1.default.findOne({ manifest_id: manifest_id });
    const annotation = annotations_1.default.find({ manifest_id: manifest_id });
    const [res_manifest, res_annotation] = yield Promise.all([manifest, annotation]);
    res.json({
        manifest: res_manifest,
        annotation: res_annotation,
    });
}));
router.post('/:manifest_id', (req, res) => {
    const data = req.body;
    annotations_1.default
        .create(data)
        .then(() => {
        return res.status(200).send('success');
    })
        .catch((err) => {
        console.log(err);
        return res.status(500).send(err.toString());
    });
});
exports.default = router;

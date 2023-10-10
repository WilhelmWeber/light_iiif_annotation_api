"use strict";
//元のマニフェストJSONに対してこちらで付した@idとannotationリストの情報を付するAPI
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
const annotations_1 = __importDefault(require("../db/annotations"));
const router = (0, express_1.Router)();
router.get('/:manifest_id/manifest.json', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const base_uri = process.env.BASE_URI || 'http://localhost:8080';
    const manifest_id = req.params.manifest_id;
    const manifest = yield manifests_1.default.find({ manifest_id: manifest_id });
    const manifest_uri = manifest[0].manifest_uri;
    const manifest_res = yield fetch(manifest_uri);
    const res_json = yield manifest_res.json();
    //@idをこのAPIのURIに変更
    res_json['@id'] = `${base_uri}/presentation/${manifest_id}/manifest.json`;
    //other_contentsにannotationリストのuriを追加する処理を追加
    let k = 0; //manifest側のsequencesが複数の配列になっていることを想定し、独立のインデックスを使う
    for (let i = 0; i < res_json["sequences"].length; i++) {
        for (let j = 0; j < res_json["sequences"][i]["canvases"].length; j++) {
            res_json["sequences"][i]["canvases"][j]["otherContent"] = {
                "@id": `${base_uri}/presentation/${manifest_id}/${k}/annolist.json`,
                "@type": "sc:AnnotationList",
            };
            k++;
        }
    }
    res.json(res_json);
}));
router.get('/:manifest_id/:canvas/annolist.json', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const base_uri = process.env.BASE_URI || 'http://localhost:8080';
    const canvas_num = Number(req.params.canvas);
    const manifest_id = req.params.manifest_id;
    const datas = yield annotations_1.default.find({ manifest_id: manifest_id, canvas: canvas_num });
    let resources = [];
    for (let data of datas) {
        let resource = {
            "@id": `anbase:${data.annotation_id}`,
            "@type": "oa:Annotation",
            "motivation": "sc:painting",
            "resource": {
                "@type": "cnt:ContentAsText",
                "chars": data.chars,
                "format": "text/plain"
            },
            "on": data.on,
        };
        resources.push(resource);
    }
    const json = {
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@id": `${base_uri}/presentation/${manifest_id}/${canvas_num}/annolist.json`,
        "@type": "sc:AnnotationList",
        "resources": resources,
    };
    res.json(json);
}));
exports.default = router;

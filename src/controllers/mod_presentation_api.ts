//元のマニフェストJSONに対してこちらで付した@idとannotationリストの情報を付するAPI

import express, { Router } from "express";
import manifests from "../db/manifests";
import annotations from "../db/annotations";
import 'cross-fetch/polyfill';

const router: express.Router = Router();

router.get('/:manifest_id/manifest.json', async (req: express.Request, res: express.Response) => {
    const base_uri: string = process.env.BASE_URI || 'http://localhost:8080'
    const manifest_id: string = req.params.manifest_id;

    const manifest = await manifests.find({manifest_id:manifest_id});
    const manifest_uri: any = manifest[0].manifest_uri;

    const manifest_res: Response = await fetch(manifest_uri);
    const res_json: any = await manifest_res.json();

    //@idをこのAPIのURIに変更
    res_json['@id'] = `${base_uri}/presentation/${manifest_id}/manifest.json`;
    //other_contentsにannotationリストのuriを追加する処理を追加
    let k: number = 0 //manifest側のsequencesが複数の配列になっていることを想定し、独立のインデックスを使う
    for (let i=0; i<res_json["sequences"].length; i++) {
        for (let j=0; j<res_json["sequences"][i]["canvases"].length; j++) {
            res_json["sequences"][i]["canvases"][j]["otherContent"] = {
                "@id": `${base_uri}/presentation/${manifest_id}/${k}/annolist.json`,
                "@type": "sc:AnnotationList",
            };
            k++;
        }
    }

    res.json(res_json);
});

router.get('/:manifest_id/:canvas/annolist.json', async (req: express.Request, res: express.Response) => {
    const base_uri: string = process.env.BASE_URI || 'http://localhost:8080';
    const canvas_num: number = Number(req.params.canvas);
    const manifest_id: string = req.params.manifest_id;
    const datas: any = await annotations.find({manifest_id:manifest_id, canvas:canvas_num});

    let resources: {}[] = [];
    for (let data of datas) {
        let resource: {} = {
            "@id": `anbase:${data.annotation_id}`,
            "@type": "oa:Annotation",
            "motivation": "sc:painting",
            "resource" : {
                "@type": "cnt:ContentAsText",
                "chars": data.chars,
                "format": "text/plain"
            },
            "on": data.on,
        };
        resources.push(resource);
    }

    const json: {} = {
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@id": `${base_uri}/presentation/${manifest_id}/${canvas_num}/annolist.json`,
        "@type": "sc:AnnotationList",
        "resources": resources,
    }

    res.json(json);
});

export default router;
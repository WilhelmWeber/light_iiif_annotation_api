import express, { Router } from "express";
import manifests from "../db/manifests";
import { v4 as uuidv4 } from "uuid";

const router: express.Router = Router();

router.get('/', (req: express.Request, res: express.Response) => {
    manifests
      .find({})
      .then((value: any) => {
        return res.json(value);
      })
      .catch((err: Error) => {
        console.log(err.toString());
        return res.status(500).send(err.toString());
      });
});

router.post('/', async (req: express.Request, res: express.Response) => {
    const uri: string = req.body.uri;
    const manifest_res: Response = await fetch(uri);
    const res_json: any = await manifest_res.json();

    const data: any = {
        manifest_id: uuidv4(),
        label: res_json['label'],
        attribution: res_json['attribution'],
        license: res_json['license'],
        contributor: 'Yuto Takizawa',
        manifest_uri: uri,
    };

    manifests
      .create(data)
      .then(() => {
        return res.status(200).send('success');
      })
      .catch((err: Error) => {
        console.log(err);
        return res.status(500).send(err.toString());
      });
});

export default router;
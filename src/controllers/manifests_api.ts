import express, { Router } from "express";
import manifests from "../db/manifests";
import annotations from "../db/annotations";
import { v4 as uuidv4 } from "uuid";

const router: express.Router = Router();

router.get('/', (req: express.Request, res: express.Response) => {
    const userID: any = req.query.userid;
    manifests
      .find({userID: userID})
      .then((value: any) => {
        return res.json(value);
      })
      .catch((err: Error) => {
        console.log(err.toString());
        return res.status(500).send(err.toString());
      });
});

router.post('/', async (req: express.Request, res: express.Response) => {
    const userID: any = req.query.userid;
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
        userID: userID,
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

router.get('/delete/:manifest_ID', async (req: express.Request, res: express.Response) => {
  const manifest_id: string = req.params.manifest_ID;
  const userID: any = req.query.userid;

  const manifestdelete: Promise<any> = manifests.deleteOne({manifest_id: manifest_id});
  const annotationsdelete: Promise<any> = annotations.deleteMany({manifest_id: manifest_id});

  Promise.all([manifestdelete, annotationsdelete])
    .then(() => {
      return res.status(200).send('delete with success');
    })
    .catch((err: Error) => {
      return res.status(500).send(err.toString());
    })
});

export default router;
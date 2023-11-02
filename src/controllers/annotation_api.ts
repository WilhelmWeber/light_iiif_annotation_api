import express, { Router } from "express";
import annotations, { annotationDoc } from "../db/annotations";
import manifests from "../db/manifests";

const router: express.Router = Router();

//マニフェストのURIとアノテーションを同時に返す
router.get('/:manifest_id', async (req: express.Request, res: express.Response) => {
    const manifest_id: string = req.params.manifest_id;
    const userID: any = req.query.userid;

    const manifest: Promise<any> = manifests.findOne({manifest_id:manifest_id});
    const annotation: Promise<any> = annotations.find({manifest_id:manifest_id});
    const [res_manifest, res_annotation]: any[] = await Promise.all([manifest, annotation]);

    if (res_manifest.userID===userID) {
      return res.json(
        {
          manifest: res_manifest,
          annotation: res_annotation,
        }
      );
    } else {
      return res.status(401).send('Unauthorized Access');
    }
});

router.post('/:manifest_id', async (req: express.Request, res: express.Response) => {
    const manifest_id: string = req.params.manifest_id;
    const userID: any = req.query.userid;

    const manifest: any = await manifests.findOne({manifest_id:manifest_id});
    if(manifest.userID===userID) {
      const data: annotationDoc = req.body;
      annotations
        .create(data)
        .then(() => {
          return res.status(200).send('success');
        })
        .catch((err: Error) => {
          console.log(err);
          return res.status(500).send(err.toString());
        });
    } else {
      return res.status(401).send('Unauthorized access');
    }
});

router.get('/delete/:annotation_id', async (req: express.Request, res: express.Response) => {
  const annotation_id: string = req.params.annotation_id;
  const userID: any = req.query.userid;

  annotations
    .findOneAndDelete({annotation_id: annotation_id, userID: userID})
    .then(() => {
      return res.status(200).send('deleted with success');
    })
    .catch((err: Error) => {
      return res.status(500).send(err.toString());
    })
});

export default router;
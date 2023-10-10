import express, { Router } from "express";
import annotations, { annotationDoc } from "../db/annotations";
import manifests from "../db/manifests";

const router: express.Router = Router();

//マニフェストのURIとアノテーションを同時に返す
router.get('/:manifest_id', async (req: express.Request, res: express.Response) => {
    const manifest_id: string = req.params.manifest_id;

    const manifest: Promise<any> = manifests.findOne({manifest_id:manifest_id});
    const annotation: Promise<any> = annotations.find({manifest_id:manifest_id});
    const [res_manifest, res_annotation]: any[] = await Promise.all([manifest, annotation]);

    res.json(
      {
        manifest: res_manifest,
        annotation: res_annotation,
      }
    );
});

router.post('/:manifest_id', (req: express.Request, res: express.Response) => {
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
});

export default router;
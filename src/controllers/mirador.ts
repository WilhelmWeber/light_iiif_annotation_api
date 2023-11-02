//nextの方にはモジュールの依存関係でMiradorがインストールできないので苦肉の策でMiradorのHTMLをサーバー側でレンダーする。
import express, { Router } from "express";

const router: express.Router = Router();

router.get('/:manifest_id', (req: express.Request, res: express.Response) => {
    const base_uri: string = process.env.BASE_URI || 'http://localhost:8080';
    const manifest_id: string = req.params.manifest_id;

    const manifest_uri: string = `${base_uri}/presentation/${manifest_id}/manifest.json`;

    res.render('./mirador.ejs', {
        manifest_uri: manifest_uri,
    });
});

export default router;
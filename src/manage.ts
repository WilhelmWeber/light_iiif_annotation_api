import express from 'express';
import cors from 'cors';
import annotationAPI from './controllers/annotation_api';
import manifestsAPI from './controllers/manifests_api'
import presentationAPI from './controllers/mod_presentation_api';
import mirador from './controllers/mirador';
import mongoose from 'mongoose';
import "dotenv/config";

const port: string | number = process.env.PORT || 8080;

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

mongoose.connect(process.env.DB_PATH ? process.env.DB_PATH: "");
mongoose.Promise = global.Promise;

app.use('/anedit', annotationAPI);
app.use('/manifests', manifestsAPI);
app.use('/presentation', presentationAPI);
app.use('/viewer', mirador);

app.listen(port, () => {
    console.log(`server established at port ${port}`);
});
import mongoose, { Schema, Document} from "mongoose";

export interface annotationDoc extends Document {
    manifest_id: String,
    canvas: Number;
    annotation_id: String,
    chars: String,
    on: String,
    imageURI: String,
    userID: String,
}

const annotationSchema: Schema = new Schema(
    {
        manifest_id: {
            type: String,
            required: true,
        },
        canvas: {
            type: Number,
            required: true,
        },
        annotation_id : {
            type: String,
            required: true,
        },
        chars: {
            type: String,
            required: true,
        },
        on: {
            type: String,
            required: true,
        },
        imageURI : {
            type: String,
            required: true,
        },
        userID: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<annotationDoc>('annotations', annotationSchema);
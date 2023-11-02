import mongoose, { Schema, Document} from "mongoose";

export interface manifestDoc extends Document {
    manifest_id: String,
    label: String,
    attribution: String,
    license: String,
    contributor: String,
    manifest_uri: String,
    userID: String,
};

const manifestSchema: Schema = new Schema(
    {
        manifest_id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        attribution: {
            type: String,
            required: true,
        },
        license: {
            type: String,
            required: true,
        },
        contributor: {
            type: String,
            required: true,
        },
        manifest_uri: {
            type: String,
            required: true,
        },
        userID : {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<manifestDoc>('manifests_annotation', manifestSchema);
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    tag: {
        type: {
            title: { type: String, required: true },
            label: { type: String, required: true },
        },
        required: true,
    },
    additional_tags: {
        type: [
            {
                title: { type: String, required: true },
                label: { type: String, required: true },
            },
        ],
        required: true,
    },
});

module.exports = mongoose.model("resources", resourceSchema);

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const { promisify } = require("util");
const mongoose = require("mongoose");
const ResourceModel = require("./models/Resource.model");

const ALLOWED_EXTENSIONS = /png|jpg|jpeg/;

const app = express();

mongoose
    .connect("mongodb://localhost/grype")
    .then(() => console.log("Connected to mongodb"));

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

app.get("/", (_, res) => res.sendFile(path.resolve("public", "index.html")));

app.post("/uploads", async (req, res) => {
    const image = req.files.image;
    const fileName = image.name;
    const ext = path.extname(fileName);

    if (!ALLOWED_EXTENSIONS.test(ext)) {
        throw "Unsupported image type";
    }

    const url = `${path.resolve("uploads")}/${fileName}`;

    await promisify(image.mv)(url);

    res.json({ msg: "Success!" });
});

app.post("/resources", async (req, res) => {
    try {
        const { tag, additional_tags } = req.body;
        const newResource = new ResourceModel({ tag, additional_tags });
        const saved = await newResource.save();
        console.log("saved: ", saved);
        res.send(saved);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

app.listen(5000, () => console.log("Server running"));

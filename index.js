const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const { promisify } = require("util");

const ALLOWED_EXTENSIONS = /png|jpg|jpeg/;

const app = express();

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

app.listen(5000, () => console.log("Server running"));

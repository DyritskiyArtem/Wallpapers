const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path"); // Додано імпорт 'path'

let photoLinks = require("./photoLinks.json");

const app = express();
app.use(express.static("public"));

const port = 3000;

// Налаштування сховища для завантажених файлів
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  let html = `
    <html>
    <head>
        <title>Wallpapers</title>
        <link rel="stylesheet" href="./style.css">

        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
        <link rel="manifest" href="favicons/site.webmanifest">
        <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#faebd6">
        <meta name="msapplication-TileColor" content="#faebd6">
        <meta name="theme-color" content="#faebd6">

        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    </head>
    <body>
        <header>
            <h1>Wallpapers Dyritskiy</h1>
        </header>

        <form method='POST' action='/' enctype='multipart/form-data'>
            <input name='file' type='file' accept="image/*">
            <button type='submit'>Add photo</button>
        </form>
        `;

  html += `<div class="gallery">`;
  for (let i = 0; i < photoLinks.length; i++) {
    const photoLink = photoLinks[i];

    html += `
      <div class="gallery-item">
        <img src="${photoLink}" alt="Uploaded image">
        <p>${photoLink}</p>
        <a href='${photoLink}' download>Download</a>
      </div>`
  }

  html += `</div> 
    </body>
    </html>`;

    console.log(__dirname);

  res.send(html);
});

app.post("/", upload.single("file"), (req, res) => {
    let html = `
    <html>
    <head>
        <title>Wallpapers</title>
        <link rel="stylesheet" href="./style.css">

        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
        <link rel="manifest" href="favicons/site.webmanifest">
        <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#faebd6">
        <meta name="msapplication-TileColor" content="#faebd6">
        <meta name="theme-color" content="#faebd6">

        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    </head>
    <body>
        <header class='header2'>
            <h1>Wallpapers Dyritskiy</h1>
            <nav>
                <ul>
                    <li><a href='/'>Back</a></li>
                </ul>
            </nav>
        </header>
    `;
  if (req.file === undefined) {
    html += "<div class='container'><p>The file is not specified</p></div>";
    res.send(html);
  }
  else{
    html += "<div class='container'><p>Your image has been uploaded</p></div>";
    res.send(html);
  }

  html += `</div> 
  </body>
  </html>`;

  let link = "uploads/" + req.file.filename;
  photoLinks.push(link);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
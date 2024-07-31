const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path"); // Додано імпорт 'path'

const collectionLinks1 = require("./collectionLinks1.json");
const collectionLinks2 = require("./collectionLinks2.json");

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
        <title>All Collections</title>
        <link rel="stylesheet" href="./style.css">

        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
        <link rel="manifest" href="favicons/site.webmanifest">
        <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#faebd6">
        <meta name="msapplication-TileColor" content="#faebd6">
        <meta name="theme-color" content="#faebd6">
    </head>
    <body>
        <header>
            <h1>All collections</h1>
            <nav>
                <ul>
                    <li><a href='/collection1'>Collection 1</a></li>
                    <li><a href='/collection2'>Collection 2</a></li>
                </ul>
            </nav>
        </header>

        <form method='POST' action='/' enctype='multipart/form-data'>
            <input name='file' type='file' accept="image/*">
            <button type='submit'>Add photo</button>
        </form>
        `;

  html += `<div class="gallery">`;
  for (let i = 0; i < collectionLinks1.length; i++) {
    const collectionLink1 = collectionLinks1[i];

    html += `
      <div class="gallery-item">
        <img src="${collectionLink1}" alt="Uploaded image">
        <p>${collectionLink1}</p>
        <a href='${collectionLink1}' download>Download</a>
      </div>`
  }

  html += `</div>`;
  html += `<div class="gallery">`;

  for (let i = 0; i < collectionLinks2.length; i++) {
    const collectionLink2 = collectionLinks2[i];

   html += `
    <div class="gallery-item">
      <img src="${collectionLink2}" alt="Uploaded image">
      <p>${collectionLink2}</p>
      <a href='${collectionLink2}' download>Download</a>
    </div>`;
  }
  html += `</div> 
    </body>
    </html>`;

  res.send(html);
});

app.post("/", upload.single("file"), (req, res) => {
  if (req.file === undefined) {
    let html = "Файл не вказано";
    res.send(html);
  }
  else{
    let html = "Ваша картинка завантажена";
    res.send(html);
  }

  let link = "uploads/" + req.file.filename;
  collectionLinks1.push(link);
});

app.get("/collection1", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  let html = `
    <html>
    <head>
        <title>Collections 1</title>
        <link rel="stylesheet" href="./style.css">

        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
        <link rel="manifest" href="favicons/site.webmanifest">
        <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#faebd6">
        <meta name="msapplication-TileColor" content="#faebd6">
        <meta name="theme-color" content="#faebd6">
    </head>
    <body>

    <header>
        <h1>Collection 1</h1> <br>
        <nav>
            <ul>
                <li><a href='/'>Back</a></li>
            </ul>
        </nav>
    </header>`;
    html += `<div class="gallery">`;

    for (let i = 0; i < collectionLinks1.length; i++) {
      const collectionLink1 = collectionLinks1[i];
  
     html += `
      <div class="gallery-item">
        <img src="${collectionLink1}" alt="Uploaded image">
        <p>${collectionLink1}</p>
        <a href='${collectionLink1}' download>Download</a>
      </div>`;
    }
    html += `</div>
    </body>
    </html>`;

  res.send(html);
});

app.get("/collection2", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  let html = `
    <html>
    <head>
        <title>Collections 2</title>
        <link rel="stylesheet" href="./style.css">

        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
        <link rel="manifest" href="favicons/site.webmanifest">
        <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#faebd6">
        <meta name="msapplication-TileColor" content="#faebd6">
        <meta name="theme-color" content="#faebd6">
    </head>
    <body>

    <header>
        <h1>Collection 2</h1> <br>
        <nav>
            <ul>
            <li><a href='/'>Back</a></li>
            </ul>
        </nav>
    </header>`;

    html += `<div class="gallery">`;

    for (let i = 0; i < collectionLinks2.length; i++) {
      const collectionLink2 = collectionLinks2[i];
  
     html += `
      <div class="gallery-item">
        <img src="${collectionLink2}" alt="Uploaded image">
        <p>${collectionLink2}</p>
        <a href='${collectionLink2}' download>Download</a>
      </div>`;
    }
    html += `</div> 
    </body>
    </html>`;

  res.send(html);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

let photoLinks = require("./photoLinks.json");
let tags = [];

for (let i = 0; i < photoLinks.length; i++) {
  const photoLink = photoLinks[i];
  for (let j = 0; j < photoLink.tag.length; j++) {
    const tag = photoLink.tag[j];

    if (!tags.includes(tag)) {
      tags.unshift(tag);
    }
  }
}

tags.sort();

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

  let {tag} = req.query;
  console.log(tag);

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
        ${tag !== undefined ?
          `<header class='header2'>
            <h1>Wallpapers Dyritskiy</h1>
            <nav>
              <ul>
                  <li><a href='/'>Back</a></li>
              </ul>
            </nav>
          </header>` :
            
          `<header>
            <h1>Wallpapers Dyritskiy</h1>
          </header>`  
        }

        <div class='container'>
          <div>
            <form method='POST' action='/' enctype='multipart/form-data'>
                <input name='file' type='file' accept="image/*">

                <div class='divInput'>
                  <label>Name photo</label>          
                  <input name='name' type='text'>  
                  
                  <label>Tag</label>            
                  <input name='tag' type='text'/>
                </div>

                <button type='submit'>Add photo</button>
            </form>
          </div>

          <div class='divTag'>
            <h1>Tag</h1>
              <div class='aTag'>
    `;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    html += `<a href='./?tag=${tag}'>${tag} </a>`;
  }
  html += `
        </div>
      </div>
    </div>
  `;

  html += `<div class="gallery">`;
  for (let i = 0; i < photoLinks.length; i++) {
    const photoLink = photoLinks[i];
    if (tag === undefined || photoLink.tag.includes(tag)) {
      html += `
      <div class="gallery-item" id='gallery'>
        <img src="${photoLink.img}" alt="Uploaded image">
        <p>${photoLink.name}</p>
        <p>${photoLink.tag}</p>
        <a href='${photoLink.img}' download>Download</a>
      </div>`
    }
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
    html += "<div class='container2'><p>The file is not specified</p></div>";
    res.status(400).send(html);
    return;
  }

  let { name, tag } = req.body;

  let userTags = tag.split(',');
  for (let i = 0; i < userTags.length; i++) {
    let userTag = userTags[i];
     if (!tags.includes(userTag)) {
      tags.unshift(userTag);
    }
  }

  tags.sort();

  if (name.length < 3 || name.length > 25) {
    html += "<div class='container2'><p>Name must be between 3 and 25 characters long.</p></div>";
    res.status(400).send(html);
    return;
  }

  html += `
      <div class='container2'><p>Your image has been uploaded</p></div>
    </div> 
  </body>
  </html>`;

  let imgLink = "uploads/" + req.file.filename;
  photoLinks.push({name, tag, img: imgLink});
  res.send(html);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
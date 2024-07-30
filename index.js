const express = require('express')
const multer = require('multer');
const fs = require("fs");

const collectionLinks1 = require('./collectionLinks1.json');
const collectionLinks2 = require('./collectionLinks2.json');

const app = express()
app.use(express.static('public'))

const port = 3000

// Налаштування сховища для завантажених файлів
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    let html = `
    
    <html>
    <head>
        <link rel="stylesheet" href="./style.css">
    </head>
    <body>

        <header>
            <h1>All collections</h1> <br>
            <nav>
                <ul>
                 <li><a href='/collection1'>Collection 1</a></li>
                 <li><a href='/collection2'>Collection 2</a></li>
                <ul>
            <nav>
        </header>

        <form method='POST' action='/'>
            <input name='file' type='file'> <br>
            <button>Add photo</button>
        </form>
        
        
        `;

    html += "<ul>";
    for (let i = 0; i < collectionLinks1.length; i++) {
        const collectionLink1 = collectionLinks1[i];
        
        html += `<li>
                    <img src="${collectionLink1}"> <br>
                    <p>${collectionLink1}</p> <br>
                    <a href='${collectionLink1}' download> Download </a>
                </li>`
    }

    for (let i = 0; i < collectionLinks2.length; i++) {
        const collectionLink2 = collectionLinks2[i];
        
        html += `<li>
                    <img src="${collectionLink2}""> <br>
                    <p>${collectionLink2}</p> <br>
                    <a href='${collectionLink2}' download> Download </a>
                </li>`
    }
    html += `</ul> 
    </body>
    </html>`;




    res.send(html);
})

app.post("/", upload.single('file'), (req, res) => {
    let html = "Ваша картинка завантажена";

    res.send(html);
})

app.get('/collection1', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    let html = `
    <html>
    <head>
        <link rel="stylesheet" href="./style.css">
    </head>
    <body>

    <header>
        <h1>Collection 1</h1> <br>
        <nav>
            <ul>
                <li><a href='/'>Back</a></li>
            <ul>
        <nav>
    </header>`;
    html += "<ul>";
    for (let i = 0; i < collectionLinks1.length; i++) {
        const collectionLink1 = collectionLinks1[i];
        
        html += `<li>
                    <img src="${collectionLink1}"> <br>
                    <p>${collectionLink1}</p> <br>
                    <a href='${collectionLink1}' download> Download </a>
                </li>`
    }
    html += `</ul>
    </body>
    </html>`;



    res.send(html);
})

app.get('/collection2', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    let html = `
    <html>
    <head>
        <link rel="stylesheet" href="./style.css">
    </head>
    <body>

    <header>
        <h1>Collection 2</h1> <br>
        <nav>
            <ul>
            <li><a href='/'>Back</a></li>
            <ul>
        <nav>
    </header>`;

    html += "<ul>";
    for (let i = 0; i < collectionLinks2.length; i++) {
        const collectionLink2 = collectionLinks2[i];
        
        html += `<li>
                    <img src="${collectionLink2}"> <br>
                    <p>${collectionLink2}</p> <br>
                    <a href='${collectionLink2}' download> Download </a>
                </li>`
    }
    html += `</ul>
    </body>
    </html>`;



    res.send(html);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
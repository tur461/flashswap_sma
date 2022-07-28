// Create express app
const express = require('express');
const { CONFIG } =  require('./constants.js');
const app = express()

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.use(function(req, res){
    res.status(404);
});

app.listen(CONFIG.HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", CONFIG.HTTP_PORT))
});
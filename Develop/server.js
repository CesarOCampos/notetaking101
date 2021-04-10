const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Sets up the Express App Server
const app = express();
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
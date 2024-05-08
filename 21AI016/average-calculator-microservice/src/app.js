const express = require('express');
const { validateQualifiedId, handleRequest } = require('./middleware');

const app = express();
const PORT = 3000;

app.get('/numbers/:qualifiedId', validateQualifiedId, handleRequest);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

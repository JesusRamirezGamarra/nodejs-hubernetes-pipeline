const express = require('express');
const app = express();

const PORT = 3000;

app.get('/api/hello', (req, res) => {
    console.log('---INVOCANDO SERVICIO HELLO');
    res.json({message: 'Hola mundo!'});
})

app.get('/api/message', (req, res) => {
    console.log('---INVOCANDO SERVICION MESSAGE');
    res.json({message: 'Endpoint de message!'});
})

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('Server running on port:', PORT)
    })
}
const express = require('express');
const app = express();
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/reports', require('./routes/reports'));

app.listen(3000, ()=>console.log('API running on http://localhost:3000'));


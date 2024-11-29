const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json())
app.get('/api/test',(req,res)=>{
    res.json('test ok')
});

//to create a new transaction in database
app.post('/api/transaction',async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL)
    const {price,name,description,datetime} = req.body;
    const transaction = await Transaction.create({price,name,description,datetime});
    res.json(transaction);
})

//retrieve all transactions stored in the database
app.get('/api/transactions', async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
}) 

app.delete('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    await Transaction.deleteMany({});
    res.json({ message: 'All transactions have been cleared.' });
});

app.listen(4040);

import express from 'express';
import connectToDatabase from './db/db.js';
import incomeRouter from './routes/income.js';
import expenseRouter from './routes/expense.js';
import cors from 'cors';

const app = express();
app.use(express.json())
app.use('/public/uploads', express.static('public/uploads'));
connectToDatabase()

app.use(cors())
app.use('/api/income',incomeRouter);
app.use('/api/expenses',expenseRouter);


app.get('/', (req,res)=>{
    res.send("hello world");
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
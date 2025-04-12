import express from 'express';
import { addIncome, getTotalIncome } from '../controllers/incomeController.js';

const router = express.Router();
router.post('/add', addIncome);
router.get('/total', getTotalIncome);

export default router;
import express from 'express';
import {
  getDailyReport,
  getMostOrderedItems,
  getSummaryReport
} from '../controllers/report.controller.js';

const router = express.Router();

router.get('/daily', getDailyReport);
router.get('/most-ordered', getMostOrderedItems);
router.get('/summary', getSummaryReport);

export default router;
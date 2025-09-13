import express from 'express';
import { body } from 'express-validator';
import { validate } from '../../Middlewares/validation.js';
import { authenticate } from '../../Middlewares/auth.js';
import { InquiryController } from '../../Controllers/inquiry.js';
import {
  createInquiryValidation,
  updateInquiryValidation,
  stageUpdateValidation,
  addDetailValidation,
  addPaymentValidation,
  createInvoiceValidation,
  listQueryValidation
} from './inquiryValidations.js';

const router = express.Router();
const inquiryController = new InquiryController();

// Create inquiry
// router.post('/', authenticate, validate(createInquiryValidation), inquiryController.create);
router.post('/', validate(createInquiryValidation), inquiryController.create);

// List inquiries
router.get('/', authenticate, validate(listQueryValidation), inquiryController.list);

// Board data
router.get('/board', authenticate, inquiryController.getBoardData);

// Stats
router.get('/stats', authenticate, inquiryController.getDashboardStats);

// Export
router.get('/export', authenticate, validate(listQueryValidation), inquiryController.export);

// By ID
router.get('/:id', authenticate, validate([updateInquiryValidation[0]]), inquiryController.getById);

// Update
router.put('/:id', authenticate, validate(updateInquiryValidation), inquiryController.update);

// Stage update
router.patch('/:id/stage', authenticate, validate(stageUpdateValidation), inquiryController.updateStage);

// Assign
router.patch('/:id/assign', authenticate, validate([
  updateInquiryValidation[0], // param('id').isInt()
  body('assigned_to').isInt().withMessage('Invalid user ID')
]), inquiryController.assignInquiry);

// Delete
router.delete('/:id', authenticate, validate([updateInquiryValidation[0]]), inquiryController.delete);

// Bulk update
router.patch('/bulk/update', authenticate, validate([
  body('inquiry_ids').isArray({ min: 1 }).withMessage('Inquiry IDs array is required'),
  body('inquiry_ids.*').isInt().withMessage('Invalid inquiry ID'),
  body('updates').isObject().withMessage('Updates object is required')
]), inquiryController.bulkUpdate);

// Details
router.post('/:id/details', authenticate, validate(addDetailValidation), inquiryController.addDetail);
router.get('/:id/details', authenticate, validate([updateInquiryValidation[0]]), inquiryController.getDetails);

// Payments
router.post('/:id/payments', authenticate, validate(addPaymentValidation), inquiryController.addPayment);
router.get('/:id/payments', authenticate, validate([updateInquiryValidation[0]]), inquiryController.getPayments);

// Invoices
router.post('/:id/invoices', authenticate, validate(createInvoiceValidation), inquiryController.createInvoice);
router.get('/:id/invoices', authenticate, validate([updateInquiryValidation[0]]), inquiryController.getInvoices);

// Stage history
router.get('/:id/stage-history', authenticate, validate([updateInquiryValidation[0]]), inquiryController.getStageHistory);

// Timeline
router.get('/:id/timeline', authenticate, validate([updateInquiryValidation[0]]), inquiryController.getTimeline);

export default router;

import { body, param, query } from 'express-validator';

export const createInquiryValidation = [
    body('inquiry_name')
        .notEmpty().withMessage('Inquiry name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Inquiry name must be between 2-100 characters'),
    body('inquiry_type')
        .isIn(['hotel', 'ticket', 'transport']).withMessage('Invalid inquiry type. Must be hotel, ticket, or transport'),
    body('customer_name')
        .notEmpty().withMessage('Customer name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Customer name must be between 2-100 characters'),
    body('customer_phone')
        .notEmpty().withMessage('Customer phone is required')
        .isMobilePhone().withMessage('Invalid phone number format'),
    body('customer_email')
        .optional().isEmail().withMessage('Invalid email format'),
    body('adults_count')
        .optional().isInt({ min: 1, max: 50 }).withMessage('Adults count must be between 1-50'),
    body('children_count')
        .optional().isInt({ min: 0, max: 20 }).withMessage('Children count must be between 0-20'),
    body('tentative_date')
        .notEmpty().withMessage('Tentative date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('inquiry_priority')
        .optional().isIn(['high', 'medium', 'low']).withMessage('Invalid priority. Must be high, medium, or low'),
    body('followup_date')
        .optional().isISO8601().withMessage('Invalid followup date format'),

    // Hotel
    body('hotel_details.checkin_date')
        .if(body('inquiry_type').equals('hotel'))
        .notEmpty().withMessage('Check-in date is required for hotel bookings')
        .isISO8601().withMessage('Invalid check-in date format'),
    body('hotel_details.checkout_date')
        .if(body('inquiry_type').equals('hotel'))
        .notEmpty().withMessage('Check-out date is required for hotel bookings')
        .isISO8601().withMessage('Invalid check-out date format'),
    body('hotel_details.destination')
        .if(body('inquiry_type').equals('hotel'))
        .notEmpty().withMessage('Destination is required for hotel bookings'),
    body('hotel_details.hotel_category')
        .if(body('inquiry_type').equals('hotel'))
        .isIn(['1_star', '2_star', '3_star', '4_star', '5_star', 'luxury']).withMessage('Invalid hotel category'),

    // Ticket
    body('ticket_details.destination')
        .if(body('inquiry_type').equals('ticket'))
        .notEmpty().withMessage('Destination is required for ticket bookings'),
    body('ticket_details.travel_date')
        .if(body('inquiry_type').equals('ticket'))
        .notEmpty().withMessage('Travel date is required for ticket bookings')
        .isISO8601().withMessage('Invalid travel date format'),
    body('ticket_details.travel_mode')
        .if(body('inquiry_type').equals('ticket'))
        .isIn(['air', 'train']).withMessage('Invalid travel mode. Must be air or train'),

    // Transport
    body('transport_details.destination')
        .if(body('inquiry_type').equals('transport'))
        .notEmpty().withMessage('Destination is required for transport bookings'),
    body('transport_details.pickup_date')
        .if(body('inquiry_type').equals('transport'))
        .notEmpty().withMessage('Pickup date is required for transport bookings')
        .isISO8601().withMessage('Invalid pickup date format')
];

export const updateInquiryValidation = [
    param('id').isInt().withMessage('Invalid inquiry ID'),
    body('customer_phone').optional().isMobilePhone().withMessage('Invalid phone number format'),
    body('customer_email').optional().isEmail().withMessage('Invalid email format'),
    body('tentative_date').optional().isISO8601().withMessage('Invalid date format'),
    body('inquiry_priority').optional().isIn(['high', 'medium', 'low']).withMessage('Invalid priority')
];

export const stageUpdateValidation = [
    param('id').isInt().withMessage('Invalid inquiry ID'),
    body('stage').isIn(['new', 'in_progress', 'waiting_for_customer', 'need_changes', 'approved', 'closed', 'cancelled']).withMessage('Invalid stage'),
    body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

export const addDetailValidation = [
    param('id').isInt().withMessage('Invalid inquiry ID'),
    body('type').isIn(['quotation', 'note', 'reminder']).withMessage('Invalid detail type'),
    body('title').notEmpty().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2-200 characters'),
    body('description').optional().isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('reminder_date')
        .if(body('type').equals('reminder'))
        .notEmpty().withMessage('Reminder date is required for reminder type')
        .isISO8601().withMessage('Invalid reminder date format')
];

export const addPaymentValidation = [
    param('id').isInt().withMessage('Invalid inquiry ID'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('payment_method').isIn(['cash', 'card', 'bank_transfer', 'upi', 'cheque']).withMessage('Invalid payment method'),
    body('payment_date').optional().isISO8601().withMessage('Invalid payment date format')
];

export const createInvoiceValidation = [
    param('id').isInt().withMessage('Invalid inquiry ID'),
    body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a valid amount'),
    body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be a valid amount'),
    body('invoice_items').isArray({ min: 1 }).withMessage('At least one invoice item is required'),
    body('invoice_items.*.description').notEmpty().withMessage('Item description is required'),
    body('invoice_items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
    body('invoice_items.*.rate').isFloat({ min: 0 }).withMessage('Item rate must be a valid amount')
];

export const listQueryValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
    query('stage').optional().isIn(['new', 'in_progress', 'waiting_for_customer', 'need_changes', 'approved', 'closed', 'cancelled']).withMessage('Invalid stage filter'),
    query('inquiry_type').optional().isIn(['hotel', 'ticket', 'transport']).withMessage('Invalid inquiry type filter'),
    query('priority').optional().isIn(['high', 'medium', 'low']).withMessage('Invalid priority filter')
];

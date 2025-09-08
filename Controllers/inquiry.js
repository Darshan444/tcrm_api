// Controllers/inquiry.js
import { InquiryModel } from '../Models/Inquiry.js';

const inquiryModel = new InquiryModel();

export class InquiryController {
    
    // Create new inquiry
    async create(req, res) {
        try {
            const data = await inquiryModel.create(req.body, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.CREATED) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.created(data, 'Inquiry created successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get all inquiries with filters, pagination, and search
    async list(req, res) {
        try {
            const data = await inquiryModel.list(req.query);
            res.handler.success(data, 'Inquiries fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get inquiry by ID with all details
    async getById(req, res) {
        try {
            const data = await inquiryModel.getById(req.params.id);
            
            if (!data) {
                return res.handler.notFound(undefined, 'Inquiry not found');
            }
            
            res.handler.success(data, 'Inquiry details fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Update inquiry
    async update(req, res) {
        try {
            const data = await inquiryModel.update(req.params.id, req.body, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.SUCCESS) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.success(data, 'Inquiry updated successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Update inquiry stage
    async updateStage(req, res) {
        try {
            const { stage, notes } = req.body;
            const data = await inquiryModel.updateStage(req.params.id, stage, notes, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.SUCCESS) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.success(data, 'Inquiry stage updated successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Delete inquiry (soft delete)
    async delete(req, res) {
        try {
            const data = await inquiryModel.delete(req.params.id, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.SUCCESS) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.success(undefined, 'Inquiry deleted successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get inquiry board data (Kanban view)
    async getBoardData(req, res) {
        try {
            const data = await inquiryModel.getBoardData(req.query);
            res.handler.success(data, 'Board data fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Add inquiry detail (quotation, note, reminder)
    async addDetail(req, res) {
        try {
            const data = await inquiryModel.addDetail(req.params.id, req.body, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.CREATED) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.created(data, 'Detail added successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get inquiry details (quotations, notes, reminders)
    async getDetails(req, res) {
        try {
            const data = await inquiryModel.getDetails(req.params.id, req.query);
            res.handler.success(data, 'Details fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Add payment
    async addPayment(req, res) {
        try {
            const data = await inquiryModel.addPayment(req.params.id, req.body, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.CREATED) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.created(data, 'Payment added successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get payments
    async getPayments(req, res) {
        try {
            const data = await inquiryModel.getPayments(req.params.id);
            res.handler.success(data, 'Payments fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Create invoice
    async createInvoice(req, res) {
        try {
            const data = await inquiryModel.createInvoice(req.params.id, req.body, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.CREATED) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.created(data, 'Invoice created successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get invoices
    async getInvoices(req, res) {
        try {
            const data = await inquiryModel.getInvoices(req.params.id);
            res.handler.success(data, 'Invoices fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get stage history
    async getStageHistory(req, res) {
        try {
            const data = await inquiryModel.getStageHistory(req.params.id);
            res.handler.success(data, 'Stage history fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get dashboard statistics
    async getDashboardStats(req, res) {
        try {
            const data = await inquiryModel.getDashboardStats(req.query);
            res.handler.success(data, 'Dashboard stats fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Assign inquiry to user
    async assignInquiry(req, res) {
        try {
            const { assigned_to } = req.body;
            const data = await inquiryModel.assignInquiry(req.params.id, assigned_to, req.user?.id);
            
            if (data.status && data.status !== STATUS_CODES.SUCCESS) {
                return res.handler.custom(data.status, data.message);
            }
            
            res.handler.success(data, 'Inquiry assigned successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Bulk operations
    async bulkUpdate(req, res) {
        try {
            const { inquiry_ids, updates } = req.body;
            const data = await inquiryModel.bulkUpdate(inquiry_ids, updates, req.user?.id);
            
            res.handler.success(data, `${data.updated_count} inquiries updated successfully`);
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Export inquiries
    async export(req, res) {
        try {
            const data = await inquiryModel.export(req.query);
            res.handler.success(data, 'Export data prepared successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }

    // Get inquiry timeline
    async getTimeline(req, res) {
        try {
            const data = await inquiryModel.getTimeline(req.params.id);
            res.handler.success(data, 'Timeline fetched successfully');
        } catch (error) {
            res.handler.serverError(error);
        }
    }
}
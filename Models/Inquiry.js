// Models/Inquiry.js
import db from '../Database/Schema/index.js';
import { Op } from 'sequelize';

const { 
    inquiry, 
    inquiry_hotel_detail, 
    inquiry_ticket_detail, 
    inquiry_transport_detail,
    inquiry_stage_history,
    inquiry_detail,
    inquiry_payment,
    inquiry_invoice,
    user
} = db;

export class InquiryModel {

    async create(data, userId) {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Validate required fields based on inquiry type
            const validation = this.validateInquiryData(data);
            if (!validation.isValid) {
                return {
                    status: STATUS_CODES.VALIDATION_ERROR,
                    message: validation.message
                };
            }

            // Create main inquiry record
            const inquiryData = {
                inquiry_name: data.inquiry_name,
                inquiry_type: data.inquiry_type,
                customer_name: data.customer_name,
                customer_phone: data.customer_phone,
                customer_email: data.customer_email,
                adults_count: data.adults_count || 1,
                children_count: data.children_count || 0,
                children_ages: data.children_ages || null,
                tentative_date: data.tentative_date,
                inquiry_priority: data.inquiry_priority || 'medium',
                contact_person_name: data.contact_person_name,
                contact_person_phone: data.contact_person_phone,
                followup_date: data.followup_date,
                notes: data.notes,
                created_by: userId,
                stage: 'new'
            };

            const newInquiry = await inquiry.create(inquiryData, { transaction });

            // Create type-specific details
            await this.createTypeSpecificDetails(newInquiry.id, data, transaction);

            // Create initial stage history
            await inquiry_stage_history.create({
                inquiry_id: newInquiry.id,
                from_stage: null,
                to_stage: 'new',
                changed_by: userId,
                notes: 'Inquiry created'
            }, { transaction });

            await transaction.commit();

            // Fetch complete inquiry data
            return await this.getById(newInquiry.id);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async list(queryParams = {}) {
        const {
            page = 1,
            limit = 20,
            search = '',
            stage = '',
            inquiry_type = '',
            priority = '',
            assigned_to = '',
            date_from = '',
            date_to = '',
            sort_by = 'created_at',
            sort_order = 'DESC'
        } = queryParams;

        const offset = (page - 1) * limit;
        const where = { status: true };

        // Search in inquiry name, customer name, or customer phone
        if (search) {
            where[Op.or] = [
                { inquiry_name: { [Op.iLike]: `%${search}%` } },
                { customer_name: { [Op.iLike]: `%${search}%` } },
                { customer_phone: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filters
        if (stage) where.stage = stage;
        if (inquiry_type) where.inquiry_type = inquiry_type;
        if (priority) where.inquiry_priority = priority;
        if (assigned_to) where.assigned_to = assigned_to;

        // Date range filter
        if (date_from && date_to) {
            where.tentative_date = {
                [Op.between]: [new Date(date_from), new Date(date_to)]
            };
        }

        const { rows, count } = await inquiry.findAndCountAll({
            where,
            include: [
                {
                    model: user,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: user,
                    as: 'assignee',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: inquiry_hotel_detail,
                    as: 'hotel_details',
                    attributes: ['destination', 'checkin_date', 'checkout_date']
                },
                {
                    model: inquiry_ticket_detail,
                    as: 'ticket_details',
                    attributes: ['destination', 'travel_date']
                },
                {
                    model: inquiry_transport_detail,
                    as: 'transport_details',
                    attributes: ['destination', 'pickup_date']
                }
            ],
            order: [[sort_by, sort_order.toUpperCase()]],
            offset: parseInt(offset),
            limit: parseInt(limit)
        });

        return {
            inquiries: rows,
            pagination: {
                current_page: parseInt(page),
                per_page: parseInt(limit),
                total: count,
                total_pages: Math.ceil(count / limit)
            }
        };
    }

    async getById(id) {
        const inquiryData = await inquiry.findByPk(id, {
            include: [
                {
                    model: user,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: user,
                    as: 'assignee',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: inquiry_hotel_detail,
                    as: 'hotel_details'
                },
                {
                    model: inquiry_ticket_detail,
                    as: 'ticket_details'
                },
                {
                    model: inquiry_transport_detail,
                    as: 'transport_details'
                }
            ]
        });

        if (!inquiryData || !inquiryData.status) {
            return null;
        }

        return inquiryData;
    }

    async update(id, data, userId) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const existingInquiry = await inquiry.findByPk(id, { transaction });
            if (!existingInquiry || !existingInquiry.status) {
                return {
                    status: STATUS_CODES.NOT_FOUND,
                    message: 'Inquiry not found'
                };
            }

            // Update main inquiry
            const updateData = {
                inquiry_name: data.inquiry_name || existingInquiry.inquiry_name,
                customer_name: data.customer_name || existingInquiry.customer_name,
                customer_phone: data.customer_phone || existingInquiry.customer_phone,
                customer_email: data.customer_email || existingInquiry.customer_email,
                adults_count: data.adults_count !== undefined ? data.adults_count : existingInquiry.adults_count,
                children_count: data.children_count !== undefined ? data.children_count : existingInquiry.children_count,
                children_ages: data.children_ages || existingInquiry.children_ages,
                tentative_date: data.tentative_date || existingInquiry.tentative_date,
                inquiry_priority: data.inquiry_priority || existingInquiry.inquiry_priority,
                contact_person_name: data.contact_person_name || existingInquiry.contact_person_name,
                contact_person_phone: data.contact_person_phone || existingInquiry.contact_person_phone,
                followup_date: data.followup_date || existingInquiry.followup_date,
                notes: data.notes !== undefined ? data.notes : existingInquiry.notes,
                updated_by: userId
            };

            await existingInquiry.update(updateData, { transaction });

            // Update type-specific details
            await this.updateTypeSpecificDetails(id, data, transaction);

            await transaction.commit();
            return await this.getById(id);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateStage(id, newStage, notes, userId) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const existingInquiry = await inquiry.findByPk(id, { transaction });
            if (!existingInquiry || !existingInquiry.status) {
                return {
                    status: STATUS_CODES.NOT_FOUND,
                    message: 'Inquiry not found'
                };
            }

            const oldStage = existingInquiry.stage;
            
            // Update inquiry stage
            await existingInquiry.update({ 
                stage: newStage,
                updated_by: userId 
            }, { transaction });

            // Create stage history
            await inquiry_stage_history.create({
                inquiry_id: id,
                from_stage: oldStage,
                to_stage: newStage,
                changed_by: userId,
                notes: notes || `Stage changed from ${oldStage} to ${newStage}`
            }, { transaction });

            await transaction.commit();
            return await this.getById(id);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async delete(id, userId) {
        const existingInquiry = await inquiry.findByPk(id);
        if (!existingInquiry || !existingInquiry.status) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'Inquiry not found'
            };
        }

        await existingInquiry.update({ 
            status: false,
            updated_by: userId 
        });

        return { success: true };
    }

    async getBoardData(queryParams = {}) {
        const { assigned_to = '', inquiry_type = '' } = queryParams;
        
        const where = { status: true };
        if (assigned_to) where.assigned_to = assigned_to;
        if (inquiry_type) where.inquiry_type = inquiry_type;

        const stages = ['new', 'in_progress', 'waiting_for_customer', 'need_changes', 'approved', 'closed'];
        const boardData = {};

        for (const stage of stages) {
            const inquiries = await inquiry.findAll({
                where: { ...where, stage },
                include: [
                    {
                        model: user,
                        as: 'assignee',
                        attributes: ['id', 'name']
                    },
                    {
                        model: inquiry_hotel_detail,
                        as: 'hotel_details',
                        attributes: ['destination', 'checkin_date']
                    },
                    {
                        model: inquiry_ticket_detail,
                        as: 'ticket_details',
                        attributes: ['destination', 'travel_date']
                    },
                    {
                        model: inquiry_transport_detail,
                        as: 'transport_details',
                        attributes: ['destination', 'pickup_date']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: 50
            });

            boardData[stage] = inquiries;
        }

        return boardData;
    }

    async addDetail(inquiryId, data, userId) {
        const existingInquiry = await inquiry.findByPk(inquiryId);
        if (!existingInquiry || !existingInquiry.status) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'Inquiry not found'
            };
        }

        const detailData = {
            inquiry_id: inquiryId,
            type: data.type,
            title: data.title,
            description: data.description,
            attachment: data.attachment,
            reminder_date: data.reminder_date,
            created_by: userId
        };

        const newDetail = await inquiry_detail.create(detailData);
        return newDetail;
    }

    async getDetails(inquiryId, queryParams = {}) {
        const { type = '', page = 1, limit = 20 } = queryParams;
        const offset = (page - 1) * limit;
        
        const where = { inquiry_id: inquiryId };
        if (type) where.type = type;

        const { rows, count } = await inquiry_detail.findAndCountAll({
            where,
            include: [
                {
                    model: user,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']],
            offset: parseInt(offset),
            limit: parseInt(limit)
        });

        return {
            details: rows,
            pagination: {
                current_page: parseInt(page),
                per_page: parseInt(limit),
                total: count,
                total_pages: Math.ceil(count / limit)
            }
        };
    }

    async addPayment(inquiryId, data, userId) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const existingInquiry = await inquiry.findByPk(inquiryId, { transaction });
            if (!existingInquiry || !existingInquiry.status) {
                return {
                    status: STATUS_CODES.NOT_FOUND,
                    message: 'Inquiry not found'
                };
            }

            // Create payment record
            const paymentData = {
                inquiry_id: inquiryId,
                amount: data.amount,
                payment_method: data.payment_method,
                payment_date: data.payment_date || new Date(),
                transaction_id: data.transaction_id,
                notes: data.notes,
                receipt_number: data.receipt_number || this.generateReceiptNumber(),
                created_by: userId
            };

            const newPayment = await inquiry_payment.create(paymentData, { transaction });

            // Update paid amount in inquiry
            const newPaidAmount = parseFloat(existingInquiry.paid_amount) + parseFloat(data.amount);
            await existingInquiry.update({ paid_amount: newPaidAmount }, { transaction });

            await transaction.commit();
            return newPayment;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getPayments(inquiryId) {
        const payments = await inquiry_payment.findAll({
            where: { inquiry_id: inquiryId },
            include: [
                {
                    model: user,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['payment_date', 'DESC']]
        });

        const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

        return {
            payments,
            total_paid: totalPaid
        };
    }

    async createInvoice(inquiryId, data, userId) {
        const existingInquiry = await inquiry.findByPk(inquiryId);
        if (!existingInquiry || !existingInquiry.status) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'Inquiry not found'
            };
        }

        const invoiceData = {
            inquiry_id: inquiryId,
            invoice_number: data.invoice_number || this.generateInvoiceNumber(),
            invoice_date: data.invoice_date || new Date(),
            subtotal: data.subtotal,
            gst_amount: data.gst_amount || 0,
            total_amount: data.total_amount,
            gst_number: data.gst_number,
            invoice_items: data.invoice_items,
            status: data.status || 'draft',
            created_by: userId
        };

        const newInvoice = await inquiry_invoice.create(invoiceData);
        return newInvoice;
    }

    async getInvoices(inquiryId) {
        const invoices = await inquiry_invoice.findAll({
            where: { inquiry_id: inquiryId },
            include: [
                {
                    model: user,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['invoice_date', 'DESC']]
        });

        return { invoices };
    }

    async getStageHistory(inquiryId) {
        const history = await inquiry_stage_history.findAll({
            where: { inquiry_id: inquiryId },
            include: [
                {
                    model: user,
                    as: 'changer',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'ASC']]
        });

        return { stage_history: history };
    }

    async getDashboardStats(queryParams = {}) {
        const { date_from, date_to, assigned_to } = queryParams;
        
        const where = { status: true };
        if (assigned_to) where.assigned_to = assigned_to;
        
        if (date_from && date_to) {
            where.created_at = {
                [Op.between]: [new Date(date_from), new Date(date_to)]
            };
        }

        // Stage-wise count
        const stageStats = await inquiry.findAll({
            where,
            attributes: [
                'stage',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['stage']
        });

        // Type-wise count
        const typeStats = await inquiry.findAll({
            where,
            attributes: [
                'inquiry_type',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['inquiry_type']
        });

        // Priority-wise count
        const priorityStats = await inquiry.findAll({
            where,
            attributes: [
                'inquiry_priority',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['inquiry_priority']
        });

        // Total amounts
        const totalStats = await inquiry.findAll({
            where,
            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'total_amount'],
                [db.sequelize.fn('SUM', db.sequelize.col('paid_amount')), 'paid_amount'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total_inquiries']
            ]
        });

        return {
            stage_stats: stageStats,
            type_stats: typeStats,
            priority_stats: priorityStats,
            total_stats: totalStats[0]
        };
    }

    async assignInquiry(id, assignedTo, userId) {
        const existingInquiry = await inquiry.findByPk(id);
        if (!existingInquiry || !existingInquiry.status) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: 'Inquiry not found'
            };
        }

        await existingInquiry.update({
            assigned_to: assignedTo,
            updated_by: userId
        });

        return await this.getById(id);
    }

    async bulkUpdate(inquiryIds, updates, userId) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const updateData = { ...updates, updated_by: userId };
            
            const [updatedCount] = await inquiry.update(
                updateData,
                {
                    where: {
                        id: { [Op.in]: inquiryIds },
                        status: true
                    },
                    transaction
                }
            );

            // If stage is being updated, create history entries
            if (updates.stage) {
                const inquiries = await inquiry.findAll({
                    where: { id: { [Op.in]: inquiryIds } },
                    transaction
                });

                const historyEntries = inquiries.map(inq => ({
                    inquiry_id: inq.id,
                    from_stage: inq.stage,
                    to_stage: updates.stage,
                    changed_by: userId,
                    notes: 'Bulk stage update'
                }));

                await inquiry_stage_history.bulkCreate(historyEntries, { transaction });
            }

            await transaction.commit();
            return { updated_count: updatedCount };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async export(queryParams = {}) {
        const inquiries = await this.list({ ...queryParams, limit: 10000, page: 1 });
        
        // Transform data for export
        const exportData = inquiries.inquiries.map(inq => ({
            inquiry_name: inq.inquiry_name,
            inquiry_type: inq.inquiry_type,
            customer_name: inq.customer_name,
            customer_phone: inq.customer_phone,
            adults_count: inq.adults_count,
            children_count: inq.children_count,
            tentative_date: inq.tentative_date,
            stage: inq.stage,
            priority: inq.inquiry_priority,
            total_amount: inq.total_amount,
            paid_amount: inq.paid_amount,
            created_at: inq.created_at,
            assignee: inq.assignee?.name || 'Unassigned'
        }));

        return { export_data: exportData };
    }

    async getTimeline(inquiryId) {
        const timeline = await inquiry_stage_history.findAll({
            where: { inquiry_id: inquiryId },
            include: [
                {
                    model: user,
                    as: 'changer',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'ASC']]
        });

        return { timeline };
    }

    // Helper methods
    validateInquiryData(data) {
        if (!data.inquiry_name || !data.customer_name || !data.customer_phone || !data.tentative_date) {
            return { isValid: false, message: 'Required fields are missing' };
        }
        
        if (!['hotel', 'ticket', 'transport'].includes(data.inquiry_type)) {
            return { isValid: false, message: 'Invalid inquiry type' };
        }

        return { isValid: true };
    }

    async createTypeSpecificDetails(inquiryId, data, transaction) {
        switch (data.inquiry_type) {
            case 'hotel':
                if (data.hotel_details) {
                    await inquiry_hotel_detail.create({
                        inquiry_id: inquiryId,
                        ...data.hotel_details
                    }, { transaction });
                }
                break;
            case 'ticket':
                if (data.ticket_details) {
                    await inquiry_ticket_detail.create({
                        inquiry_id: inquiryId,
                        ...data.ticket_details
                    }, { transaction });
                }
                break;
            case 'transport':
                if (data.transport_details) {
                    await inquiry_transport_detail.create({
                        inquiry_id: inquiryId,
                        ...data.transport_details
                    }, { transaction });
                }
                break;
        }
    }

    async updateTypeSpecificDetails(inquiryId, data, transaction) {
        const existingInquiry = await inquiry.findByPk(inquiryId, { transaction });
        
        switch (existingInquiry.inquiry_type) {
            case 'hotel':
                if (data.hotel_details) {
                    await inquiry_hotel_detail.update(
                        data.hotel_details,
                        { where: { inquiry_id: inquiryId }, transaction }
                    );
                }
                break;
            case 'ticket':
                if (data.ticket_details) {
                    await inquiry_ticket_detail.update(
                        data.ticket_details,
                        { where: { inquiry_id: inquiryId }, transaction }
                    );
                }
                break;
            case 'transport':
                if (data.transport_details) {
                    await inquiry_transport_detail.update(
                        data.transport_details,
                        { where: { inquiry_id: inquiryId }, transaction }
                    );
                }
                break;
        }
    }

    generateReceiptNumber() {
        return 'RCP' + Date.now() + Math.floor(Math.random() * 1000);
    }

    generateInvoiceNumber() {
        return 'INV' + Date.now() + Math.floor(Math.random() * 1000);
    }
}
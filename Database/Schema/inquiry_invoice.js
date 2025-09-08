// Database/Schema/inquiry_invoice.js
export default (sequelize, DataTypes) => {
    const InquiryInvoice = sequelize.define('inquiry_invoice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'inquiries',
                key: 'id'
            }
        },
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        invoice_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        gst_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        gst_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        invoice_items: {
            type: DataTypes.JSON, // Array of items with description, quantity, rate
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('draft', 'sent', 'paid', 'cancelled'),
            defaultValue: 'draft'
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'inquiry_invoices'
    });

    return InquiryInvoice;
};
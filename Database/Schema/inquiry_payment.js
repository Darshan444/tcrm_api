// Database/Schema/inquiry_payment.js
export default (sequelize, DataTypes) => {
    const InquiryPayment = sequelize.define('inquiry_payment', {
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
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.ENUM('cash', 'card', 'bank_transfer', 'upi', 'cheque'),
            allowNull: false
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        receipt_number: {
            type: DataTypes.STRING,
            allowNull: true
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
        tableName: 'inquiry_payments'
    });

    return InquiryPayment;
};
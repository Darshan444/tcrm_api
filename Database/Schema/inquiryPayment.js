export default (sequelize, DataTypes) => {
    const InquiryPayment = sequelize.define('inquiryPayment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'inquiries',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        paymentMethod: {
            type: DataTypes.ENUM('CASH', 'CARD', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'ONLINE'),
            allowNull: false
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        transactionId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        paymentStatus: {
            type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'),
            defaultValue: 'PENDING'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: true,
        underscored: false,
        tableName: 'inquiryPayment'
    });

    InquiryPayment.associate = (models) => {
        InquiryPayment.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
        InquiryPayment.belongsTo(models.user, { foreignKey: 'createdBy', as: 'creator' });
    };

    return InquiryPayment;
};
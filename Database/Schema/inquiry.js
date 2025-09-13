export default (sequelize, DataTypes) => {
    const Inquiry = sequelize.define('inquiry', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiryTitle: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        inquiryType: {
            type: DataTypes.ENUM('DOMESTIC', 'INTERNATIONAL'),
            allowNull: false
        },
        inquiryPriority: {
            type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
            allowNull: false,
            defaultValue: 'MEDIUM'
        },
        followupDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        inquiryDetail: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
            defaultValue: 'PENDING'
        },
        hotelBookingFlag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ticketBookingFlag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        transportBookingFlag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        totalEstimatedCost: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.00
        },
        assignedTo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        tableName: 'inquiries'
    });

    Inquiry.associate = (models) => {
        Inquiry.belongsTo(models.user, { foreignKey: 'createdBy', as: 'creator' });
        Inquiry.belongsTo(models.user, { foreignKey: 'assignedTo', as: 'assignee' });
        Inquiry.belongsTo(models.user, { foreignKey: 'updatedBy', as: 'updater' });
        
        Inquiry.hasOne(models.customerInfo, { foreignKey: 'inquiryId', as: 'customerInfo' });
        Inquiry.hasOne(models.corporateData, { foreignKey: 'inquiryId', as: 'corporateData' });
        Inquiry.hasOne(models.hotelBooking, { foreignKey: 'inquiryId', as: 'hotelBooking' });
        Inquiry.hasOne(models.ticketBooking, { foreignKey: 'inquiryId', as: 'ticketBooking' });
        Inquiry.hasOne(models.transportBooking, { foreignKey: 'inquiryId', as: 'transportBooking' });
        
        Inquiry.hasMany(models.inquiryPayment, { foreignKey: 'inquiryId', as: 'payments' });
        Inquiry.hasMany(models.inquiryStageHistory, { foreignKey: 'inquiryId', as: 'stageHistory' });
        Inquiry.hasMany(models.inquiryNotes, { foreignKey: 'inquiryId', as: 'notes' });
    };

    return Inquiry;
};
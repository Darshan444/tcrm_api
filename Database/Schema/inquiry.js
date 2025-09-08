// Database/Schema/inquiry.js
export default (sequelize, DataTypes) => {
    const Inquiry = sequelize.define('inquiry', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiry_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inquiry_type: {
            type: DataTypes.ENUM('hotel', 'ticket', 'transport'),
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        adults_count: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        children_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        children_ages: {
            type: DataTypes.JSON, // Array of ages [5, 8, 12]
            allowNull: true
        },
        tentative_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        inquiry_priority: {
            type: DataTypes.ENUM('high', 'medium', 'low'),
            defaultValue: 'medium'
        },
        contact_person_name: {
            type: DataTypes.STRING,
            allowNull: true // For corporate inquiries
        },
        contact_person_phone: {
            type: DataTypes.STRING,
            allowNull: true // For corporate inquiries
        },
        followup_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        stage: {
            type: DataTypes.ENUM('new', 'in_progress', 'waiting_for_customer', 'need_changes', 'approved', 'closed', 'cancelled'),
            defaultValue: 'new'
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        paid_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'inquiries'
    });

    Inquiry.associate = (models) => {
        Inquiry.belongsTo(models.user, { 
            foreignKey: 'created_by', 
            as: 'creator' 
        });
        Inquiry.belongsTo(models.user, { 
            foreignKey: 'assigned_to', 
            as: 'assignee' 
        });
        Inquiry.hasOne(models.inquiry_hotel_detail, { 
            foreignKey: 'inquiry_id',
            as: 'hotel_details'
        });
        Inquiry.hasOne(models.inquiry_ticket_detail, { 
            foreignKey: 'inquiry_id',
            as: 'ticket_details'
        });
        Inquiry.hasOne(models.inquiry_transport_detail, { 
            foreignKey: 'inquiry_id',
            as: 'transport_details'
        });
        Inquiry.hasMany(models.inquiry_stage_history, { 
            foreignKey: 'inquiry_id',
            as: 'stage_history'
        });
        Inquiry.hasMany(models.inquiry_detail, { 
            foreignKey: 'inquiry_id',
            as: 'details'
        });
        Inquiry.hasMany(models.inquiry_payment, { 
            foreignKey: 'inquiry_id',
            as: 'payments'
        });
        Inquiry.hasMany(models.inquiry_invoice, { 
            foreignKey: 'inquiry_id',
            as: 'invoices'
        });
    };

    return Inquiry;
};
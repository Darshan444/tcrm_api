// Database/Schema/user.js
export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_type: {
            type: DataTypes.ENUM('admin', 'manager', 'agent'),
            defaultValue: 'agent'
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'users'
    });

    User.associate = (models) => {
        // Users can create inquiries
        User.hasMany(models.inquiry, {
            foreignKey: 'created_by',
            as: 'created_inquiries'
        });
        
        // Users can be assigned inquiries
        User.hasMany(models.inquiry, {
            foreignKey: 'assigned_to',
            as: 'assigned_inquiries'
        });

        // Users can create payments
        User.hasMany(models.inquiry_payment, {
            foreignKey: 'created_by',
            as: 'payments'
        });

        // Users can create invoices
        User.hasMany(models.inquiry_invoice, {
            foreignKey: 'created_by',
            as: 'invoices'
        });

        // Users can create details (quotations, notes, reminders)
        User.hasMany(models.inquiry_detail, {
            foreignKey: 'created_by',
            as: 'inquiry_details'
        });

        // Users can change stages
        User.hasMany(models.inquiry_stage_history, {
            foreignKey: 'changed_by',
            as: 'stage_changes'
        });
    };

    return User;
};
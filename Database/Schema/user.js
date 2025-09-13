export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Name is required' },
                len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' }
            }
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: { msg: 'Email already exists' },
            validate: {
                isEmail: { msg: 'Please provide a valid email' },
                notEmpty: { msg: 'Email is required' }
            }
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: { msg: 'Username already exists' },
            validate: {
                len: { args: [3, 50], msg: 'Username must be between 3 and 50 characters' },
                notEmpty: { msg: 'Username is required' }
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Password is required' },
                len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
            }
        },
        user_type: {
            type: DataTypes.ENUM('admin', 'manager', 'agent'),
            allowNull: false,
            defaultValue: 'agent'
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        profile_image: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: { msg: 'Please provide a valid URL for profile image' }
            }
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: true,
        underscored: true, // This will use snake_case for auto-generated fields
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'users',
        
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                unique: true,
                fields: ['username']
            },
            {
                fields: ['user_type']
            },
            {
                fields: ['status']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    // Associations for inquiries (to be used later)
    User.associate = (models) => {
        // For inquiry system
        User.hasMany(models.inquiry, { 
            foreignKey: 'createdBy', 
            as: 'createdInquiries' 
        });
        User.hasMany(models.inquiry, { 
            foreignKey: 'assignedTo', 
            as: 'assignedInquiries' 
        });
        User.hasMany(models.inquiry, { 
            foreignKey: 'updatedBy', 
            as: 'updatedInquiries' 
        });
    };

    return User;
};
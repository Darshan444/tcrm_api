export default (sequelize, DataTypes) => {
    const CustomerInfo = sequelize.define('customerInfo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'inquiries',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        customerName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        customerNumber: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        customerEmail: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        noOfPersons: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        adultCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        childCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        infantCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        tableName: 'customerInfo'
    });

    CustomerInfo.associate = (models) => {
        CustomerInfo.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
        CustomerInfo.hasMany(models.childDetails, { foreignKey: 'customerInfoId', as: 'childDetails' });
        CustomerInfo.hasMany(models.infantDetails, { foreignKey: 'customerInfoId', as: 'infantDetails' });
    };

    return CustomerInfo;
};

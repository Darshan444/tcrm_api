export default (sequelize, DataTypes) => {
    const CorporateData = sequelize.define('corporateData', {
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
        isCorporateInquiry: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sameAsCustomer: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        contactPersonName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        contactPersonNumber: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        contactPersonEmail: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isEmail: true
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
        tableName: 'corporateData'
    });

    CorporateData.associate = (models) => {
        CorporateData.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
    };

    return CorporateData;
};

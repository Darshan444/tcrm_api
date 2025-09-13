export default (sequelize, DataTypes) => {
    const InfantDetails = sequelize.define('infantDetails', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerInfoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'customerInfo',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        tableName: 'infantDetails'
    });

    InfantDetails.associate = (models) => {
        InfantDetails.belongsTo(models.customerInfo, { foreignKey: 'customerInfoId', as: 'customerInfo' });
    };

    return InfantDetails;
};
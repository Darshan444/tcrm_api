export default (sequelize, DataTypes) => {
    const ChildDetails = sequelize.define('childDetails', {
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
        tableName: 'childDetails'
    });

    ChildDetails.associate = (models) => {
        ChildDetails.belongsTo(models.customerInfo, { foreignKey: 'customerInfoId', as: 'customerInfo' });
    };

    return ChildDetails;
};
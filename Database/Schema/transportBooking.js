export default (sequelize, DataTypes) => {
    const TransportBooking = sequelize.define('transportBooking', {
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
        transportDetails: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'transportBooking'
    });

    TransportBooking.associate = (models) => {
        TransportBooking.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
    };

    return TransportBooking;
};
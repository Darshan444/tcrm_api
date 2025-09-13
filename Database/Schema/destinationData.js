export default (sequelize, DataTypes) => {
    const DestinationData = sequelize.define('destinationData', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        hotelBookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'hotelBooking',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        checkInDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        checkOutDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        destinations: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        durationNights: {
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
        tableName: 'destinationData'
    });

    DestinationData.associate = (models) => {
        DestinationData.belongsTo(models.hotelBooking, { foreignKey: 'hotelBookingId', as: 'hotelBooking' });
    };

    return DestinationData;
};
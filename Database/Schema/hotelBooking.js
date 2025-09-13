export default (sequelize, DataTypes) => {
    const HotelBooking = sequelize.define('hotelBooking', {
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
        numberOfRoom: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        hotelCategory: {
            type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7'),
            allowNull: false
        },
        mealPlan: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        approxBudget: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        hotelDetail: {
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
        tableName: 'hotelBooking'
    });

    HotelBooking.associate = (models) => {
        HotelBooking.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
        HotelBooking.hasMany(models.destinationData, { foreignKey: 'hotelBookingId', as: 'destinationData' });
    };

    return HotelBooking;
};
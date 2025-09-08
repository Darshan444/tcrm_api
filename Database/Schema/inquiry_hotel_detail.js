// Database/Schema/inquiry_hotel_detail.js
export default (sequelize, DataTypes) => {
    const InquiryHotelDetail = sequelize.define('inquiry_hotel_detail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'inquiries',
                key: 'id'
            }
        },
        checkin_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        checkout_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        number_of_rooms: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        meal_plan: {
            type: DataTypes.ENUM('room_only', 'breakfast', 'half_board', 'full_board', 'all_inclusive'),
            defaultValue: 'breakfast'
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration_nights: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hotel_category: {
            type: DataTypes.ENUM('1_star', '2_star', '3_star', '4_star', '5_star', 'luxury'),
            allowNull: false
        },
        budget_per_person: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        total_budget: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'inquiry_hotel_details'
    });

    return InquiryHotelDetail;
};
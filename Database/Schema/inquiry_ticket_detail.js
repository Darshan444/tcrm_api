// Database/Schema/inquiry_ticket_detail.js
export default (sequelize, DataTypes) => {
    const InquiryTicketDetail = sequelize.define('inquiry_ticket_detail', {
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
        destination: {
            type: DataTypes.STRING,
            allowNull: false
        },
        travel_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        travel_mode: {
            type: DataTypes.ENUM('air', 'train'),
            allowNull: false
        },
        departure_from: {
            type: DataTypes.STRING,
            allowNull: true
        },
        return_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        trip_type: {
            type: DataTypes.ENUM('one_way', 'round_trip'),
            defaultValue: 'one_way'
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'inquiry_ticket_details'
    });

    return InquiryTicketDetail;
};
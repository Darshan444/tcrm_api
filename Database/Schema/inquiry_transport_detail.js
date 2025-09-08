// Database/Schema/inquiry_transport_detail.js
export default (sequelize, DataTypes) => {
    const InquiryTransportDetail = sequelize.define('inquiry_transport_detail', {
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
        vehicle_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pickup_location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        drop_location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pickup_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        pickup_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        vehicle_details: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'inquiry_transport_details'
    });

    return InquiryTransportDetail;
};
// Database/Schema/inquiry_detail.js
export default (sequelize, DataTypes) => {
    const InquiryDetail = sequelize.define('inquiry_detail', {
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
        type: {
            type: DataTypes.ENUM('quotation', 'note', 'reminder'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        attachment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reminder_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'inquiry_details'
    });

    return InquiryDetail;
};
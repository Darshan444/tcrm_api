// Database/Schema/inquiry_stage_history.js
export default (sequelize, DataTypes) => {
    const InquiryStageHistory = sequelize.define('inquiry_stage_history', {
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
        from_stage: {
            type: DataTypes.ENUM('new', 'in_progress', 'waiting_for_customer', 'need_changes', 'approved', 'closed', 'cancelled'),
            allowNull: true
        },
        to_stage: {
            type: DataTypes.ENUM('new', 'in_progress', 'waiting_for_customer', 'need_changes', 'approved', 'closed', 'cancelled'),
            allowNull: false
        },
        changed_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'inquiry_stage_histories'
    });

    return InquiryStageHistory;
};
export default (sequelize, DataTypes) => {
    const InquiryStageHistory = sequelize.define('inquiryStageHistory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'inquiries',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        fromStage: {
            type: DataTypes.ENUM('NEW', 'QUOTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
            allowNull: true
        },
        toStage: {
            type: DataTypes.ENUM('NEW', 'QUOTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
            allowNull: false
        },
        changedBy: {
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
        tableName: 'inquiryStageHistory'
    });

    InquiryStageHistory.associate = (models) => {
        InquiryStageHistory.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
        InquiryStageHistory.belongsTo(models.user, { foreignKey: 'changedBy', as: 'user' });
    };

    return InquiryStageHistory;
};
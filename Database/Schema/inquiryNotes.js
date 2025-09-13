export default (sequelize, DataTypes) => {
    const InquiryNotes = sequelize.define('inquiryNotes', {
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
        noteType: {
            type: DataTypes.ENUM('INTERNAL', 'CUSTOMER', 'REMINDER', 'FOLLOWUP'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isImportant: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        reminderDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
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
        tableName: 'inquiryNotes'
    });

    InquiryNotes.associate = (models) => {
        InquiryNotes.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
        InquiryNotes.belongsTo(models.user, { foreignKey: 'createdBy', as: 'creator' });
    };

    return InquiryNotes;
};
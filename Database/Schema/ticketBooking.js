export default (sequelize, DataTypes) => {
    const TicketBooking = sequelize.define('ticketBooking', {
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
        ticketDetail: {
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
        tableName: 'ticketBooking'
    });

    TicketBooking.associate = (models) => {
        TicketBooking.belongsTo(models.inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
        TicketBooking.hasMany(models.ticketDetailArr, { foreignKey: 'ticketBookingId', as: 'ticketDetailArr' });
    };

    return TicketBooking;
};
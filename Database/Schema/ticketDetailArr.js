export default (sequelize, DataTypes) => {
    const TicketDetailArr = sequelize.define('ticketDetailArr', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ticketBookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ticketBooking',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        fromLocation: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        toLocation: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        flightType: {
            type: DataTypes.ENUM('ONEWAY', 'ROUNDTRIP'),
            allowNull: false
        },
        noOfPerson: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        departureDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        returnDate: {
            type: DataTypes.DATEONLY,
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
        tableName: 'ticketDetailArr'
    });

    TicketDetailArr.associate = (models) => {
        TicketDetailArr.belongsTo(models.ticketBooking, { foreignKey: 'ticketBookingId', as: 'ticketBooking' });
    };

    return TicketDetailArr;
};
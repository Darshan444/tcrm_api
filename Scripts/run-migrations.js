// Scripts/run-migrations.js - Complete ES Module Migration Runner
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Running Travel CRM Database Migrations...');

// Database configuration
const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
        charset: 'utf8mb4',
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000
    },
    define: {
        underscored: true,
        timestamps: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('\n🔧 Please check your .env file:');
        console.log('DB_HOST=your-hostinger-host.com');
        console.log('DB_USER=your_database_username');
        console.log('DB_PASSWORD=your_database_password');
        console.log('DB_NAME=your_database_name');
        console.log('DB_PORT=3306');
        return false;
    }
}

// Create SequelizeMeta table for tracking migrations
async function createMetaTable() {
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS SequelizeMeta (
            name VARCHAR(255) NOT NULL PRIMARY KEY
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

// Check if migration has been run
async function isMigrationRun(migrationName) {
    try {
        const [results] = await sequelize.query(
            'SELECT name FROM SequelizeMeta WHERE name = ?',
            { replacements: [migrationName] }
        );
        return results.length > 0;
    } catch (error) {
        return false;
    }
}

// Mark migration as completed
async function markMigrationComplete(migrationName) {
    await sequelize.query(
        'INSERT INTO SequelizeMeta (name) VALUES (?)',
        { replacements: [migrationName] }
    );
}

// Migration definitions (converted from your existing files)
const migrations = [
    {
        name: '20241201000001-create-users.js',
        description: 'Creating users table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('users', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true
                },
                username: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    unique: true
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                user_type: {
                    type: DataTypes.ENUM('admin', 'manager', 'agent'),
                    defaultValue: 'agent'
                },
                phone: {
                    type: DataTypes.STRING(20),
                    allowNull: true
                },
                role_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true
                },
                is_email_verified: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true
                },
                last_login_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                profile_image: {
                    type: DataTypes.STRING(500),
                    allowNull: true
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            // Add indexes
            await queryInterface.addIndex('users', ['email'], { unique: true, name: 'users_email_unique' });
            await queryInterface.addIndex('users', ['username'], { unique: true, name: 'users_username_unique' });
            await queryInterface.addIndex('users', ['user_type'], { name: 'users_user_type_index' });
            await queryInterface.addIndex('users', ['status'], { name: 'users_status_index' });
        }
    },
    {
        name: '20241201000002-create-inquiries.js',
        description: 'Creating inquiries table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiries', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_name: {
                    type: DataTypes.STRING(200),
                    allowNull: false
                },
                inquiry_type: {
                    type: DataTypes.ENUM('hotel', 'ticket', 'transport'),
                    allowNull: false
                },
                customer_name: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                customer_phone: {
                    type: DataTypes.STRING(20),
                    allowNull: false
                },
                customer_email: {
                    type: DataTypes.STRING(255),
                    allowNull: true
                },
                adults_count: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    defaultValue: 1
                },
                children_count: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    defaultValue: 0
                },
                children_ages: {
                    type: DataTypes.TEXT('long'),
                    allowNull: true
                },
                tentative_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                inquiry_priority: {
                    type: DataTypes.ENUM('high', 'medium', 'low'),
                    defaultValue: 'medium'
                },
                contact_person_name: {
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                contact_person_phone: {
                    type: DataTypes.STRING(20),
                    allowNull: true
                },
                followup_date: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                stage: {
                    type: DataTypes.ENUM('new', 'in_progress', 'waiting_for_customer', 'need_changes', 'approved', 'closed', 'cancelled'),
                    defaultValue: 'new'
                },
                assigned_to: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL'
                },
                total_amount: {
                    type: DataTypes.DECIMAL(10, 2),
                    defaultValue: 0.00
                },
                paid_amount: {
                    type: DataTypes.DECIMAL(10, 2),
                    defaultValue: 0.00
                },
                notes: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true
                },
                created_by: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT'
                },
                updated_by: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL'
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            // Add indexes
            await queryInterface.addIndex('inquiries', ['inquiry_type'], { name: 'inquiries_type_index' });
            await queryInterface.addIndex('inquiries', ['stage'], { name: 'inquiries_stage_index' });
            await queryInterface.addIndex('inquiries', ['inquiry_priority'], { name: 'inquiries_priority_index' });
            await queryInterface.addIndex('inquiries', ['assigned_to'], { name: 'inquiries_assigned_to_index' });
            await queryInterface.addIndex('inquiries', ['created_by'], { name: 'inquiries_created_by_index' });
            await queryInterface.addIndex('inquiries', ['status'], { name: 'inquiries_status_index' });
            await queryInterface.addIndex('inquiries', ['tentative_date'], { name: 'inquiries_tentative_date_index' });
            await queryInterface.addIndex('inquiries', ['customer_phone'], { name: 'inquiries_customer_phone_index' });
            await queryInterface.addIndex('inquiries', ['created_at'], { name: 'inquiries_created_at_index' });
        }
    },
    {
        name: '20241201000003-create-inquiry-hotel-details.js',
        description: 'Creating inquiry hotel details table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiry_hotel_details', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'inquiries',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
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
                    type: DataTypes.INTEGER.UNSIGNED,
                    defaultValue: 1
                },
                meal_plan: {
                    type: DataTypes.ENUM('room_only', 'breakfast', 'half_board', 'full_board', 'all_inclusive'),
                    defaultValue: 'breakfast'
                },
                destination: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                duration_nights: {
                    type: DataTypes.INTEGER.UNSIGNED,
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
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            await queryInterface.addIndex('inquiry_hotel_details', ['inquiry_id'], { unique: true, name: 'hotel_details_inquiry_unique' });
        }
    },
    {
        name: '20241201000004-create-inquiry-ticket-details.js',
        description: 'Creating inquiry ticket details table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiry_ticket_details', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'inquiries',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                destination: {
                    type: DataTypes.STRING(100),
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
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                return_date: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                trip_type: {
                    type: DataTypes.ENUM('one_way', 'round_trip'),
                    defaultValue: 'one_way'
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            await queryInterface.addIndex('inquiry_ticket_details', ['inquiry_id'], { unique: true, name: 'ticket_details_inquiry_unique' });
        }
    },
    {
        name: '20241201000005-create-inquiry-transport-details.js',
        description: 'Creating inquiry transport details table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiry_transport_details', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'inquiries',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                destination: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                vehicle_type: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                pickup_location: {
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                drop_location: {
                    type: DataTypes.STRING(100),
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
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            await queryInterface.addIndex('inquiry_transport_details', ['inquiry_id'], { unique: true, name: 'transport_details_inquiry_unique' });
        }
    },
    {
        name: '20241201000006-create-inquiry-stage-history.js',
        description: 'Creating inquiry stage history table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiry_stage_histories', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'inquiries',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
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
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT'
                },
                notes: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            await queryInterface.addIndex('inquiry_stage_histories', ['inquiry_id'], { name: 'stage_history_inquiry_index' });
            await queryInterface.addIndex('inquiry_stage_histories', ['to_stage'], { name: 'stage_history_to_stage_index' });
            await queryInterface.addIndex('inquiry_stage_histories', ['created_at'], { name: 'stage_history_created_at_index' });
        }
    },
    {
        name: '20241201000007-create-inquiry-details.js',
        description: 'Creating inquiry details table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiry_details', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'inquiries',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                type: {
                    type: DataTypes.ENUM('quotation', 'note', 'reminder'),
                    allowNull: false
                },
                title: {
                    type: DataTypes.STRING(200),
                    allowNull: false
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                attachment: {
                    type: DataTypes.STRING(500),
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
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT'
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            await queryInterface.addIndex('inquiry_details', ['inquiry_id'], { name: 'inquiry_details_inquiry_index' });
            await queryInterface.addIndex('inquiry_details', ['type'], { name: 'inquiry_details_type_index' });
            await queryInterface.addIndex('inquiry_details', ['reminder_date'], { name: 'inquiry_details_reminder_date_index' });
            await queryInterface.addIndex('inquiry_details', ['is_completed'], { name: 'inquiry_details_is_completed_index' });
        }
    },
    {
        name: '20241201000008-create-inquiry-payments.js',
        description: 'Creating inquiry payments table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiry_payments', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'inquiries',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                amount: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false
                },
                payment_method: {
                    type: DataTypes.ENUM('cash', 'card', 'bank_transfer', 'upi', 'cheque'),
                    allowNull: false
                },
                payment_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                transaction_id: {
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                notes: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                receipt_number: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    unique: true
                },
                created_by: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT'
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            await queryInterface.addIndex('inquiry_payments', ['inquiry_id'], { name: 'inquiry_payments_inquiry_index' });
            await queryInterface.addIndex('inquiry_payments', ['payment_method'], { name: 'inquiry_payments_method_index' });
            await queryInterface.addIndex('inquiry_payments', ['payment_date'], { name: 'inquiry_payments_date_index' });
            await queryInterface.addIndex('inquiry_payments', ['receipt_number'], { unique: true, name: 'inquiry_payments_receipt_unique' });
        }
    },
    {
        name: '20241201000009-create-inquiry-invoices.js',
        description: 'Creating inquiry invoices table',
        up: async (queryInterface, DataTypes) => {
            await queryInterface.createTable('inquiry_invoices', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED
                },
                inquiry_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'inquiries',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                invoice_number: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true
                },
                invoice_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                subtotal: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false
                },
                gst_amount: {
                    type: DataTypes.DECIMAL(10, 2),
                    defaultValue: 0.00
                },
                total_amount: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false
                },
                gst_number: {
                    type: DataTypes.STRING(50),
                    allowNull: true
                },
                invoice_items: {
                    type: DataTypes.TEXT('long'),
                    allowNull: false
                },
                status: {
                    type: DataTypes.ENUM('draft', 'sent', 'paid', 'cancelled'),
                    defaultValue: 'draft'
                },
                created_by: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT'
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }, {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            });

            await queryInterface.addIndex('inquiry_invoices', ['inquiry_id'], { name: 'inquiry_invoices_inquiry_index' });
            await queryInterface.addIndex('inquiry_invoices', ['invoice_number'], { unique: true, name: 'inquiry_invoices_number_unique' });
            await queryInterface.addIndex('inquiry_invoices', ['status'], { name: 'inquiry_invoices_status_index' });
            await queryInterface.addIndex('inquiry_invoices', ['invoice_date'], { name: 'inquiry_invoices_date_index' });
        }
    }
];

// Execute migration
async function executeMigration(migration) {
    const alreadyRun = await isMigrationRun(migration.name);
    if (alreadyRun) {
        console.log(`⏭️ Skipping ${migration.description} (already run)`);
        return;
    }

    console.log(`📝 Running: ${migration.description}`);
    try {
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        await markMigrationComplete(migration.name);
        console.log(`✅ Completed: ${migration.description}`);
    } catch (error) {
        console.error(`❌ Failed: ${migration.description}`, error.message);
        throw error;
    }
}

// Seed users
async function seedUsers() {
    console.log('🌱 Creating default users...');

    // Check if users already exist
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    if (results[0].count > 0) {
        console.log('⚠️ Users already exist, skipping seed...');
        return;
    }

    const bcrypt = await import('bcryptjs');
    
    const users = [
        {
            name: 'Super Admin',
            email: 'admin@tcrm.com',
            username: 'admin',
            password: bcrypt.hashSync('admin123', 10),
            user_type: 'admin',
            phone: '+919876543210',
            is_email_verified: true,
            status: true
        },
        {
            name: 'Travel Manager',
            email: 'manager@tcrm.com',
            username: 'manager',
            password: bcrypt.hashSync('manager123', 10),
            user_type: 'manager',
            phone: '+919876543211',
            is_email_verified: true,
            status: true
        },
        {
            name: 'Travel Agent',
            email: 'agent@tcrm.com',
            username: 'agent',
            password: bcrypt.hashSync('agent123', 10),
            user_type: 'agent',
            phone: '+919876543212',
            is_email_verified: true,
            status: true
        }
    ];

    for (const user of users) {
        await sequelize.query(`
            INSERT INTO users (name, email, username, password, user_type, phone, is_email_verified, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, {
            replacements: [
                user.name, user.email, user.username, user.password,
                user.user_type, user.phone, user.is_email_verified, user.status
            ]
        });
    }

    console.log('✅ Default users created successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@tcrm.com / admin123');
    console.log('Manager: manager@tcrm.com / manager123');
    console.log('Agent: agent@tcrm.com / agent123');
}

// Main migration runner
async function runMigrations() {
    try {
        console.log('🔍 Testing database connection...');
        const connected = await testConnection();
        if (!connected) {
            process.exit(1);
        }

        console.log('📋 Creating migration tracking table...');
        await createMetaTable();

        console.log('🚀 Running migrations...');
        for (const migration of migrations) {
            await executeMigration(migration);
        }

        console.log('🌱 Running seeders...');
        await seedUsers();

        console.log('\n🎉 Database setup completed successfully!');
        console.log('✅ All tables created with proper relationships');
        console.log('✅ Default users created');
        console.log('🚀 You can now start your server with: npm run dev');

        // Display created tables
        console.log('\n📊 Created Tables:');
        const [tables] = await sequelize.query('SHOW TABLES');
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`  ✓ ${tableName}`);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        if (error.sql) {
            console.error('SQL Error:', error.sql);
        }
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

// Run migrations
runMigrations();
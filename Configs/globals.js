// Configs/globals.js
import chalk from 'chalk';
import { Sequelize } from 'sequelize';
import { STATUS_CODES, STATUS_MESSAGES } from './constant.js';

// Global constants
global.CHALK = chalk;
global.STATUS_CODES = STATUS_CODES;
global.STATUS_MESSAGES = STATUS_MESSAGES;
global.SEQUELIZE = Sequelize;

// Additional global constants for your app
global.STATUS = {
    ACTIVE: true,
    INACTIVE: false
};

global.USER_TYPES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    AGENT: 'agent'
};

global.INQUIRY_TYPES = {
    HOTEL: 'hotel',
    TICKET: 'ticket',
    TRANSPORT: 'transport'
};

global.INQUIRY_STAGES = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    WAITING_FOR_CUSTOMER: 'waiting_for_customer',
    NEED_CHANGES: 'need_changes',
    APPROVED: 'approved',
    CLOSED: 'closed',
    CANCELLED: 'cancelled'
};

global.INQUIRY_PRIORITIES = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

// Sentry placeholder (if you plan to use it)
global.SENTRY = {
    captureException: (error) => {
        console.error('Error captured:', error);
        // TODO: Implement actual Sentry integration
    }
};

console.log(chalk.green('✅ Global constants loaded successfully'));
import { config } from '../config';

export const db = require('knex')(config.mysql);

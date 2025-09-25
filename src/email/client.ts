import { env } from '@/env';
import Mailjet from 'node-mailjet';

export const mailjet = Mailjet.apiConnect(env.mailjetApiKey, env.mailjetApiSecret);

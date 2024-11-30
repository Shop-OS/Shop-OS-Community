import { ChatMessage } from '@lobehub/ui';

import { Compressor } from '@/utils/compass';
import AxiosProvider from '@/utils/axios';

export const genShareMessagesUrl = (messages: ChatMessage[], systemRole?: string) => {
  const compassedMsg = systemRole
    ? [{ content: systemRole, role: 'system' }, ...messages]
    : messages;

  return `/share?messages=${Compressor.compress(JSON.stringify(compassedMsg))}`;
};

export const genSystemRoleQuery = async (content: string) => {
  const x = { state: { systemRole: content } };
  const systemRole = await Compressor.compressAsync(JSON.stringify(x));
  return `#systemRole=${systemRole}`;
};


export const fetchCredits = async (requiredCredit = 0) => {
  try {
    const response = await AxiosProvider.get('/api/auth/credits');

    return response.data.credits > requiredCredit;
  } catch (error) {
    console.error('Error fetching credits', error);
  }
}
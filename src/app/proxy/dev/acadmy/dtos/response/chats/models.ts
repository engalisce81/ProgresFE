import type { EntityDto } from '@abp/ng.core';

export interface ChatMessageDto extends EntityDto<string> {
  senderId?: string;
  senderName?: string;
  logoUrl?: string;
  receverId?: string;
  message?: string;
  isInstructor: boolean;
  creationTime?: string;
}

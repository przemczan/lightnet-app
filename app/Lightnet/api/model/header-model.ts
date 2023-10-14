import { MessageType } from '../message-type';

export interface HeaderModel {
  type: MessageType;
  protocolVersion: number;
  nonce: number;
}

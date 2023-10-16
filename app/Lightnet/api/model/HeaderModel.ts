import { MessageType } from '../MessageType';

export interface HeaderModel {
  type: MessageType;
  protocolVersion: number;
  nonce: number;
}

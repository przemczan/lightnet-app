import { MessageMetaModel } from './MessageMetaModel';

export interface MessageToggleModel extends MessageMetaModel {
  address: number;
  on: boolean;
}

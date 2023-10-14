import { MessageMetaModel } from './message-meta-model';

export interface MessageToggleModel extends MessageMetaModel {
  address: number;
  on: boolean;
}

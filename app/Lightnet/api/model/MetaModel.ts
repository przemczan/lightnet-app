import { HeaderModel } from './HeaderModel';

export interface MetaModel {
  header: HeaderModel;
  headerCrc: number;
  payloadCrc: number;
  payloadSize: number;
  payload?: number;
}

/* eslint-disable @stylistic/lines-between-class-members */
import { LineChangeHistoryItem, LineData } from '../types';

interface DataNotFoundErrorData {
  readonly currentHistoryItem: LineChangeHistoryItem;
  readonly currentItemData: LineData | null;
  readonly previousHistoryItem: LineChangeHistoryItem;
  readonly previousItemData: LineData | null;
}

export class DataNotFoundError extends Error implements DataNotFoundErrorData {
  readonly currentHistoryItem: LineChangeHistoryItem;
  readonly currentItemData: LineData | null;
  readonly previousHistoryItem: LineChangeHistoryItem;
  readonly previousItemData: LineData | null;

  constructor(props: DataNotFoundErrorData) {
    super('One or more data items were not found!');

    this.currentHistoryItem = props.currentHistoryItem;
    this.currentItemData = props.currentItemData;
    this.previousHistoryItem = props.previousHistoryItem;
    this.previousItemData = props.previousItemData;
  }
}

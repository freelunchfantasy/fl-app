import { DropdownEvent } from './dropdown-constants';

export interface IDropdownItem {
  value: any;
  id?: string;
  htmlMarkup?: any[];
  selected?: boolean;
}

export interface IDropdownEvent {
  eventType: DropdownEvent;
  payload: {
    dropdownId: string;
    dropdownItemId?: string;
    dropdownItemValue?: any;
  };
}

export enum DropdownTriggerHTMLEvents {
  Click = 'click',
}

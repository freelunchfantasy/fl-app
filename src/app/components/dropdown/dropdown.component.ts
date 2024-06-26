import { Component, EventEmitter, HostListener, Input, OnInit, AfterViewInit, Output } from '@angular/core';
import { DropdownTriggerHTMLEvents, IDropdownEvent, IDropdownItem } from './dropdown-interfaces';
import { DropdownEvent } from './dropdown-constants';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, AfterViewInit {
  @Input()
  id: string;

  @Input()
  items: IDropdownItem[];

  @Input()
  activeItem?: string;

  @Input()
  triggerMarkup?: string;

  @Input()
  showArrow?: boolean = true;

  @Input()
  freezeTriggerMarkup?: boolean = false;

  @Input()
  disabled?: boolean = false;

  @Output()
  onClick: EventEmitter<IDropdownEvent> = new EventEmitter<IDropdownEvent>();

  triggerElement: HTMLElement;

  triggerHTML: string;
  get dropdownTriggerId(): string {
    return `${this.id}-dropdown-trigger-id`;
  }

  isDropdownVisible: boolean = false;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.triggerElement.contains(event.target)) {
      this.isDropdownVisible = false;
    }
  }

  constructor() {}

  ngOnInit(): void {
    const defaultItem = this.items.length ? this.items.find(i => i.selected) || this.items[0] : { value: '' };
    this.triggerHTML = this.triggerMarkup
      ? this.triggerMarkup
      : this.getTriggerHTMLFromDropdownItem(this.activeItem, defaultItem);
  }

  ngAfterViewInit(): void {
    this.triggerElement = document.getElementById(this.dropdownTriggerId);
  }

  handleVisibilityEvent(event: MouseEvent) {
    if (this.disabled) return;
    if (event.type == DropdownTriggerHTMLEvents.Click) {
      this.isDropdownVisible = !this.isDropdownVisible;
      const visibilityEvent: IDropdownEvent = {
        eventType: this.isDropdownVisible ? DropdownEvent.Opened : DropdownEvent.Closed,
        payload: { dropdownId: this.id },
      };
      this.onClick.emit(visibilityEvent);
    }
  }

  onSelectItem(itemId: string, itemValue: any) {
    const selectEvent: IDropdownEvent = {
      eventType: DropdownEvent.ItemClicked,
      payload: {
        dropdownId: this.id,
        dropdownItemId: itemId,
        dropdownItemValue: itemValue,
      },
    };
    this.onClick.emit(selectEvent);
    if (!this.freezeTriggerMarkup) this.triggerHTML = this.getTriggerHTMLFromDropdownItem(itemId);
    this.isDropdownVisible = false;
  }

  getDropdownMenuRowClasses(i: number) {
    return i == 0 ? 'dropdown__menu-row first' : 'dropdown__menu-row';
  }

  private getTriggerHTMLFromDropdownItem(targetDropdownId: string, defaultItem?: IDropdownItem): string {
    const targetItem = this.items.find(item => item.id == targetDropdownId) || defaultItem;
    if (!targetItem) return '';

    return targetItem.htmlMarkup.join(' ');
  }
}

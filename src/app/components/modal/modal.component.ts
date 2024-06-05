import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input()
  modalTitle?: string = '';

  @Input()
  modalSubtitle?: string = '';

  @Input()
  showCloseIcon?: boolean = true;

  @Output()
  dismissModal: EventEmitter<any> = new EventEmitter<any>();

  OVERLAY_CLASS: string = 'modal__overlay--visible';

  constructor() {}

  ngOnInit() {
    setTimeout(function () {
      document.getElementById('modal').style.opacity = '1';
    }, 1);
  }

  handleOverlayClicked(e: any) {
    document.getElementById('modal').style.opacity = '1';
    e.target.classList[0] == this.OVERLAY_CLASS && this.handleModalClose();
  }

  handleModalClose() {
    this.dismissModal.emit();
  }
}

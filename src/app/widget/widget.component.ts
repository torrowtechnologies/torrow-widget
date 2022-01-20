import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'torrow-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WidgetComponent {
  @Input()
  public url: string;

  @Input()
  public buttonX: string;

  @Input()
  public buttonY: string;

  @Input()
  public modalWidth?: string;

  @Input()
  public modalHeight?: string;

  @Input()
  public buttonSize?: number;

  @Input()
  public textButtonWidth?: number;

  @Input()
  public fontWeight?: string;

  @Input()
  public textColor?: string;

  @Input()
  public buttonColor?: string;

  @Input()
  public waveColor?: string;

  @Input()
  public fontSize?: number;

  @Input()
  public showCloseButton = true;

  @Input()
  public buttonText = 'Онлайн запись';

  @Input()
  public modal = 'center';

  public isActive: boolean;
  public isLoaded: boolean;
  public sanitizedUrlResource: SafeResourceUrl;

  constructor(
    private readonly domSanitizer: DomSanitizer
  ) {
  }

  public get sanitizedUrl(): SafeResourceUrl | undefined {
    if (this.sanitizedUrlResource) {
      return this.sanitizedUrlResource;
    }

    if (this.url) {
      this.sanitizedUrlResource = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);

      return this.sanitizedUrlResource;
    }

    return undefined;
  }

  public openModal(): void {
    if (!this.isLoaded) {
      this.isLoaded = true;
    }

    if (!this.isActive) {
      this.isActive = true;
    }
  }

  public closeModal(): void {
    if (this.isActive) {
      this.isActive = false;
    }
  }

  public get modalClass(): string {
    return this.isActive ? `${this.modal} active` : `${this.modal}`;
  }

  public get isLeft(): boolean {
    return this.buttonX === 'left';
  }

  public get isTop(): boolean {
    return this.buttonY === 'top';
  }

  public get modalCustomStyle(): Record<string, string> {
    return {
      '--modal-width': this.modalWidth ?? '350px',
      '--modal-height': this.modalHeight ?? '100%',
    };
  }

  public get buttonCustomStyle(): Record<string, string> {
    return {
      '--button-size': this.buttonSize ? `${this.buttonSize}px` : '100px',
      '--text-button-width': this.textButtonWidth ? `${this.textButtonWidth}px` : this.buttonSize > 10 ? `${this.buttonSize - 10}px` : '90px',
      '--font-size': this.fontSize ? `${this.fontSize}px` : '15px',
      '--font-weight': this.fontWeight ?? '400',
      '--text-color': this.textColor ?? '#fff',
      '--button-color': this.buttonColor ?? '#5F4B8B',
      '--wave-color': this.waveColor ?? '#5F4B8B',
    };
  }

  public get isCloseButton(): boolean {
    return String(this.showCloseButton) === 'true';
  }

  public clickOverlay(): void {
    this.closeModal();
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, Input} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

import {increaseBrightness} from '../utils/color';
import {ButtonStyleEnum} from '../models/button-style.enum';
import {ButtonPositionEnum} from '../models/button-position.enum';

@Component({
  selector: 'torrow-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent {
  @Input()
  public set url(value: string) {
    if (value) {
      const parentParams = new URLSearchParams(new URL(value).search).toString();
      const childParams = new URLSearchParams(location.search).toString();
      const url = new URL(value);

      this.widgetUrl = url.origin + url.pathname + `?${parentParams}&${childParams}`;
    }
  }

  @Input()
  public buttonX = ButtonPositionEnum.Right;

  @Input()
  public buttonY = ButtonPositionEnum.Bottom;

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

  @Input()
  public showWidgetButton = true;

  @Input()
  public fontFamily?: string;

  @Input()
  public bottomMargin?: string;

  @Input()
  public topMargin?: string;

  @Input()
  public rightMargin?: string;

  @Input()
  public leftMargin?: string;

  @Input()
  public lineHeight?: string;

  @Input()
  public buttonStyle?: string;

  @Input()
  public pixelRatio?: number;

  @Input()
  public mobileScale?: number;

  @Input()
  public set preserveRatio(val: string | boolean) {
    this.preservePixelRatio = String(val) === 'true';
  }

  @Input()
  public set modalActive(val: string | boolean) {
    this.isActive = String(val) === 'true';
  }

  @Input()
  public set buttonAnimation(val: string | boolean) {
    this.isAnimating = String(val) === 'true';
  }

  public widgetUrl?: string;
  public isActive: boolean;
  public isAnimating = true;
  public preservePixelRatio = false;

  public sanitizedUrlResource: SafeResourceUrl;

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
  }

  @HostListener('window:orientationchange', ['$event'])
  public onOrientationChange(): void {
    if (this.preservePixelRatio) {
      setTimeout(() => { // We need it to recalcultate buttonCustomStyle after orientation changed
        this.cdr.detectChanges();
      }, 100);
    }
  }

  public get isRectangleButton(): boolean {
    return this.buttonStyle === ButtonStyleEnum.Rectangle;
  }

  public get sanitizedUrl(): SafeResourceUrl | undefined {
    if (this.sanitizedUrlResource && this.isActive) {
      return this.sanitizedUrlResource;
    }

    if (this.widgetUrl) {
      this.sanitizedUrlResource = this.domSanitizer.bypassSecurityTrustResourceUrl(this.widgetUrl);

      return this.sanitizedUrlResource;
    }

    return undefined;
  }

  public openModal(): void {
    if (this.preserveMode) {
      const externalUrl = new URL(this.widgetUrl);
      externalUrl.searchParams.delete('closeButtonHidden');
      externalUrl.searchParams.delete('tabBarHidden');

      window.open(externalUrl.href, '_blank');
    } else {
      this.overlapOtherWidgets(true);

      if (!this.isActive) {
        this.isActive = true;
      }
    }
  }

  public closeModal(): void {
    this.overlapOtherWidgets(false);

    if (this.isActive) {
      this.isActive = false;
    }
  }

  public get modalClass(): string {
    return this.isActive ? `tt-${this.modal} active` : `tt-${this.modal}`;
  }

  public get isLeft(): boolean {
    return this.buttonX === ButtonPositionEnum.Left;
  }

  public get isRight(): boolean {
    return this.buttonX === ButtonPositionEnum.Right;
  }

  public get isTop(): boolean {
    return this.buttonY === ButtonPositionEnum.Top;
  }

  public get isBottom(): boolean {
    return this.buttonY === ButtonPositionEnum.Bottom;
  }

  public get isCenter(): boolean {
    return this.buttonY === ButtonPositionEnum.Center || this.buttonX === ButtonPositionEnum.Center;
  }

  public get modalCustomStyle(): Record<string, string> {
    return {
      '--modal-width': this.modalWidth ?? '500px',
      '--modal-height': this.modalHeight ?? '100%',
    };
  }

  public get buttonCustomStyle(): Record<string, string | number> {
    const isMobile = this.document.defaultView.innerWidth <= 428; // Iphone 12 pro max viewport size
    const defaultButtonSize = this.buttonSize ?? 100;
    const defaultFontSize = this.fontSize ?? 15;

    const buttonSize = isMobile ? Math.floor(defaultButtonSize * (this.mobileScale ?? 0.7)) : defaultButtonSize;
    const fontSize = isMobile ? Math.floor(defaultFontSize * (this.mobileScale ?? 0.7)) : defaultFontSize;

    return {
      '--button-size': `${buttonSize}px`,
      '--text-button-width': `${this.textButtonWidth ?? buttonSize - 10}px`,
      '--font-size': `${fontSize}px`,
      '--font-weight': this.fontWeight ?? '400',
      '--text-color': this.textColor ?? '#fff',
      '--button-color': this.buttonColor ?? '#5F4B8B',
      '--button-lighten-color': increaseBrightness(this.waveColor ?? '#5F4B8B', 20),
      '--wave-color': this.waveColor ?? '#5F4B8B',
      '--font-family': this.fontFamily ?? 'play, sans-serif',
      '--bottom-margin': this.bottomMargin ?? '32px',
      '--top-margin': this.topMargin ?? '32px',
      '--right-margin': this.rightMargin ?? '32px',
      '--left-margin': this.leftMargin ?? '32px',
      '--line-height': this.lineHeight ?? '25px',
      zoom: this.preserveMode ? this.pixelRatio ?? 2 : undefined,
    };
  }

  public get isWidgetButton(): boolean {
    return String(this.showWidgetButton) === 'true';
  }

  public get isCloseButton(): boolean {
    return String(this.showCloseButton) === 'true';
  }

  public clickOverlay(): void {
    this.closeModal();
  }

  private get preserveMode(): boolean {
    return window.matchMedia('(orientation: portrait)').matches && window.devicePixelRatio >= 2 && this.preservePixelRatio;
  }

  private overlapOtherWidgets(hide: boolean): void {
    const jdiv = document.querySelector('jdiv') as HTMLElement;

    if (jdiv) {
      jdiv.style.display = hide ? 'none' : 'block';
    }
  }
}

import {BrowserModule} from '@angular/platform-browser';
import {DoBootstrap, Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';

import {WidgetComponent} from './widget/widget.component';

@NgModule({
  declarations: [
    WidgetComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  entryComponents: [WidgetComponent],
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap(): void {
    const webComponent = createCustomElement(WidgetComponent, {injector: this.injector});
    customElements.define('torrow-widget', webComponent);
  }
}

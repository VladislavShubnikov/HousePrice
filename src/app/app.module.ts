import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientXsrfModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DatabaseComponent } from './database/database.component';
import { SceneComponent } from './scene/scene.component';

@NgModule({
  declarations: [
    AppComponent,
    DatabaseComponent,
    SceneComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

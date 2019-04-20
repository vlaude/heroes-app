import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatService } from './services/chat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './ngxs/app.state';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from '../environments/environment';
import { HeaderComponent } from './core/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { RegisterComponent } from './core/register/register.component';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './core/home/home.component';
import { ChatComponent } from './core/chat/chat.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        RegisterComponent,
        LoginComponent,
        HomeComponent,
        ChatComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxsModule.forRoot([AppState], {
            developmentMode: !environment.production,
        }),
        NgxsLoggerPluginModule.forRoot(),
        MaterialModule,
        ToastrModule.forRoot(),
    ],
    providers: [ChatService],
    bootstrap: [AppComponent],
})
export class AppModule {}

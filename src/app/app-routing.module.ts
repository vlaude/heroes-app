import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './core/register/register.component';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './core/home/home.component';
import { IsSignedInGuard } from './shared/guards/is-signed-in.guard';
import { IsNotSignedInGuard } from './shared/guards/is-not-signed-in.guard';
import { ChatBoxResolver } from './shared/resolvers/chat-box.resolver';
import { ChatComponent } from './chat/chat/chat.component';
import { RoomListResolver } from './shared/resolvers/room-list.resolver';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [IsSignedInGuard],
        children: [
            {
                path: '',
                component: ChatComponent,
                resolve: { messages: ChatBoxResolver, rooms: RoomListResolver },
            },
        ],
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [IsNotSignedInGuard],
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [IsNotSignedInGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [ChatBoxResolver, RoomListResolver],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './core/register/register.component';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './core/home/home.component';
import { IsSignedInGuard } from './shared/guards/is-signed-in.guard';
import { IsNotSignedInGuard } from './shared/guards/is-not-signed-in.guard';
import { ChatComponent } from './chat/chat/chat.component';
import { RoomsResolver } from './shared/resolvers/rooms.resolver';

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
                resolve: { rooms: RoomsResolver },
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
    providers: [RoomsResolver],
})
export class AppRoutingModule {}

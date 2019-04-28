import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './core/register/register.component';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './core/home/home.component';
import { IsSignedInGuard } from './shared/guards/is-signed-in.guard';
import { IsNotSignedInGuard } from './shared/guards/is-not-signed-in.guard';

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
})
export class AppRoutingModule {}

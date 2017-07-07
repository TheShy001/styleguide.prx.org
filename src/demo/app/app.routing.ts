import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TocComponent } from './toc.component';
import { AuthDemoComponent } from './auth/auth-demo.component';
import { ChartsDemoComponent } from './charts/charts-demo.component';
import { DatepickerDemoComponent } from './datepicker/datepicker-demo.component';
import { FooterDemoComponent } from './footer/footer-demo.component';
import { HalDemoComponent } from './hal/hal-demo.component';
import { HeaderDemoComponent } from './header/header-demo.component';
import { NavItemDemoComponent } from './header/navitem-demo.component';
import { NavUserDemoComponent } from './header/navuser-demo.component';
import { HeroDemoComponent } from './hero/hero-demo.component';
import { AppDemoComponent } from './global-css/app-demo.component';
import { ButtonDemoComponent } from './global-css/button-demo.component';
import { FormDemoComponent } from './global-css/form-demo.component';
import { LayoutDemoComponent } from './global-css/layout-demo.component';
import { ResetDemoComponent } from './global-css/reset-demo.component';
import { ImageLoaderDemoComponent } from './image/image-loader-demo.component';
import { SpinnerDemoComponent } from './spinner/spinner-demo.component';
import { ToastrDemoComponent } from './toastr/toastr-demo.component';

export const routes: Routes = [
  { path: '',                   component: TocComponent },
  { path: 'auth',               component: AuthDemoComponent },
  { path: 'charts',             component: ChartsDemoComponent },
  { path: 'datepicker',         component: DatepickerDemoComponent },
  { path: 'footer',             component: FooterDemoComponent },
  { path: 'global/app',         component: AppDemoComponent },
  { path: 'global/button',      component: ButtonDemoComponent },
  { path: 'global/form',        component: FormDemoComponent },
  { path: 'global/layout',      component: LayoutDemoComponent },
  { path: 'global/reset',       component: ResetDemoComponent },
  { path: 'hal',                component: HalDemoComponent },
  { path: 'header',             component: HeaderDemoComponent },
  { path: 'header/navitem',     component: NavItemDemoComponent },
  { path: 'header/navuser',     component: NavUserDemoComponent },
  { path: 'hero',               component: HeroDemoComponent },
  { path: 'image/imageloader',  component: ImageLoaderDemoComponent },
  { path: 'toastr',             component: ToastrDemoComponent },
  { path: 'util/spinner',       component: SpinnerDemoComponent }
];

export const routingComponents: any[] = [
  TocComponent,
  AuthDemoComponent,
  ChartsDemoComponent,
  DatepickerDemoComponent,
  AppDemoComponent,
  ButtonDemoComponent,
  FooterDemoComponent,
  FormDemoComponent,
  LayoutDemoComponent,
  ResetDemoComponent,
  HalDemoComponent,
  HeaderDemoComponent,
  HeroDemoComponent,
  ImageLoaderDemoComponent,
  NavItemDemoComponent,
  NavUserDemoComponent,
  SpinnerDemoComponent,
  ToastrDemoComponent
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

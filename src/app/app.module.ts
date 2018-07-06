import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleMaps } from "@ionic-native/google-maps";
import { FirestoreProvider } from '../providers/firestore/firestore';
import { GeoFireProvider } from '../providers/geo-fire/geo-fire';
import { DbProvider } from '../providers/db/db';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { MapProvider } from '../providers/map/map';
import { ComponentsModule } from '../components/components.module';
import { VideosProvider } from '../providers/videos/videos';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyA798mO_IqbKHGY8xMtBpuuiADvM1dkvr4",
      authDomain: "firestore-84244.firebaseapp.com",
      databaseURL: "https://firestore-84244.firebaseio.com",
      projectId: "firestore-84244",
      storageBucket: "firestore-84244.appspot.com",
      messagingSenderId: "455433881626"
    }),
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirestoreProvider,
    GeoFireProvider,
    DbProvider,
    MapProvider,
    VideosProvider
  ]
})
export class AppModule {}

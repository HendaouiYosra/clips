import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'

  if(environment.production){
  enableProdMode();
}
firebase.initializeApp(environment.firebase)        // initialize firebase before angular
let appInit=false                                   // to make sure if the page have been loaded before
firebase.auth().onAuthStateChanged(()=>
{if(!appInit){                                      // loading the page according to appInit and changing its value to true 
  platformBrowserDynamic().bootstrapModule(AppModule) // angular doesn t load unless we call bootstrap module function
  .catch(err => console.error(err))
  appInit=true}

})


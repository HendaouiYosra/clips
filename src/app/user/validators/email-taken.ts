import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";                                                   // interface for classes which are async validators
import { AngularFirestore } from "@angular/fire/compat/firestore";
@Injectable({
  providedIn:'root'
})                                               //to be able to add service in the constructor (add dependecy injection)
export class EmailTaken implements AsyncValidator{
  constructor( private auth:AngularFireAuth ,private fire:AngularFirestore) {}
  validate =async (control: AbstractControl): Promise<ValidationErrors | null> =>  {
    const userRef = this.fire.collection('users', ref => ref.where('email', '==', control.value));
    const querySnapshot = await userRef.get().toPromise();
    if(querySnapshot?.empty){
      return null

    }
    else{
      return {emailTaken:true}
    }
  }}

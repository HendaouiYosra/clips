import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserModule } from '../user/user.module';
import IUser from '../models/user.model';
import { Observable, delay, map ,filter,switchMap,of} from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$:Observable<boolean> //observables: name$
  public isAuthenticatedWithDelay$:Observable<boolean>
  private redirect =false

  constructor(private auth:AngularFireAuth,private db:AngularFirestore,private router:Router,private route:ActivatedRoute) {
    this.usersCollection=db.collection('users')
    this.isAuthenticated$=auth.user.pipe(map(user => !!user)) // transform the value to a boolean
    this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(delay(1000)) // used to make the modal disappear after delay


    this.router.events.pipe(
      filter(e=>  e instanceof NavigationEnd),   //filtering router to wait for the router to end its navigation to  the page
      map(e=>this.route.firstChild),
      switchMap(route =>route?.data ?? of({authOnly:false}))).      // ?? if the value is null or undef it returns the value on the right side
      subscribe(data => this.redirect=data.authOnly ?? false )    //  RETRIEVING DATA FROM THE ROUTER
                                                                         
   }
  public async createUser(userData: IUser){
    if(!userData.password){
      throw new Error("password not provided")
    }

    const userCred= await this.auth.createUserWithEmailAndPassword(userData.email ,userData.password)
     if(!userCred.user){
      throw new Error("User can't found");

     }
    this.usersCollection.doc(userCred.user.uid).set({ //doc method creates new doc if it doesn t exist and assigns a unique id for(usercred.user.uid)
    name:userData.name,                               //set add or modify existingprop in the doc
    email:userData.email,
    age:userData.age,
    phoneNumber:userData.phoneNumber})
    await userCred.user.updateProfile({  // users have profiles with 2 prop: displayName and profile image
  displayName: userData.name
})

  }
  public async logout($event?:Event){
    if($event){ $event.preventDefault()}

    await this.auth.signOut()
   
    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
  }

}

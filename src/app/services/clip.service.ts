import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';// firestore :communication with database,AFC : definig types
import Iclip from '../models/clip.model';
@Injectable({
  providedIn: 'root'
})
export class ClipService {
public clipsCollection:AngularFirestoreCollection<Iclip>
  constructor( private db:AngularFirestore) {this.clipsCollection=db.collection('clips') }

  createClip(data:Iclip):Promise<DocumentReference<Iclip>>{
   return  this.clipsCollection.add(data)} // add :without setting a custom id, set we can set custom id
}

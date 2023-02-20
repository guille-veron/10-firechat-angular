import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

import { Mensaje } from '../interfaces/mensaje.interface';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection!: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};
  public correo:string='';
  public pwd:string='';

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) { 
    
    afAuth.authState.subscribe(user =>{

      if(!user) { console.log("Deslogueado"); return;}
      console.log(user);
      this.usuario.nombre = user.displayName ==null ? user.email : user.displayName;
      this.usuario.uid = user.uid;
    })
  }

  login(proveedor: string) {
    if(proveedor === 'google')
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    else if(proveedor === 'twitter'){
      return;     
      this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }else{
      firebase.auth().signInWithEmailAndPassword(this.correo, this.pwd)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>
              ('chats', ref => ref.orderBy('fecha','desc')
                                  .limit(5) );
    return this.itemsCollection.valueChanges()
      .pipe(map((mensajes: Mensaje[]) => {  
        console.log(mensajes);      
        this.chats = [];

        for ( let mensaje of mensajes ){
          this.chats.unshift( mensaje );
        }

        return this.chats;        
      }));
  }

  agregarMensaje(texto: string){
    let mensaje: Mensaje ={
      nombre:this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }

    return this.itemsCollection.add(mensaje);
  }
}

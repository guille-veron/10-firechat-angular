import { Component } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  correo:string='';
  pwd:string=''; 

  constructor(public _cs: ChatService) { }

  ingresar(proveedor: string){
    console.log(proveedor);
    this._cs.correo = this.correo;
    this._cs.pwd = this.pwd;
    this._cs.login(proveedor);
  }

}

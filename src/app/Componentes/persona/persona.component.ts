import { formatDate  } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PersonaService } from 'src/app/Servicios/persona.service';
import { read, utils, writeFile } from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Observable, map, startWith } from 'rxjs';




@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent {
  listPersonas: any[] = [];

  form: FormGroup;
  currentDateF: string;
  currentDate: Date = new Date();
  accion = 'Agregar'
  id: number | undefined;
  selectedFile: File | null = null;
  
  constructor(private fb:FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private _personaService : PersonaService
    ){
    this.currentDateF = formatDate(this.currentDate, 'MM/dd/yyyy', 'en-US');
    this.form = this.fb.group({
      Nombre: [''],
      Direccion: [''],
      Telefono: ['',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
      Fecha:    [this.currentDateF],
      CURP: ['']
    })
  }
  applyFilter(filterValue: string) {
    let filterValueLower = filterValue.toLowerCase();
    if(filterValue === '' ) {
        this.listPersonas=this.listPersonas;
    } 
    else {
      this.listPersonas = this.listPersonas.filter((employee) => employee.name.includes(filterValueLower))
    }
 }

  ngOnInit(): void{
    this.obtenerPersonas ();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<any>('https://localhost:7218/api/Persona/upload', formData)
        .subscribe(
          response => {
            console.log('File uploaded successfully.');
          },
          error => {
            console.error('Error uploading file:', error);
          }
        );
    }
  }
  obtenerPersonas()
  
  {
    this._personaService.getListPersonas().subscribe(data =>{
      console.log(data);
      this.listPersonas = data;
    })

  }

EditarPersonas(persona : any)
  {
    console.log(persona)

    this.accion = 'Editar';
    this.id = persona.id;

    this.form.patchValue({
      Nombre: persona.nombre,
      Direccion : persona.direccion,
      Telefono: persona.telefono,
      CURP:     persona.curp
    })

  }
  GuardarPersona(){
    
 
    const Persona: any = {
      
      Nombre: this.form.get("Nombre")?.value,
      Direccion: this.form.get("Direccion")?.value,
      Telefono: this.form.get("Telefono")?.value,
      Fecha:  this.currentDateF = formatDate(this.currentDate, 'MM/dd/yyyy', 'en-US'),
      CURP:   this.form.get("CURP")?.value

    }
      if(this.id == undefined){
        this._personaService.savePersona(Persona).subscribe(data => {
          this.toastr.success('Agregado con exito', 'Persona Registrada!');
          this.obtenerPersonas();
          this.form.reset();
          }, error =>{
            this.toastr.error('oops, ocurrio un ','error');
            console.log(error);
          })
      }else{
        Persona.id = this.id;
        this._personaService.UpdatePersona(this.id,Persona).subscribe(data =>{
          this.form.reset();
          this.accion = 'Agregar';
          this.id = undefined;
          this.toastr.info('Actualizada con exito!');
          this.obtenerPersonas();
        })
      }
   
  }


  eliminarPersona(id: number){
    this._personaService.deletePersonas(id).subscribe(data =>{
    this.toastr.error('Eliminado con exito', 'Persona Eliminada!');
    this.obtenerPersonas();
      })
  }
}

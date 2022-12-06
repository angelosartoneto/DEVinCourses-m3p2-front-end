import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({

  selector: 'pro-item-register-training',
  templateUrl: './item-register-training.component.html',
  styleUrls: ['./item-register-training.component.scss'],
})

export class ItemRegisterTrainingComponent implements OnInit {

  formTraining: FormGroup = new FormGroup({});
  constructor(formBuilder: FormBuilder) {
    this.formTraining = formBuilder.group({
      title: ['', [Validators.required]],
      teatcher: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(8)]],
      modules: ['', [Validators.required]],
      category: [''],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { }

  ShowData() {
    console.log(this.formTraining);
  }
  
}

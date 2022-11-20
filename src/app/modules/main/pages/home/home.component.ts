import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRAININGBYUSER_MOCK } from 'src/app/mocks/trainingsByUser_mock';
import { USER_MOCK } from 'src/app/mocks/user_mock';
import { IRegistration } from 'src/app/models/registration';
import { ITraining } from 'src/app/models/training';
import { IUser } from 'src/app/models/user';
import { TrainingService } from 'src/app/services/training/training.service';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'pro-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //users: IUser[] = USER_MOCK;
  registration:IRegistration = {
    id:0,
    userId: 0,
    trainingId:0,
    status:0
  }
  userActive!:IUser;

  trainings:ITraining[] = []; //TRAINING_MOCK;

  trainingModel!:ITraining;

  category:string = 'todos';
  filters: ITraining[] = [];

  page = 1;
  pageSize = 20;
  cardSize = 0;

  constructor(
    private config: NgbModalConfig, 
    private modalService: NgbModal,
    private trainingService:TrainingService,
    private alertService:AlertService) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  openXl(content: any, training:ITraining) {
    this.trainingModel = training;
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      scrollable: true,
    });
  }


  ngOnInit(): void {
    this.getUser();
    this.getTrainings();
  }

  getUser(){
    this.trainingService.getUserByToken(this.trainingService.token)
    .subscribe((user:IUser) => {
      this.userActive = user;
      this.registration.userId = user.id;
    })
  }

  getTrainings(){
    this.trainingService.getAllTrainings()
      .subscribe((trainings:ITraining[]) => {
        this.trainings = trainings;
        this.filtrar();
      })
  }

   filtrar(){
    if(this.category == 'todos'){
      this.filters = this.trainings;
      this.cardSize = this.filters.length;
      
    }else{
      this.trainingService.getByCategory(this.category)
      .subscribe((trainings:ITraining[]) => {
        this.filters = trainings; 
        this.cardSize = this.filters.length;
      },
      (error) => {
        this.filters = [];
        this.cardSize = this.filters.length;
      });
    }
  }

  isRegistered(idTraining:number):void {
    this.registration.trainingId = idTraining;
    this.trainingService.getTrainingsByUser(this.userActive?.id)
      .subscribe((training:ITraining[]) => {
        let myTrainings = training.filter(t => t.id == idTraining)
        if(myTrainings.length != 0){
          this.alertService.alertUserIsRegistered()
        }else{
          this.trainingService.postRegistration(this.registration)
          .subscribe(result => console.log(result))
          this.alertService.alertRegisterSuccess();
        }
      })
  }
}

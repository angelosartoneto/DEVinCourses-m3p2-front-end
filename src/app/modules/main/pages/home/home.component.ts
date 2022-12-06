import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRegistration } from 'src/app/models/registration';
import { ITraining } from 'src/app/models/training';
import { ItrainingDetails } from 'src/app/models/trainingDetails';
import { IUser } from 'src/app/models/user';
import { TrainingService } from 'src/app/services/training/training.service';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'pro-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  registration: IRegistration = {
    id: 0,
    userId: 0,
    trainingId: 0,
    status: 0
  };
  userActive!: IUser;

  trainings: ITraining[] = [];

  trainingModel!: ITraining;

  category: string = 'todos';
  filters: ITraining[] = [];

  page = 1;
  pageSize = 20;
  cardSize = 0;

  Details: ItrainingDetails = {
    TrainingId: 0,
    RegistredUsers: [],
    NRegistredUsers: 0,
    ProgressUsers: [],
    NProgressUsers: 0,
    FinishedUsers: [],
    NFinishedUsers: 0
  };

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private trainingService: TrainingService,
    private alertService: AlertService,
    private serviceTitle: Title) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  openXl(content: any, training: ITraining) {
    this.trainingModel = training;
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      scrollable: true,
    });
  }

  ngOnInit(): void {
    this.serviceTitle.setTitle('NDD Training - Home');
    this.getUser();
    this.getTotalRegisters()
    this.RecebeDetalhes();
  }

  getUser() {
    this.trainingService.getUserByToken(this.trainingService.token)
      .subscribe((user: IUser) => {
        this.userActive = user;
        this.registration.userId = this.userActive.id;
      })
  }

  getTrainings() {
    this.trainingService.getAllTrainings()
      .subscribe((trainings: ITraining[]) => {
        this.trainings = trainings;
        this.filtrar();
      })
  }

  filtrar() {
    if (this.category == 'todos') {
      this.filters = this.trainings;
      this.cardSize = this.filters.length;

    } else {
      this.trainingService.getByCategory(this.category)
        .subscribe((trainings: ITraining[]) => {
          this.filters = trainings;
          this.cardSize = this.filters.length;
        },
          (error) => {
            this.filters = [];
            this.cardSize = this.filters.length;
          });
    }
  }

  isRegistered(idTraining: number): void {
    this.registration.trainingId = idTraining;

    this.trainingService.getTrainingsByUser(this.userActive?.id)
      .subscribe((training: ITraining[]) => {

        let myTrainings = training.filter(t => t.id == idTraining)

        if (myTrainings.length != 0) {
          this.alertService.alertUserIsRegistered()
        } else {
          this.registerCourse();
        }
      })
  }

  registerCourse() {
    this.trainingService.postRegistration(this.registration)
      .subscribe(result => console.log(result));

    this.alertService.alertRegisterSuccess();
  }

  getTotalRegisters() {
    this.trainingService.getTotalRegisters()
      .subscribe((result) => {
        this.cardSize = result;
        this.trainingService.totalTrainings = result;
        this.getTrainings();
      })
  }

  //Metodo para interpolação dos dados de Registro de Detalhes no HTML

  registredUsers: number = 10;
  progressUsers: number = 45;
  finishedUsers: number = 210;

  RecebeDetalhes() {
    this.trainingService.GetDetalhesTraining(this.trainingModel.id).subscribe(t => this.Details = t);
    this.registredUsers = this.Details.NRegistredUsers;
    this.progressUsers = this.Details.NProgressUsers;
    this.finishedUsers = this.Details.NFinishedUsers;
  }

}
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IModule } from 'src/app/models/modules';
import { ITraining } from 'src/app/models/training';
import { TrainingService } from '../../../../services/training/training.service';
const YTPlayer = require('yt-player');
@Component({
  selector: 'pro-training-video',
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss'],
})

export class TrainingVideoComponent implements OnInit {
  player: any;

  constructor(private trainingService: TrainingService,
    private router: Router,
    private serviceTitle: Title) { }

  training!: ITraining | null;
  modules!: IModule[];

  ngOnInit(): void {
    this.serviceTitle.setTitle('NDD Training - Video');
    this.training = this.trainingService.returnTraining();
    this.getModulesByTrainingId(this.training?.id);

    if (this.training == null)
      this.router.navigate(['home/trainings']);
  }

  getModulesByTrainingId(id: number) {
    this.trainingService.getModulesByTrainingId(id)
      .subscribe((modules: IModule[]) => {
        this.modules = modules;
        this.callVideo(modules[0]);
      })
  }

  statusModuloCOmplete = true;

  callVideo(module: IModule) {
    if (this.player) {
      this.player.destroy();
    }

    this.player = new YTPlayer('#player', {
      timeupdateFrequency: 5000,
    });

    let progressBar: any;
    let idDinamico: any;
    let totalPorcent: number;
    let totalVideo: number;
    let tempoAtual: number;
    let porcent: number;
    let varAux: number;

    this.player.load(module?.link) // https://youtube.com/embed/
    this.player.setVolume(10)

    this.player.on('timeupdate', () => {

      progressBar = document.getElementById(module?.id.toString());
      idDinamico = document.getElementById(module?.link)
      totalPorcent = 100;
      totalVideo = Math.round(this.player.getDuration());
      tempoAtual = Math.round(this.player.getCurrentTime());
      porcent = Math.round((totalPorcent * tempoAtual) / totalVideo);

      varAux = progressBar.style.width.slice(
        0,
        progressBar.style.width.length - 1
      );

      if (varAux <= porcent && porcent <= 100) {
        progressBar.style.width = `${porcent}%`;
      }

      if (porcent > 94) {
        idDinamico.style.visibility = 'hidden'
      }
      
      if (porcent > 96) {
      }

    });
  }
}

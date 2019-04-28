import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { IRoutine } from 'src/app/models/routine.model';
import { IBlock } from 'src/app/models/block.model';
import { FbService } from 'src/app/service/fb.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-routine',
  templateUrl: './add-routine.component.html',
  styleUrls: ['./add-routine.component.css']
})
export class AddRoutineComponent implements OnInit {
  users = [];
  currentDay = 0;
  routineModel: IRoutine = {};
  dateToShow: Date;
  daysArr = [
    {
      name: 'Lunes',
      id: 0
    },
    {
      name: 'Martes',
      id: 1
    },
    {
      name: 'Miercoles',
      id: 2
    },
    {
      name: 'Jueves',
      id: 3
    },
    {
      name: 'Viernes',
      id: 4
    },
    {
      name: 'Sabado',
      id: 5
    }
  ];
  blocks: IBlock[] = [
    {
      day: 0,
      exercises: [
        {
          name: '',
          description: '',
          reps: null
        }
      ]
    }
  ];

  constructor(private fbService: FbService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getUser();
  }

  sendNotification() {
    this.fbService
      .sendNotification(this.routineModel.uid)
      .subscribe(data => this.openSnackBar(`Notificacion enviada ✉️`));
  }
  async getUser() {
    this.users = await this.fbService.getAllUser();
    console.log(this.users);
  }

  addExNumber(i: number) {
    this.blocks[i].exercises.push({
      description: '',
      name: '',
      reps: null
    });
  }
  removeBlock(i: number) {
    this.blocks.splice(i, 1);
    this.blocks = this.blocks.map((b, index) => {
      b.number = index;
      return b;
    });
  }
  removeEx(indexBlock: number, indexEx: number) {
    this.blocks[indexBlock].exercises.splice(indexEx, 1);
  }
  onSubmit() {
    this.blocks = this.blocks.filter(b => {
      b.exercises = b.exercises.filter(e => e.reps != null && e.reps !== 0);
      if (b.exercises.length > 0) {
        return true;
      } else {
        return false;
      }
    });
    this.routineModel.blocks = this.blocks;
    this.routineModel.startDate = new Date().getTime();
    console.log(this.routineModel);
    if (this.routineModel.id) {
      this.fbService.editDoc(this.routineModel).then(res => {
        this.openSnackBar(`Bloque editado 🎉 `);
      });
    } else {
      this.fbService.saveDoc(this.routineModel).then(res => {
        this.openSnackBar(`Bloque guardado 🤘`);
      });
    }
  }
  addBlock() {
    this.blocks.push({
      day: this.currentDay,
      number: this.getNumOfBloqPerDay(this.currentDay),
      exercises: [
        {
          name: '',
          description: '',
          reps: null
        }
      ]
    });
  }
  async handleUserSelect(value: string) {
    const arrRes = await this.fbService.getByUid(value);
    if (arrRes && arrRes.length === 0) {
      // reset values
      this.dateToShow = undefined;
      this.routineModel = { uid: value };
      this.blocks = [
        {
          day: 0,
          exercises: [
            {
              name: '',
              description: '',
              reps: null
            }
          ]
        }
      ];
    } else {
      this.routineModel = arrRes[0];
      this.blocks = this.routineModel.blocks;
      this.dateToShow = new Date(this.routineModel.endDate);
    }
  }
  handleDaySelect(value: number) {
    if (this.getNumOfBloqPerDay(value) === 0) {
      this.blocks.push({
        day: value,
        number: this.getNumOfBloqPerDay(value),
        exercises: [
          {
            name: '',
            description: '',
            reps: null
          }
        ]
      });
    }
  }
  handleDateEnd(value: any) {
    const time = new Date(value).getTime();
    this.routineModel.endDate = time;
    const dataToUpdate: any = { endDate: time, id: this.routineModel.id };
    this.fbService.editDoc(dataToUpdate).then(data => console.log(data));
  }
  //  _helpers
  getNumOfBloqPerDay(day: number): number {
    return this.blocks.filter(b => b.day === day).length
      ? this.blocks.filter(b => b.day === day).length
      : 0;
  }
  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 4000
    });
  }
}

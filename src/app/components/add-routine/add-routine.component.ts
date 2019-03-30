import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { IRoutine } from 'src/app/models/routine.model';
import { IBlock } from 'src/app/models/block.model';
import { FbService } from 'src/app/service/fb.service';

@Component({
  selector: 'app-add-routine',
  templateUrl: './add-routine.component.html',
  styleUrls: ['./add-routine.component.css']
})
export class AddRoutineComponent implements OnInit {
  users = [];
  currentDay = 1;
  routineModel: IRoutine = {};
  numOfEx = [1, 2, 3];
  daysArr = [
    {
      name: 'Lunes',
      id: 1
    },
    {
      name: 'Martes',
      id: 2
    },
    {
      name: 'Miercoles',
      id: 3
    },
    {
      name: 'Jueves',
      id: 4
    },
    {
      name: 'Viernes',
      id: 5
    },
    {
      name: 'Sabado',
      id: 6
    }
  ];
  blocks: IBlock[] = [
    {
      day: 0,
      exercises: [
        {
          name: '',
          description: '',
          reps: 0
        },
        {
          name: '',
          description: '',
          reps: 0
        },
        {
          name: '',
          description: '',
          reps: 0
        }
      ]
    }
  ];

  constructor(private fbService: FbService) {}

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    this.users = await this.fbService.getAllUser();
    console.log(this.users);
  }

  addExNumber() {
    this.numOfEx.push(this.numOfEx.length + 1);
  }
  onSubmit(i: number) {
    // Buscar bloque numero y uid
    this.fbService.getByNumAndUid(
      this.routineModel.number,
      this.routineModel.uid
    );
    // si existe edita
    // no existe crea y genera el bloque
  }
  addBlock() {
    this.blocks.push({
      day: this.currentDay,
      exercises: [
        {
          name: '',
          description: '',
          reps: null
        },
        {
          name: '',
          description: '',
          reps: null
        },
        {
          name: '',
          description: '',
          reps: null
        }
      ]
    });
  }
}

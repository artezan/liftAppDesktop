import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRoutineComponent } from './components/add-routine/add-routine.component';

const routes: Routes = [
  { path: '', component: AddRoutineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

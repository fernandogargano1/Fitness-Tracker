import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';

import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();    
    private availableExercises: Exercise[] = [];

    private runningExercise: Exercise;
    private exercises: Exercise[] = [];


    constructor(private db: AngularFirestore) {}
    
    fetchAvailableExercises() {        
        this.db
            .collection('availableExercises')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return { 
                        id: doc.payload.doc.id,                        
                        name: doc.payload.doc.data().name,
                        duration: doc.payload.doc.data().duration,
                        calories: doc.payload.doc.data().calories
                    };
                });         
            })
            .subscribe((exercises: Exercise[]) => {
                this.availableExercises = exercises;                
                this.exercisesChanged.next([...this.availableExercises]);
            });
    }

    startExercise(selectedId: string) {        
        this.runningExercise = this.availableExercises.find(
            ex => ex.id == selectedId
        );           
        this.exerciseChanged.next({ ...this.runningExercise });      
    }

    completeExercise() {
        this.exercises.push({ 
            ...this.runningExercise, 
            date: new Date(), 
        state: 'completed' });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({ 
            ...this.runningExercise, 
            date: new Date(),
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100), 
            state: 'cancelled' });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {          
        return { ...this.runningExercise }
    }

    getCompletedOrCancelledExercises() {
        return this.exercises.slice();
    }
}
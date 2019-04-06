import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course: Course;

    @ViewChild('saveButton') saveButton: ElementRef;

    @ViewChild('searchInput') searchInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });

    }

    ngOnInit() {
        //this.p15_preSaveExample();
        //this.p16_concatMap();
        this.p18_mergeMap();
    }

    p15_preSaveExample() {
        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid)
            )
            .subscribe(changes => {
                const saveCourse$ = this.saveCourse(changes);
                saveCourse$.subscribe();
            });
    }

    p16_concatMap() {
        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid),
                concatMap(changes => this.saveCourse(changes))
            )
            .subscribe();
    }

    p18_mergeMap() {
        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid),
                mergeMap(changes => this.saveCourse(changes))
            )
            .subscribe();
    }

    p19_exhaustMap() {
        fromEvent(this.saveButton.nativeElement, "click")
        .pipe(
            exhaustMap(() => this.saveCourse(this.form.value))
        )
        .subscribe();
    }

    saveCourse(changes) {
        return fromPromise(
            fetch(`/api/courses/${this.course.id}`, {
                method: "PUT",
                body: JSON.stringify(changes),
                headers: {
                    "content-type": "application/json"
                }
            })
        );
    }

    ngAfterViewInit() {
        this.p19_exhaustMap();
    }

    close() {
        this.dialogRef.close();
    }

}

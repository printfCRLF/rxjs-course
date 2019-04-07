import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer, throwError } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, finalize } from 'rxjs/operators';
import { createHttpObservable } from "../common/util";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnersCourses: Course[];
    advancedCourses: Course[];

    beginnersCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor() {

    }

    ngOnInit() {
        // this.p11_reactive_design();
        // this.p25_replace_error();
        // this.p26_catch_rethrow();
        this.p27_retry();
    }

    p10_imperative_design() {
        const http$ = createHttpObservable("/api/courses");

        const courses$: Observable<Course[]> = http$
            .pipe(
                map(res => Object.values(res["payload"]))
            );

        courses$.subscribe(
            courses => {
                this.beginnersCourses = courses
                    .filter(course => course.category === "BEGINNER");
                this.advancedCourses = courses
                    .filter(course => course.category === "ADVANCED");
            },
            () => { },
            () => console.log("completed")
        );
    }

    p11_reactive_design() {
        const http$ = createHttpObservable("/api/courses");

        const courses$: Observable<Course[]> = http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"])),
                shareReplay(),
            );

        this.beginnersCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "BEGINNER"))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "ADVANCED"))
            );
    }

    p25_replace_error() {
        const http$ = createHttpObservable("/api/courses");

        const courses$: Observable<Course[]> = http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"])),
                shareReplay(),
                catchError(error => of([{
                    id: 0,
                    description: "RxJs In Practice Course",
                    iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
                    courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
                    longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
                    category: 'BEGINNER',
                    lessonsCount: 10
                }])),
            );

        this.beginnersCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "BEGINNER"))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "ADVANCED"))
            );
    }

    p26_catch_rethrow() {
        const http$ = createHttpObservable("/api/courses");

        const courses$: Observable<Course[]> = http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"])),
                shareReplay(),
                catchError(error => {
                    console.log(error);
                    return throwError(error);
                }),
                finalize(() => {
                    console.log("Finalize executed");
                })
            );

        this.beginnersCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "BEGINNER"))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "ADVANCED"))
            );
    }

    p27_retry() {
        const http$ = createHttpObservable("/api/courses");

        const courses$: Observable<Course[]> = http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"])),
                shareReplay(),
                retryWhen(errors =>
                    errors.pipe(
                        delayWhen(() => timer(2000)))
                )
            );

        this.beginnersCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "BEGINNER"))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === "ADVANCED"))
            );
    }

}

import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
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
        this.p11_reactive_design();
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

}

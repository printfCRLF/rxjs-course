import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, debounce, throttleTime
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable, createCancellableHttpObservable } from '../common/util';
import { RxJsLoggingLevel, debug } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: string;

    @ViewChild('searchInput') input: ElementRef;

    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
            .pipe(
                debug(RxJsLoggingLevel.Info, "course value"),
            );

    }

    ngAfterViewInit() {
        // this.p22_search_typeahead();
        // this.p28_startWith();
        this.p29_throttling_vs_debouncing();
    }

    p22_search_typeahead() {
        const searchLessons$ = fromEvent<any>(this.input.nativeElement, "keyup")
            .pipe(
                debounceTime(400),
                map(event => event.target.value),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search))
            );

        const initialLessons$ = this.loadLessons();
        this.lessons$ = concat(initialLessons$, searchLessons$);
    }

    p28_startWith() {
        this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup")
            .pipe(
                map(event => event.target.value),
                startWith(""),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search))
            );
    }

    p29_throttling_vs_debouncing() {
        this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup")
            .pipe(
                map(event => event.target.value),
                startWith(""),
                debug(RxJsLoggingLevel.Info, "search"),
                throttleTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug(RxJsLoggingLevel.Info, "lessons value"),
            );
    }

    loadLessons(search = ""): Observable<Lesson[]> {
        return createCancellableHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(response => response["payload"])
            );
    }
}

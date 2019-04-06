import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    concat,
    fromEvent,
    interval,
    noop,
    observable,
    Observable,
    of,
    timer,
    merge,
    Subject,
    BehaviorSubject,
    AsyncSubject,
    ReplaySubject
} from 'rxjs';
import { delayWhen, filter, map, take, timeout } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
        // this.l01p06_rxjs_observable(); 
        // this.l01p08_http_observable();
        this.l02p01_map_operator();
    }

    l01p05_stream_chainning_problem() {
        document.addEventListener("click", event => {
            console.log(event);
        });

        let counter = 0;

        setInterval(() => {
            console.log(counter);
            counter++;
        }, 1000);

        setTimeout(() => {
            console.log("finished");
        }, 3000);
    }

    l01p06_rxjs_observable() {
        const intervals$: Observable<number> = interval(1000);

        intervals$.subscribe(value => console.log(`stream 1 => ${value}`));
        intervals$.subscribe(value => console.log(`stream 2 => ${value}`));

        const click$ = fromEvent(document, "click");
        click$.subscribe(event => console.log(event));

    }

    l01p07_errors_completion_subscription() {
        const click$ = fromEvent(document, "click");
        click$.subscribe(
            event => console.log(event),
            error => console.log(error),
            () => console.log("completed")
        );
    }

    l01p08_http_observable() {
        const http$ = createHttpObservable("/api/courses");

        http$.subscribe(
            courses => console.log(courses),
            noop,
            () => console.log("completed")
        );
    }

    l02p01_map_operator() {
        const http$ = createHttpObservable("/api/courses");

        const courses$ = http$.pipe(
            map(response => Object.values(response["payload"]))
        );

        courses$.subscribe(
            courses => console.log(courses),
            noop,
            () => console.log("completed")
        );
    }
    
}

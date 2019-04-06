import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { of, concat, interval, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { createCancellableHttpObservable } from '../common/util';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        // this.p14_concatenation();
        // this.p17_merge();
        // this.p10_unsubscription();
        this.p10_unsubscription2();
    }

    p14_concatenation() {
        const source1$ = of(1, 2, 3);
        const source2$ = of(4, 5, 6);
        const source3$ = of(10, 11, 12);
        const result$ = concat(source1$, source2$, source3$);
        result$.subscribe(console.log);
    }

    p17_merge() {
        const interval1$ = interval(1000);
        const interval2$ = interval1$.pipe(map(val => 10 * val));
        const result$ = merge(interval1$, interval2$);
        result$.subscribe(console.log);
    }

    p10_unsubscription() {
        const interval1$ = interval(1000);
        const sub = interval1$.subscribe(console.log);
        setTimeout(() => sub.unsubscribe(), 5000);
    }

    p10_unsubscription2() {
        const http$ = createCancellableHttpObservable("/api/courses");
        const sub = http$.subscribe(console.log);
        setTimeout(() => sub.unsubscribe(), 0);
    }
}

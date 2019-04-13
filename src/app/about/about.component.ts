import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, BehaviorSubject, AsyncSubject, ReplaySubject} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
        // this.p34_subject();
        // this.p35_behaviorSubject();
        // this.p35_behaviorSubject2();
        // this.p36_asyncSubject();
        this.p36_replaySubject();
    }

    p34_subject() {
        const subject = new Subject();
        
        const series$ = subject.asObservable();
        series$.subscribe(console.log);

        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.complete();
    }

    p35_behaviorSubject() {
        const subject = new Subject();
        const series$ = subject.asObservable();
        series$.subscribe(value => console.log(`early subsription: ${value}`));

        subject.next(1);
        subject.next(2);
        subject.next(3);

        setTimeout(() => {
            series$.subscribe(value => console.log(`late subsription: ${value}`));
            subject.next(4);
        }, 3000);
    }

    p35_behaviorSubject2() {
        const subject = new BehaviorSubject(0);
        const series$ = subject.asObservable();
        series$.subscribe(value => console.log(`early subsription: ${value}`));

        subject.next(1);
        subject.next(2);
        subject.next(3);

        setTimeout(() => {
            series$.subscribe(value => console.log(`late subsription: ${value}`));
            subject.next(4);
        }, 3000);
    }

    p36_asyncSubject() {
        const subject = new AsyncSubject();
        const series$ = subject.asObservable();
        series$.subscribe(value => console.log(`early subsription: ${value}`));

        subject.next(1);
        subject.next(2);
        subject.next(3);

        subject.complete();
    }

    p36_replaySubject() {
        const subject = new ReplaySubject();
        const series$ = subject.asObservable();
        series$.subscribe(value => console.log(`early subsription: ${value}`));

        subject.next(1);
        subject.next(2);
        subject.next(3);

        setTimeout(() => {
            series$.subscribe(value => console.log(`late subsription: ${value}`));
            subject.next(4);
        }, 3000);
    }

}

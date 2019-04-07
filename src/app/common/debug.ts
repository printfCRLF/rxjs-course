import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
    Trace,
    Debug,
    Info,
    Error,
}

let rxjsLoggingLevel = RxJsLoggingLevel.Info;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
    rxjsLoggingLevel = level;
}

export const debug = (level: number, message: string) =>
    (source: Observable<any>) => source
        .pipe(
            tap(val => {
                if (level >= rxjsLoggingLevel) {
                    console.log(message + ": ", val);
                }
            })
        );;

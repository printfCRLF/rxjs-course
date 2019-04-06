import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
    return Observable.create(observer => {
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(body => {
                observer.next(body);
                observer.complete();
            })
            .catch(error => {
                observer.error(error);
            })
    });
}

export function createCancellableHttpObservable(url: string) {
    return Observable.create(observer => {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(url, { signal })
            .then(response => {
                return response.json();
            })
            .then(body => {
                observer.next(body);
                observer.complete();
            })
            .catch(error => {
                observer.error(error);
            });

        return () => controller.abort();

    });
}



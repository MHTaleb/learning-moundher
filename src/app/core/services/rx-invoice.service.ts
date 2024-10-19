
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, tap ,Observable , debounceTime, map, startWith, withLatestFrom,combineLatest} from 'rxjs';   

@Injectable({
    providedIn: 'root'
})
export class RxInvoiceService {
    //je declare un flux reactive ( cache )
    // good for caching, good for async init of a component, real time data in async mode
    private allInvoices: ReplaySubject<InvoiceModel[]> = new ReplaySubject<InvoiceModel[]>();
    allInvoices$ : Observable<InvoiceModel[]> = this.allInvoices.asObservable();
    logInfo$ = this.allInvoices$.pipe(tap(console.log));

    // inverse or replaysubject : data only if rendering is done :: form
    addInvoiceAction: Subject<InvoiceModel> = new Subject();
    addInvoiceEventHandler$ = this.addInvoiceAction.asObservable().pipe(
        tap((data: InvoiceModel) => {
            //database insertion
            this.initialData.push(data)
            //real timedata from DBA
            this.allInvoices.next(this.initialData)
        }
        )
    )

    //search feature
    filterInvoicesValue:Subject<string> = new Subject();
    filterInvoicesValue$:Observable<string> = this.filterInvoicesValue.asObservable().pipe(
        debounceTime(400),
        startWith("")
    );

    
    filteredInvoices$ = combineLatest([this.filterInvoicesValue$,this.allInvoices$]).pipe( 
        map(([fiterVal,allInvoicesData] : [string,InvoiceModel[]]) => allInvoicesData.filter(element => element.invoice_code.indexOf(fiterVal) >= 0))
    )
    
    isInDeleteMode: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    isInDeleteMode$: Observable<boolean> = this.isInDeleteMode.asObservable().pipe(startWith(false));
    
    startOfDelete = tap(() => this.isInDeleteMode.next(true));
    endOfDelete =  tap(() => this.isInDeleteMode.next(false));

    deleteAction: Subject<number> = new Subject<number>();
    deleteActionEventHandler$ = this.deleteAction.asObservable().pipe(
        this.startOfDelete,
        tap((id: number) => { 
            this.initialData = [...this.initialData.filter(ele => ele.id != id)];
            this.allInvoices.next(this.initialData);
         }),
         this.endOfDelete

    )


    constructor() {
        //init cache
        this.allInvoices.next(this.initialData);

    }

    initialData: InvoiceModel[] = [
        {
            id: 1,
            invoice_code: 'TINV001',
            supplier_id: 100,
            total_amount: 1500.00
        },
        {
            id: 2,
            invoice_code: 'TINV002',
            supplier_id: 101,
            total_amount: 2000.50
        },
        {
            id: 3,
            invoice_code: 'INV003',
            supplier_id: 102,
            total_amount: 990.99
        },
        {
            id: 4,
            invoice_code: 'INV004',
            supplier_id: 103,
            total_amount: 2500.75
        },
        {
            id: 5,
            invoice_code: 'INV005',
            supplier_id: 104,
            total_amount: 725.30
        }
    ];
}

export interface InvoiceModel {
    id: number;
    invoice_code: string;
    supplier_id: number;
    total_amount: number;
}
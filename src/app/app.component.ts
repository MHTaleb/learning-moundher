import { Component } from '@angular/core';
import { InvoiceModel, RxInvoiceService } from './core/services/rx-invoice.service';
import {  combineLatest, map,Subscription  } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit,OnDestroy {
  newInvoice: InvoiceModel = {
    id: 0,
    invoice_code: '',
    supplier_id: 0,
    total_amount: 0,
  }; 


  vm$ = combineLatest([this.rxInvoiceService.filteredInvoices$,this.rxInvoiceService.isInDeleteMode$]).pipe(
    map(([allInvoices,inDeleteMode]) => ({invoices : allInvoices, inDeleteMode:inDeleteMode}))
  )

  constructor(
    private readonly rxInvoiceService : RxInvoiceService
  ) {

  }

  doSearch(value:string):void{
    console.log(value);
    this.rxInvoiceService.filterInvoicesValue.next(value);
  }

  deleteInvoice(invoice_id: number): void { 
    this.rxInvoiceService.deleteAction.next(invoice_id);
  }

  addInvoice() { }

  subscription:Subscription ;

  ngOnInit():void{
    this.subscription = this.rxInvoiceService.deleteActionEventHandler$.subscribe();
  }

  ngOnDestroy():void{
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

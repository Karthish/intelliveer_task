import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionsService } from './../transactions.service';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})


export class ListComponent {
  listItems: Transaction[] = [];
  constructor(private transactionsService: TransactionsService, private router: Router) { }

  ngOnInit(): void {
    let list: any;
    list = this.transactionsService.getItem('transactions');
    this.listItems = JSON.parse(list);
    console.log(this.listItems);
  }

  deleteItem(id: number): void {
    this.listItems = this.listItems.filter(transaction => transaction.id !== id);
    this.transactionsService.setItem('transactions', JSON.stringify(this.listItems));
  }

  editItem(id: number): void {
    this.router.navigate(['/addEdit'], { queryParams: { id } });
  }

}

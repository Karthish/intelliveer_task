import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from './../transactions.service';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: string;
}

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class AddEditComponent implements OnInit {
  transactionForm!: FormGroup;
  transactionsArr: Transaction[] = [];
  transactionId!: number;

  constructor(private fb: FormBuilder, private transactionsService: TransactionsService,
    private route: ActivatedRoute, private router: Router
  ) { }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required]],
      date: ['', Validators.required],
      type: ['', Validators.required]
    });

    // Load transactions from the service
    const savedTransactions = this.transactionsService.getItem('transactions');
    if (savedTransactions) {
      this.transactionsArr = JSON.parse(savedTransactions);
    }

    this.route.queryParams.subscribe(params => {
      this.transactionId = +params['id'];
      if(this.transactionId) {
        const transaction = this.transactionsArr.find(transaction => transaction.id === this.transactionId);
        console.log('transaction',transaction);
        if (transaction) {
          this.transactionForm.patchValue(transaction);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transaction = this.transactionForm.value as Transaction;
      if (this.transactionId) {

        // Editing an existing transaction
        const index = this.transactionsArr.findIndex(t => t.id === this.transactionId);
        if (index !== -1) {
          this.transactionsArr[index] = { ...transaction, id: this.transactionId };
        }
      } else {
        // Adding a new transaction
        transaction.id = this.transactionsArr.length ? this.transactionsArr[this.transactionsArr.length - 1].id + 1 : 1;
        this.transactionsArr.push(transaction);
      }
      
      this.transactionsService.setItem('transactions', JSON.stringify(this.transactionsArr));
      this.router.navigate(['/list']);
      console.log('Transaction Submitted', transaction);
    } else {
      alert('Form is invalid');
    }
  }
}

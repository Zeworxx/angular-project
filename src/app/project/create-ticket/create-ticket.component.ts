import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ITicket } from '../../ticket-list/models/ticket';
import { TicketService } from '../../ticket-list/services/ticket.service';
import { dueDateValidator } from '../validators/date.validators';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.less'],
})
export class CreateTicketComponent implements OnInit {
  ticketForm: FormGroup;
  private userId: string;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getSavedUser();

    this.ticketForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      dueDate: new FormControl('', [Validators.required, dueDateValidator]),
      status: new FormControl('todo', [Validators.required]),
      subtasks: this.fb.array([]),
    });
  }

  get subtasks() {
    return this.ticketForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(
      this.fb.group({
        title: new FormControl('', [Validators.required]),
      })
    );
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  submitForm() {
    if (this.ticketForm.invalid) return;

    const newTicket: ITicket = {
      id: 0,
      title: this.ticketForm.value.title,
      description: this.ticketForm.value.description,
      dueDate: this.ticketForm.value.dueDate,
      status: this.ticketForm.value.status,
      subtasks: this.ticketForm.value.subtasks,
      user: this.userId,
    };

    this.ticketService.createTicket(newTicket).subscribe(
      (ticket) => {
        this.router.navigate(['/ticket-list/all']);
      },
      (error) => {
        console.error('Erreur lors de la création du ticket:', error);
      }
    );
  }
}

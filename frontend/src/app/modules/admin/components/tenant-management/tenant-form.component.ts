import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import reactive forms modules

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.scss']
})
export class TenantFormComponent implements OnInit {
  tenantForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      initialAdminUserId: [null, Validators.required] // For selecting tenant admin
    });
  }
  ngOnInit(): void { }
  onSubmit() {
    console.log(this.tenantForm.value);
  }
}

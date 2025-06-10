import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import for reactive forms
import { TenantFormComponent } from './tenant-form.component';
import { StoreModule } from '@ngrx/store'; // If store is injected
// Import any other necessary modules (e.g., Angular Material form field modules)

describe('TenantFormComponent', () => {
  let component: TenantFormComponent;
  let fixture: ComponentFixture<TenantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantFormComponent ],
      imports: [
        ReactiveFormsModule, // Essential for this component
        StoreModule.forRoot({}) // Basic store setup if Store is injected
        // Add other necessary modules (e.g., MatFormFieldModule, MatInputModule)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding, ngOnInit, and form creation
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tenantForm with name, description, and initialAdminUserId controls', () => {
    expect(component.tenantForm).toBeDefined();
    expect(component.tenantForm.get('name')).toBeDefined();
    expect(component.tenantForm.get('description')).toBeDefined();
    expect(component.tenantForm.get('initialAdminUserId')).toBeDefined();
  });

  it('name field should be required', () => {
    const nameControl = component.tenantForm.get('name');
    nameControl?.setValue(''); // Set to empty
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('initialAdminUserId field should be required', () => {
    const adminIdControl = component.tenantForm.get('initialAdminUserId');
    adminIdControl?.setValue(null); // Set to null or empty
    expect(adminIdControl?.valid).toBeFalsy();
    expect(adminIdControl?.errors?.['required']).toBeTruthy();
  });

  it('description field should not be required', () => {
    const descriptionControl = component.tenantForm.get('description');
    descriptionControl?.setValue('');
    expect(descriptionControl?.valid).toBeTruthy(); // Should be valid even if empty
  });

  // Add more tests as functionality grows
  // e.g., form submission, patching values for edit mode, etc.
});

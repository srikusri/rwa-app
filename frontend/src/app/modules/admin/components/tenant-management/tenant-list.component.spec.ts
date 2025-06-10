import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantListComponent } from './tenant-list.component';
import { StoreModule } from '@ngrx/store'; // Needed if component uses store directly, even for basic setup
// Import any other modules this component might eventually need, e.g., Angular Material modules

describe('TenantListComponent', () => {
  let component: TenantListComponent;
  let fixture: ComponentFixture<TenantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantListComponent ],
      imports: [
        StoreModule.forRoot({}) // Basic store setup for components that might inject Store
        // Add other necessary modules here, e.g., MatTableModule if used in template
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding and ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here as the component's functionality grows
  // For example:
  // it('should display a list of tenants', () => { ... });
  // it('should dispatch loadTenants action on init', () => { ... });
});

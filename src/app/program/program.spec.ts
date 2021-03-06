import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProgramPage } from './program';

describe('ProgramPage', () => {
  let component: ProgramPage;
  let fixture: ComponentFixture<ProgramPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

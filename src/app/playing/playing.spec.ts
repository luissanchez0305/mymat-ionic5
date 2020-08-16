import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayingPage } from './playing';

describe('PlayingPage', () => {
  let component: PlayingPage;
  let fixture: ComponentFixture<PlayingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

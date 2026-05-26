import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    fixture.componentRef.setInput('label', 'ID');
    fixture.componentRef.setInput('control', new FormControl(''));
    fixture.detectChanges();
  });

  it('muestra la etiqueta', () => {
    const label = fixture.nativeElement.querySelector('.label');
    expect(label.textContent).toContain('ID');
  });

  it('marca el input como invalido cuando hay error', () => {
    fixture.componentRef.setInput('error', 'ID no valido!');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'ID no valido!'
    );
  });
});

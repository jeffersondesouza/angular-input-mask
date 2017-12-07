import { MaskDirective } from './mask.directive';
import { directiveDef } from '@angular/core/src/view/provider';

describe('MaskDirective', () => {


  it('should create an instance', () => {
    const directive = new MaskDirective();
    expect(directive).toBeTruthy();
  });



  it('should set a value greater then patter value', () => {
    const directive = new MaskDirective();
    directive.appMask = '999.999.999-99';
    const event = {
      target: {
        value: '123'
      }
    };

    directive.onInput(event);
    expect(event.target.value).toBe('123.');
  });


  it('should set first part of string link cpf', () => {
    const directive = new MaskDirective();
    directive.appMask = '999.999.999-99';
    const event = {
      target: {
        value: '123'
      }
    };

    directive.onInput(event);
    expect(event.target.value).toBe('123.');
  });


  it('should set second part of string link cpf', () => {
    const directive = new MaskDirective();
    directive.appMask = '999.999.999-99';
    const event = {
      target: {
        value: '123'
      }
    };

    directive.onInput(event);
    expect(event.target.value).toBe('123.');

    event.target.value = '123.123';
    directive.onInput(event);
    expect(event.target.value).toBe('123.123.');

  });




  it('should set second part of string link cpf when delete the point', () => {
    const directive = new MaskDirective();
    directive.appMask = '999.999.999-99';
    const event = {
      target: {
        value: '123'
      }
    };

    directive.onInput(event);
    expect(event.target.value).toBe('123.');

    event.target.value = '1231';
    directive.onInput(event);
    expect(event.target.value).toBe('123.1');

  });

  it('should set tird part of string link cpf', () => {
    const directive = new MaskDirective();
    directive.appMask = '999.999.999-99';
    const event = {
      target: {
        value: '123'
      }
    };

    directive.onInput(event);
    expect(event.target.value).toBe('123.');


    event.target.value = '123.12';
    directive.onInput(event);
    expect(event.target.value).toBe('123.12');

    event.target.value = '123.123';
    directive.onInput(event);
    expect(event.target.value).toBe('123.123.');

    event.target.value = '123.123.123';
    directive.onInput(event);
    expect(event.target.value).toBe('123.123.123-');


    event.target.value = '123.123.123-12';
    directive.onInput(event);
    expect(event.target.value).toBe('123.123.123-12');


    event.target.value = '123.123.123-122';
    directive.onInput(event);
    expect(event.target.value).toBe('123.123.123-12');

  });





});

import { MaskDirective } from './mask.directive';

describe('MaskDirective', () => {


  it('should create an instance', () => {
    const directive = new MaskDirective();
    expect(directive).toBeTruthy();
  });


  it('should create an instance', () => {
    const directive = new MaskDirective();

    directive.appMask = '999.999.999-99';

    expect(directive).toBeTruthy();
  });


});

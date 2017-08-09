import { CustomerSortPipe } from './customer-sort.pipe';

describe('CustomerSortPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomerSortPipe();
    expect(pipe).toBeTruthy();
  });
});

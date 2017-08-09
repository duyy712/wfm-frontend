import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerSort',
  pure: false
})
export class CustomerSortPipe implements PipeTransform {

  transform(array: any[], args?: any): any[] {
    if (array == null) {
      return null;
    }


    array.sort((a, b) => {
      if (a.Name < b.Name) {
        return -1;
        // .completed because we want to sort the list by completed property
      } else if (a.Name > b.Name) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPercent'
})
export class CustomPercentPipe implements PipeTransform {
  transform(value: number | string): string {
    // Check if the input is a string ending with '%'
    if (typeof value === 'string' && value.endsWith('%')) {
      // If it's a percentage string, remove the '%' sign and return it as is
      return value;
    }

    // If the input is a number, multiply it by 100 and add '%' to represent it as a percentage
    if (typeof value === 'number') {
      return `${(value ).toFixed(2)}%`;
    }

    // If the input is not a number or percentage string, return it as is
    return value.toString();
  }
}

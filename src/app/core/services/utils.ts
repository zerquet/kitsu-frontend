export class Utils {
  static IsNullOrUndefined(value: any): boolean {
      if(value === undefined || value === null) return true;
      return false;
  }
}
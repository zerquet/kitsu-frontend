export class Utils {
  static IsNullOrUndefined(value: any): boolean {
      if(value === undefined || value === null) return true;
      return false;
  }

  static JwtTokenIsExpired(date: number): boolean {
    //converting expiry date from seconds to milliseconds by multiplying it by 1000
    return date * 1000 < Date.now();
  }
}
import { Browser } from '../data-structs/browser-types';

/**
 * Custom Logging class, providing a Logging.log(s) that prepends the caller function
 * name to `s`.
 */
export class Logging {
    /**
     * Wrapper for console.log, prepending the caller function name.
     * @param s - string to be logged.
     */
    static log(s: any): void {
      let caller = "";
      if (Browser.isFirefox()){
        caller = this.getParent();
      } else {
        caller = "undefined";
      }
      console.log(`[${caller}] ${s}`)
    }

    /**
     * @returns name of the calling function.
     */
    private static getParent(): string {
      try {
        throw new Error();
      } catch (e) {
        // matches this function, the caller and the parent
        const allMatches = e.stack.match(/(\w+)@|at (\w+) \(/g);
        // match parent function name
        console.log(allMatches);
        const parentMatches = allMatches[2].match(/(\w+)@|at (\w+) \(/);
        // return only name
        return parentMatches[1] || parentMatches[2];
      }
    }
}
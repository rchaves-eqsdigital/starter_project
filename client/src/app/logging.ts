export class Logging {
    static log(s: string): void {
        let caller = this.getParent();
        console.log(`[${caller}] ${s}`)
    }

    private static getParent(): string {
      try {
        throw new Error();
      } catch (e) {
        // matches this function, the caller and the parent
        const allMatches = e.stack.match(/(\w+)@|at (\w+) \(/g);
        // match parent function name
        const parentMatches = allMatches[2].match(/(\w+)@|at (\w+) \(/);
        // return only name
        return parentMatches[1] || parentMatches[2];
      }
    }
}
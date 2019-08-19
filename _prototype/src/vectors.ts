import Victor from 'victor';

/* The type definition for Victor here:
   https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/victor
   defines the export as a Class, which means it can't be expressed in the types that you can call it
   without `new`. I really like the functional form over the OO form so I want to be able to call it
   new-less without the compiler complaining.

   I found this idea at:
   https://stackoverflow.com/questions/38754854/in-typescript-can-a-class-be-used-without-the-new-keyword
   which demonstrates how you can cast the Class to a type that has both a function signature, and a
   constructor (to be used with `new`).
*/

interface VictorCtor {
  new(x: number, y: number): Victor
  (x: number, y: number): Victor
}

// the cast to `unknown` is necessary here to prevent error TS2352
const victorCtor = (Victor as unknown) as VictorCtor;
export default victorCtor;

import { typedEventEmiter } from './eventEmiter'


export class ExpectError extends Error {
  expect = true
  static printIfNotExpect (err: any) {
    // console.log(err instanceof ExpectError, err.expect) false true ???
    if (!('expect' in err)) {
      throw err
    }
  }

  static makeRandomErrorEnv (errorProbability = [0, 0.3, 0.5, 0.7, 1]) {
   return {
      runCount: 0,
      errorCount: 0,
      ...typedEventEmiter<{ error: number }>(),
      try () {
        const currProbability = errorProbability[++this.runCount]
        if (Math.random() < currProbability) {
          this.errorCount++
          this.eventEmiter.emit('error', this.errorCount)
          throw new ExpectError()
        }
      }
    }
  }
}

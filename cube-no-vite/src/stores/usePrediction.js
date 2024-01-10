import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {
  return {
    pred: null,
    updatePred: (newPred = null) => set(state => ({pred:newPred})),
    reset: false,
    changeReset: (val = true) => set(state => ({reset:val})),
    shuffle: false,
    startShuffle: () => set(state => {
      if (state.shuffle === false) {
        return {shuffle: true}
      }
      return {}
    }),
    endShuffle: () => set(state => {
      if (state.shuffle === true) {
        return {shuffle: false}
      }
      return {}
    })
  }
}))
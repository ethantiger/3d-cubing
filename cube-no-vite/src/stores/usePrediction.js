import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {
  return {
    pred: null,
    updatePred: (newPred = null) => set(state => ({pred:newPred})),
    reset: false,
    changeReset: (val = true) => set(state => ({reset:val}))
  }
}))
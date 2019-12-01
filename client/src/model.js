import { action, thunk } from 'easy-peasy'
import axios from 'axios'

const images = {
  defaultState: {
    loading: true,
    error: false,
    errorMessage: null,
    images: [],
  },
  insertImages: action((state, payload) => {
    state.defaultState.loading = false
    state.defaultState.images = payload
  }),
  error: action((state, error) => {
    state.defaultState.error = true
    state.defaultState.errorMessage = error
  }),
  getImages: thunk(async (actions, payload) => {
    try {
      const request = await axios.get('http://0.0.0.0:8080/images')
      actions.insertImages(request.data.images)
    } catch (error) {
      actions.error(error)
    }
  })
}

export default {
  images,
}

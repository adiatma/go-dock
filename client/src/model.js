// @flow
import { action, thunk, Action, Thunk } from 'easy-peasy'
import axios from 'axios'

type DefaultStateType = {
  loading: boolean,
  error: boolean,
  errorMessage: null,
  images: Array<any>,
}

type ImagesTypes = {
  defaultState: DefaultStateType,
  insertImages: Action<DefaultStateType, Array<any>>,
  error: Action<DefaultStateType, any>,
  getImages: Thunk<{}, void, any, {}, any>,
}

const images: ImagesTypes = {
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
      const request = await axios.get('/api/images')
      actions.insertImages(request.data.images)
    } catch (error) {
      actions.error(error)
    }
  })
}

export default {
  images,
}

// @flow
import { action, thunk, Action, Thunk } from 'easy-peasy'
import axios from 'axios'

type DefaultState = {
  loading: boolean,
  error: boolean,
  errorMessage: null,
}

type ImagesStateType = {
  ...DefaultState,
  images: Array<any>,
}

type ImagesTypes = {
  defaultState: ImagesStateType,
  insertImages: Action<ImagesStateType, Array<any>>,
  error: Action<ImagesStateType, any>,
  getImages: Thunk<{}, void, any, {}, any>,
}

type InfoStateType = {
  ...DefaultState,
  info: null,
}

type InfoTypes = {
  defaultState: InfoStateType,
  insertInfo: Action<InfoStateType, any>,
  error: Action<InfoStateType, any>,
  getInfo: Thunk<{}, void, any, {}, any>,
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

const info: InfoTypes = {
  defaultState: {
    loading: true,
    error: false,
    errorMessage: null,
    info: null,
  },
  insertInfo: action((state, payload) => {
    state.defaultState.loading = false
    state.defaultState.info = payload
  }),
  error: action((state, error) => {
    state.defaultState.error = true
    state.defaultState.errorMessage = error
  }),
  getInfo: thunk(async (actions, payload) => {
    try {
      const request = await axios.get('/api/info')
      actions.insertInfo(request.data.info)
    } catch (error) {
      actions.error(error)
    }
  })
}

const diskUsage = {
  defaultState: {
    loading: true,
    error: false,
    errorMessage: null,
    disk: null,
  },
  insertDiskUsage: action((state, payload) => {
    state.defaultState.loading = false
    state.defaultState.disk = payload
  }),
  error: action((state, error) => {
    state.defaultState.error = true
    state.defaultState.errorMessage = error
  }),
  getDiskUsage: thunk(async (actions, payload) => {
    try {
      const request = await axios.get('/api/disk-usage')
      actions.insertDiskUsage(request.data.disk_usage)
    } catch(error) {
      actions.error(error)
    }
  })
}

export default {
  images,
  info,
  diskUsage,
}

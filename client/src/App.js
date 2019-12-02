// @flow
import * as React from 'react'
import {StoreProvider} from 'easy-peasy'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import {Spinner} from 'reactstrap'

import store from './store'
import TopNavigation from './components/TopNavigation'

const InfoLazy = React.lazy(() => import('./pages/Info'))
const ImagesLazy = React.lazy(() => import('./pages/Images'))

function RouterWeb(): React.Node {
  return (
    <Router>
      <>
        <TopNavigation />
        <Switch>
          <Route exact path="/">
            <InfoLazy />
          </Route>
          <Route exact path="/images">
            <ImagesLazy />
          </Route>
        </Switch>
      </>
    </Router>
  )
}

function FirstTimeLoading(): React.Node {
  return <Spinner style={{width: '3rem', height: '3rem'}} />
}

function App(): React.Node {
  return (
    <StoreProvider store={store}>
      <React.Suspense fallback={<FirstTimeLoading />}>
        <RouterWeb />
      </React.Suspense>
    </StoreProvider>
  )
}

export default App

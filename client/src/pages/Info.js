// @flow
import * as React from 'react'
import {
  useStoreDispatch,
  Dispatch,
  Action,
  useStoreState,
} from 'easy-peasy'
import {Container, Jumbotron, Badge, Spinner} from 'reactstrap'

import formatBytes from '../utils'

export default function Info(): React.Node {
  const dispatch: Dispatch<{}, Action<any>> = useStoreDispatch()
  const state = useStoreState(state => state.info.defaultState)

  React.useEffect(() => {
    dispatch.info.getInfo()
    dispatch.diskUsage.getDiskUsage()
  }, [dispatch])

  if (state.loading)
    return <Spinner style={{width: '3rem', height: '3rem'}} />

  return (
    <Container>
      <Jumbotron>
        <h1 className="display-3">Info</h1>
        <p className="lead">
          OS Type <Badge>{state.info.OSType}</Badge> / Kernel Version{' '}
          <Badge>{state.info.KernelVersion}</Badge> / OperatingSystem{' '}
          <Badge>{state.info.OperatingSystem}</Badge>
        </p>
        <hr className="my-2" />
        <p className="lead">
          Memory <Badge>{formatBytes(state.info.MemTotal)}</Badge>{' '}
        </p>
        <p className="lead">
          Containers <Badge>{state.info.Containers}</Badge> /
          Containers running{' '}
          <Badge>{state.info.ContainersRunning}</Badge> / Containers
          paused <Badge>{state.info.ContainersPaused}</Badge> /
          Containers stoped{' '}
          <Badge>{state.info.ContainersStopped}</Badge>
        </p>
      </Jumbotron>
    </Container>
  )
}

// @flow
import * as React from 'react'
import {
  useStoreDispatch,
  Dispatch,
  Action,
  useStoreState,
} from 'easy-peasy'
import {
  Container,
  Jumbotron,
  Badge,
  Spinner,
  Card,
  CardTitle,
  CardBody,
  CardSubtitle,
  CardText,
  CardDeck,
} from 'reactstrap'

import formatBytes from '../utils'

export default function Info(): React.Node {
  const dispatch: Dispatch<{}, Action<any>> = useStoreDispatch()
  const stateInfo = useStoreState(state => state.info.defaultState)
  const stateDiskUsage = useStoreState(
    state => state.diskUsage.defaultState,
  )

  React.useEffect(() => {
    dispatch.info.getInfo()
    dispatch.diskUsage.getDiskUsage()
  }, [dispatch])

  if (stateInfo.loading)
    return <Spinner style={{width: '3rem', height: '3rem'}} />

  return (
    <Container>
      <Jumbotron>
        <h1 className="display-3">Info</h1>
        <p className="lead">
          OS Type <Badge>{stateInfo.info.OSType}</Badge> / Kernel
          Version <Badge>{stateInfo.info.KernelVersion}</Badge> /
          OperatingSystem{' '}
          <Badge>{stateInfo.info.OperatingSystem}</Badge>
        </p>
        <hr className="my-2" />
        <p className="lead">
          Memory <Badge>{formatBytes(stateInfo.info.MemTotal)}</Badge>{' '}
        </p>
        <p className="lead">
          Containers <Badge>{stateInfo.info.Containers}</Badge> /
          Containers running{' '}
          <Badge>{stateInfo.info.ContainersRunning}</Badge> /
          Containers paused{' '}
          <Badge>{stateInfo.info.ContainersPaused}</Badge> /
          Containers stoped{' '}
          <Badge>{stateInfo.info.ContainersStopped}</Badge>
        </p>
      </Jumbotron>
      {stateDiskUsage.disk && (
        <DiskUsage
          images={stateDiskUsage.disk.Images}
          containers={stateDiskUsage.disk.Containers}
        />
      )}
    </Container>
  )
}

type DiskUsageProps = {
  images: Array<any>,
  containers: Array<any>,
}

function DiskUsage({images, containers}: DiskUsageProps): React.Node {
  return (
    <>
      <div style={{marginBottom: '1rem'}}>
        <h2>Images</h2>
        <CardDeck>
          {images.map(image => (
            <Card key={image.Id}>
              <CardBody>
                <CardTitle>{image.RepoTags}</CardTitle>
                <CardSubtitle>
                  <Badge>{formatBytes(image.Size)}</Badge>
                </CardSubtitle>
                <CardText><code>{image.Id}</code></CardText>
              </CardBody>
            </Card>
          ))}
        </CardDeck>
      </div>
      <div style={{marginBottom: '1rem'}}>
        <h2>Containers</h2>
        <CardDeck>
          {containers.map(container => (
            <Card key={container.Id}>
              <CardBody>
                <CardTitle>{container.Names[0]}</CardTitle>
                <CardSubtitle>
                  <Badge>{formatBytes(container.SizeRootFs)}</Badge>
                </CardSubtitle>
                <CardText>{container.Image}</CardText>
                <CardText>{container.Status}</CardText>
              </CardBody>
            </Card>
          ))}
        </CardDeck>
      </div>
    </>
  )
}

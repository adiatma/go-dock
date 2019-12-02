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
  Badge,
  Spinner,
  Card,
  CardTitle,
  CardBody,
  CardSubtitle,
  CardText,
  CardDeck,
  Table,
  Button
} from 'reactstrap'
import { Link } from 'react-router-dom'

import formatBytes from '../utils'

export default (): React.Node => {
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
      {stateInfo && <Info info={stateInfo.info} />}
      {stateDiskUsage.disk && (
        <DiskUsage
          images={stateDiskUsage.disk.Images}
          containers={stateDiskUsage.disk.Containers}
        />
      )}
    </Container>
  )
}

type InfoProps = {
  info: {
    OSType: string,
    KernelVersion: string,
    OperatingSystem: String,
    MemTotal: number,
  },
}

function Info({info}: InfoProps): React.Node {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>OS type</th>
          <th>Kernel Version</th>
          <th>Operating System</th>
          <th>Memory</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{info.OSType}</td>
          <td>{info.KernelVersion}</td>
          <td>{info.OperatingSystem}</td>
          <td>{formatBytes(info.MemTotal)}</td>
        </tr>
      </tbody>
    </Table>
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
        <h2><Link to={`/images`} style={{ color: "black" }}>Images</Link></h2>
        <CardDeck>
          {images.map(image => (
            <Card key={image.Id}>
              <CardBody>
                <CardTitle>{image.RepoTags}</CardTitle>
                <CardSubtitle>
                  <Badge color="info">{formatBytes(image.Size)}</Badge>
                </CardSubtitle>
                <CardText>
                  <code>{image.Id}</code>
                </CardText>
                <Button outline color="danger">Remove</Button>
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
                <CardTitle>{container.Names}</CardTitle>
                <CardSubtitle>
                  <Badge color="info">{formatBytes(container.SizeRootFs)}</Badge>
                </CardSubtitle>
                <CardText>{container.Image}</CardText>
                <CardText>{container.Status}</CardText>
                <Button outline color="danger">Remove</Button>
                <Button outline color="warning">Stop</Button>
                <Button outline color="info">Run</Button>
              </CardBody>
            </Card>
          ))}
        </CardDeck>
      </div>
    </>
  )
}

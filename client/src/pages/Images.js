// @flow
import * as React from 'react'
import {
  useStoreDispatch,
  useStoreState,
  Dispatch,
  Action,
} from 'easy-peasy'
import {Table, Container, Badge, Spinner} from 'reactstrap'

import formatBytes from '../utils'

export default function Images(): React.Node {
  const dispatch: Dispatch<{}, Action<any>> = useStoreDispatch()
  const state = useStoreState(state => state.images.defaultState)

  React.useEffect(() => {
    dispatch.images.getImages()
  }, [dispatch])

  if (state.loading) return <Spinner style={{width: '3rem', height: '3rem'}} />

  return (
    <Container>
      {state.images && <ImageTable images={state.images} />}
    </Container>
  )
}

function ImageTable({images}): React.Node {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Repo Tags</th>
          <th>Created</th>
          <th>Size</th>
          <th>Virtual Size</th>
        </tr>
      </thead>
      <tbody>
        {images &&
          images.map(image => (
            <tr key={image.Id}>
              <td>
                <ImageRepoTags repoTags={image.RepoTags[0]} />
              </td>
              <td>{new Date(image.Created).toDateString()}</td>
              <td>{formatBytes(image.Size)}</td>
              <td>{formatBytes(image.VirtualSize)}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}

type ImageRepoTagsProps = {
  repoTags: string,
}

function ImageRepoTags({repoTags}: ImageRepoTagsProps): React.Node {
  const splitingRepoByTags = repoTags.split(':')
  const imageName = splitingRepoByTags[0]
  const tags = splitingRepoByTags[1]

  return (
    <React.Fragment>
      {imageName} <Badge>{tags}</Badge>
    </React.Fragment>
  )
}

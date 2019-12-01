import React from "react";
import { useStoreDispatch, useStoreState } from "easy-peasy";
import { Table, Container, Navbar, NavbarBrand, Badge  } from "reactstrap";

import formatBytes from './utils'

function TopNavigation() {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <Navbar color="light" light>
        <NavbarBrand href="/">Go Dock</NavbarBrand>
      </Navbar>
    </div>
  )
}

function Footer() {
  return <p className="text-center">GoDock@2019 | Crafted with Love</p>
}

export default function() {
  const dispatch = useStoreDispatch()
  const state = useStoreState(state => state.images.defaultState)

  React.useEffect(() => {
    dispatch.images.getImages()
  }, [dispatch])

  return (
    <React.Fragment>
      <TopNavigation />
      <Container>
        {state.images && <ImageTable images={state.images} />}
      </Container>
      <Footer />
    </React.Fragment>
  )
}

function ImageTable({ images }) {
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
        {images && images.map(image => (
          <tr key={image.Id}>
            <td><ImageRepoTags repoTags={image.RepoTags[0]} /></td>
            <td>{new Date(image.Created).toDateString()}</td>
            <td>{formatBytes(image.Size)}</td>
            <td>{formatBytes(image.VirtualSize)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

function ImageRepoTags({ repoTags }) {
  const splitingRepoByTags = repoTags.split(":")
  const imageName = splitingRepoByTags[0]
  const tags = splitingRepoByTags[1]

  return (
    <React.Fragment>
      {imageName} <Badge>{tags}</Badge>
    </React.Fragment>
  )
}

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/registry"
	"github.com/docker/docker/client"
)

// ImagesResponse type
type ImagesResponse struct {
	Status int                  `json:"status"`
	Images []types.ImageSummary `json:"images"`
}

// ImagesSearchResponse type
type ImagesSearchResponse struct {
	Status int                     `json:"status"`
	Term   string                  `json:"term"`
	Images []registry.SearchResult `json:"images"`
}

// AbsoultePath type
type AbsoultePath struct {
	Static string
	Index  string
}

func main() {
	absolutePath := AbsoultePath{Static: "client/build", Index: "index.html"}

	http.HandleFunc("/", absolutePath.Serve)
	http.HandleFunc("/images", Images)
	http.HandleFunc("/images/search", ImagesSearch)

	HOST := "0.0.0.0"
	PORT := "8080"

	fmt.Printf("Server running in http://%s:%s \n", HOST, PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%s", HOST, PORT), nil))
}

// DockerClient to initialize docker client api
func DockerClient() *client.Client {
	dockerClient, err := client.NewEnvClient()
	if err != nil {
		panic(err)
	}
	return dockerClient
}

// Serve client html
func (absolutePath AbsoultePath) Serve(w http.ResponseWriter, r *http.Request) {
	path, _ := filepath.Abs(r.URL.Path)
	path = filepath.Join(absolutePath.Static, path)
	http.FileServer(http.Dir(absolutePath.Static)).ServeHTTP(w, r)
}

// Images handler to show all images
func Images(w http.ResponseWriter, r *http.Request) {
	res := ImagesResponse{}
	res.Status = http.StatusOK
	dockerClient := DockerClient()
	images, _ := dockerClient.ImageList(context.Background(), types.ImageListOptions{})
	res.Images = images
	json.NewEncoder(w).Encode(res)
}

// ImagesSearch to list all images by term of serach
func ImagesSearch(w http.ResponseWriter, r *http.Request) {
	term := r.URL.Query().Get("term")
	res := ImagesSearchResponse{}
	res.Status = http.StatusOK
	res.Term = term
	dockerClient := DockerClient()
	searchTerm, _ := dockerClient.ImageSearch(context.Background(), term, types.ImageSearchOptions{
		Limit: 100,
	})
	res.Images = searchTerm
	json.NewEncoder(w).Encode(res)
}

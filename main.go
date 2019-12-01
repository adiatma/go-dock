package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/registry"
	"github.com/docker/docker/client"
)

// Response type
type Response struct {
	Status       int                     `json:"status"`
	Images       []types.ImageSummary    `json:"images"`
	Term         string                  `json:"term"`
	SearchResult []registry.SearchResult `json:"search_result"`
}

func main() {
	http.HandleFunc("/images", index)
	http.HandleFunc("/images/search", search)

	HOST := "0.0.0.0"
	PORT := "8080"

	fmt.Printf("Server running in http://%s:%s \n", HOST, PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%s", HOST, PORT), nil))
}

func dockerClient() (*client.Client, error) {
	dockerClient, err := client.NewEnvClient()
	return dockerClient, err
}

func index(w http.ResponseWriter, r *http.Request) {
	res := Response{}
	res.Status = http.StatusOK
	dockerClient, _ := dockerClient()
	images, _ := dockerClient.ImageList(context.Background(), types.ImageListOptions{})
	res.Images = images
	json.NewEncoder(w).Encode(res)
}

func search(w http.ResponseWriter, r *http.Request) {
	term := r.URL.Query().Get("term")
	res := Response{}
	res.Status = http.StatusOK
	res.Term = term
	dockerClient, _ := dockerClient()
	searchTerm, _ := dockerClient.ImageSearch(context.Background(), term, types.ImageSearchOptions{
		Limit: 100,
	})
	res.SearchResult = searchTerm
	json.NewEncoder(w).Encode(res)
}

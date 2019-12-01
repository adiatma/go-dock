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
	Images       []types.ImageSummary    `json:"results"`
	Term         string                  `json:"term"`
	SearchResult []registry.SearchResult `json:"search_result"`
}

func main() {
	http.HandleFunc("/", index)
	http.HandleFunc("/search", search)

	HOST := "0.0.0.0"
	PORT := "8080"

	fmt.Printf("Server runing in http://%s:%s \n", HOST, PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%s", HOST, PORT), nil))
}

func index(w http.ResponseWriter, r *http.Request) {
	res := Response{}
	res.Status = http.StatusOK
	cli, _ := client.NewEnvClient()
	images, _ := cli.ImageList(context.Background(), types.ImageListOptions{})
	res.Images = images
	json.NewEncoder(w).Encode(res)
}

func search(w http.ResponseWriter, r *http.Request) {
	term := r.URL.Query().Get("term")
	res := Response{}
	res.Status = http.StatusOK
	res.Term = term
	cli, _ := client.NewEnvClient()
	searchTerm, _ := cli.ImageSearch(context.Background(), term, types.ImageSearchOptions{
		Limit: 100,
	})
	res.SearchResult = searchTerm
	json.NewEncoder(w).Encode(res)
}

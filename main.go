package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/registry"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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

// DiskUsageResponse type
type DiskUsageResponse struct {
	Status    int         `json:"status"`
	DiskUsage interface{} `json:"disk_usage"`
}

// InfoResponse type
type InfoResponse struct {
	Status       int         `json:"status"`
	InfoResponse interface{} `json:"info"`
}

// ContainerRemoveResponse type
type ContainerRemoveResponse struct {
	Status   int         `json:"status"`
	Messages interface{} `json:"messages"`
}

func main() {
	router := gin.Default()

	router.LoadHTMLGlob("client/build/*.html")
	router.Static("/static", "./client/build/static")
	router.GET("/", Serve)

	router.GET("/api/images", Images)
	router.GET("/api/images/search", ImagesSearch)
	router.GET("/api/disk-usage", DiskUsage)
	router.GET("/api/info", Info)
	router.DELETE("/api/container/remove/:containerID", ContainerRemove)
	router.DELETE("/api/images/remove/:imageID", RemoveImage)

	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	HOST := os.Getenv("HOST")
	PORT := os.Getenv("PORT")

	router.Run(fmt.Sprintf("%s:%s", HOST, PORT))
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
func Serve(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "index.html", gin.H{})
}

// Images handler to show all images
func Images(ctx *gin.Context) {
	res := ImagesResponse{}
	res.Status = http.StatusOK
	dockerClient := DockerClient()
	imageList, _ := dockerClient.ImageList(context.Background(), types.ImageListOptions{})
	res.Images = imageList
	ctx.JSON(http.StatusOK, res)
}

// ImagesSearch to list all images by term of serach
func ImagesSearch(ctx *gin.Context) {
	term := ctx.Query("term")
	res := ImagesSearchResponse{}
	res.Status = http.StatusOK
	res.Term = term
	dockerClient := DockerClient()
	imageSearch, _ := dockerClient.ImageSearch(context.Background(), term, types.ImageSearchOptions{
		Limit: 100,
	})
	res.Images = imageSearch
	ctx.JSON(http.StatusOK, res)
}

// RemoveImage handler
func RemoveImage(ctx *gin.Context) {
	imageID := ctx.Param("imageID")
	dockerClient := DockerClient()
	message, _ := dockerClient.ImageRemove(context.Background(), imageID, types.ImageRemoveOptions{})
	ctx.JSON(http.StatusAccepted, message)
}

// DiskUsage handler
func DiskUsage(ctx *gin.Context) {
	res := DiskUsageResponse{}
	res.Status = http.StatusOK
	dockerClient := DockerClient()
	diskUsage, _ := dockerClient.DiskUsage(context.Background())
	res.DiskUsage = diskUsage
	ctx.JSON(http.StatusOK, res)
}

// Info handler
func Info(ctx *gin.Context) {
	res := InfoResponse{}
	res.Status = http.StatusOK
	dockerClient := DockerClient()
	info, _ := dockerClient.Info(context.Background())
	res.InfoResponse = info
	ctx.JSON(http.StatusOK, res)
}

// ContainerRemove handler
func ContainerRemove(ctx *gin.Context) {
	res := ContainerRemoveResponse{}
	res.Status = http.StatusAccepted
	containerID := ctx.Param("containerID")
	ctx.JSON(http.StatusAccepted, res)
	dockerClient := DockerClient()
	messages := dockerClient.ContainerRemove(context.Background(), containerID, types.ContainerRemoveOptions{})
	res.Messages = messages
}

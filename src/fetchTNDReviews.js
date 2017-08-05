const axios = require('axios')
const scrapeIt = require('scrape-it')
const { map, filter, property } = require('lodash/fp')

const tndVidoListParams = {
  key: 'AIzaSyCmwLP9M6bIcYrXjiKRD6BET-Ixg8T0c5U',
  channelId: 'UCt7fwAhXDy3oNFTAzF2o8Pw',
  part: 'snippet',
  order: 'date',
  maxResults: '20'
}
const youtubeVideoUrl = videoId => (`https://youtube.com/watch?v=${videoId}`)

const youtubeChannelUrl = ({ key, channelId, part, order, maxResults }) => (`https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channelId}&part=${part},id&order=${order}&maxResults=${maxResults}`)

const tndChannel = youtubeChannelUrl(tndVidoListParams)

const getVideoData = ({ id, snippet }) => (
  { videoId: id.videoId,
    publishedAt: snippet.publishedAt,
    title: snippet.title,
    thumbnailUrl: snippet.thumbnails.high.url }
)

const fetchAlbumRating = videoId => (
  scrapeIt(youtubeVideoUrl(videoId), {
    description: '#eow-description'
  })
  .then(property('description'))
  .then(desc => (+desc[desc.lastIndexOf('/10') - 1]))
)

const addRating = async (video) => {
  const rating = await fetchAlbumRating(video.videoId)
  // console.log('rating', rating)
  return Object.assign({}, video, { rating })
}

module.exports = () => (
  axios(tndChannel)
    .then(property('data.items'))
    .then(map(getVideoData))
    .then(filter(v => /ALBUM\sREVIEW/.test(v.title)))
    .then(videos => Promise.all(videos.map(addRating)))
  )

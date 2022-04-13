import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, Box, Typography, Link } from '@mui/material'
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles'
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineOppositeContent,
} from '@mui/lab'

export default function Stories() {
  const [topStories, setTopStories] = useState([])
  const [visible, setVisible] = useState(5)

  //responsive font sizes
  let theme = createTheme()
  theme = responsiveFontSizes(theme)

  //get top stories (processed in backend/server.js)
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/topstories')
      .then((response) => {
        setTopStories(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  //processing unix time to readable format
  const unixDate = (date) => {
    return new Date(date * 1000).toLocaleString()
  }

  //stories counter - 5 days
  const countLastFiveDaysStories = () => {
    let lastDaysStories = 0
    topStories.forEach((story) => {
      if (
        new Date().getTime() - new Date(story.time * 1000).getTime() <
        432000000
      ) {
        lastDaysStories++
      }
    })
    return lastDaysStories
  }

  //stories counter - 24 hours
  const countLastDayStories = () => {
    let lastDaysStories = 0
    topStories.forEach((story) => {
      if (
        new Date().getTime() - new Date(story.time * 1000).getTime() <
        86400000
      ) {
        lastDaysStories++
      }
    })
    return lastDaysStories
  }

  return topStories.length == 0 ? (
    <Box>Loading...</Box>
  ) : (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          // maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            marginTop: 4,
            marginBottom: 2,
            textAlign: 'center',
            textShadow: '-2px 2px 6px #1cb70b',
          }}
          variant="h3"
        >
          Hacker News - Top Stories
        </Typography>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: 4,
            borderColor: '#1876D1',
          }}
        >
          <Typography>
            <b>{countLastFiveDaysStories()}</b> stories last 5 days
          </Typography>
          <Typography>
            <b>{countLastDayStories()}</b> stories last 24 hours
          </Typography>
        </Box>
        {topStories.slice(0, visible).map((i) => {
          return (
            <Box key={i.id} sx={{ maxWidth: '600px' }}>
              <Timeline sx={{ margin: 0 }}>
                <TimelineItem sx={{ maxWidth: '600px' }}>
                  <TimelineContent sx={{ textAlign: 'right', paddingLeft: 0 }}>
                    {unixDate(i.time)}
                  </TimelineContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineOppositeContent
                    color="text.secondary"
                    sx={{ textAlign: 'left', textDecoration: 'none' }}
                  >
                    <Link href={i.url}>
                      <Typography
                        sx={{
                          // textDecoration: 'none',
                          color: '#20C20E',
                          '&:hover': {
                            color: '#1876D1',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {i.title}
                      </Typography>
                    </Link>
                  </TimelineOppositeContent>
                </TimelineItem>
              </Timeline>
            </Box>
          )
        })}
        <Box sx={{ display: 'flex' }}>
          <Button
            sx={{ marginTop: 4 }}
            onClick={() => {
              setVisible(visible + 10)
            }}
            variant="outlined"
          >
            Show More
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

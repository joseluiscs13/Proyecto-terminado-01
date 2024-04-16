import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";
import reactLogo from '../../assets/react.svg';
import './AudioPlayer.css';
import { tracks } from "../../data/tracks";
import { colors } from "../../helpers";
import { useClasification } from "../../hooks/useClasification";
import { SentimentSatisfiedAlt, 
  SentimentVeryDissatisfied, SentimentVerySatisfied } from "@mui/icons-material";
import { Button } from '@mui/material';
import { useState } from "react";
import { useEmotion } from "../../hooks/useEmotion";
import { useMDStore } from "../../hooks";

export const AudioPlayer = () => {
  const [emotion, setEmotion] = useState('');
  const { getHappy, getSad, getExcited } = useEmotion();
  const { events } = useMDStore();
  const [cancion, setCancion] = useState([
    {
        name: "Queen-We-Are-The-Champions.mp3",
        url: "http://localhost:4000/events/Queen-We-Are-The-Champions.mp3",
        title: "Queen - We Are The Champions",
        tags: ["excited"]
    },
    {
        name: "OneRepublic-Counting-Stars.mp3",
        url: "http://localhost:4000/events/OneRepublic-Counting-Stars.mp3",
        title: "OneRepublic - Counting Stars",
        tags: ["happy"]
    },
    {
        name: "John-Newman-Love-Me-Again.mp3",
        url: "http://localhost:4000/events/John-Newman-Love-Me-Again.mp3",
        title: "John Newman - Love Me Again",
        tags: ["happy"]
    },
    {
        name: "Take-Over.mp3",
        url: "http://localhost:4000/events/Take-Over.mp3",
        title: "Lyn - Take Over",
        tags: ["happy"]
    },
    {
        name: "Anna-Yvette-Shooting-Star.mp3",
        url: "http://localhost:4000/events/Anna-Yvette-Shooting-Star.mp3",
        title: "Anna Yvette - Shooting Star",
        tags: ["happy"]
    },
    {
        name: "Last-Surprise.mp3",
        url: "http://localhost:4000/events/Last-Surprise.mp3",
        title: "Lyn - Last Surprise",
        tags: ["happy"]
    },
    {
        name: "'The Crossing'-Ben-Ottewell.mp3",
        url: "http://localhost:4000/events/'The Crossing'-Ben-Ottewell.mp3",
        title: "Ben Ottewell - 'The Crossing'",
        tags: ["sad"]
    },
    {
        name: "Aerosmith-I-Don't-Wanna-Miss-a-Thing,mp3",
        url: "http://localhost:4000/events/Aerosmith-I-Don't-Wanna-Miss-a-Thing.mp3",
        title: "Aerosmith - I Don't Wanna Miss a Thing",
        tags: ["sad"]
    },
    {
        name: "Wiz-Khalifa-See-You-Again.mp3",
        url: "http://localhost:4000/events/Wiz-Khalifa-See-You-Again.mp3",
        title: "Wiz Khalifa - See You Again",
        tags: ["sad"]
    },
    {
      url: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
      title: "Madza - Chords of Life",
      name: "Chords of Life",
      tags: ["excited"],
    }
  ])
  
  // const model = useClasification();

  // console.log(model);

  const getTracks = () => {
    if(events.url !== undefined) {
      console.log('Cargo eventos');
      return events;
    }

    console.log('Cargo tracks');
    return tracks;
  }

  const clickHappy = () => {
    setEmotion(getHappy);
  }

  const clickSad = () => {
    setEmotion(getSad);
  }

  const clickExcited = () => {
    setEmotion(getExcited);
  }

  const clickRoot = () => {
    setEmotion('');
  }

  const listTracks = getTracks();

  return (
    <>
      <div id='rootAudioPlayer' onClick={clickRoot}>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>

        <h1>Music Detect</h1>
      </div>
      <div className="icons">
        <Button
          variant="outlined"
          onClick={clickHappy}
          style={{padding: 0, borderColor: 'transparent'}}
        >
          <SentimentSatisfiedAlt 
              color="action"
              fontSize="large"
              style={{color: "white"}}
            />
        </Button>
        <Button
          variant="outlined"
          onClick={clickSad}
          style={{padding: 0, borderColor: 'transparent'}}
        >
          <SentimentVeryDissatisfied
              color="action"
              fontSize="large"
              style={{color: "white"}}
            />
        </Button>
        <Button
          variant="outlined"
          onClick={clickExcited}
          style={{padding: 0, borderColor: 'transparent'}}
        >
          <SentimentVerySatisfied
              color="action"
              fontSize="large"
              style={{color: "white"}}
            />
        </Button>
      </div>
      <div className="card">
        {
          emotion !== ''
          ? (
              <Player 
                trackList={emotion}
                includeTags={false}
                customColorScheme={colors}
              />
          )
          :
          (
            <Player 
              trackList={cancion}
              includeTags={false}
              customColorScheme={colors}
            />
          )
        }
      </div>
    </>
  )
}

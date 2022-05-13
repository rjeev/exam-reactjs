import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const Player = ({file}) =>{

    return (

        <AudioPlayer
        autoPlay={false}
        loop={false}
        autoPlayAfterSrcChange={false}	
        showSkipControls={false}
        showDownloadProgress={false}
        showJumpControls	={false}
        showFilledProgress={false}
        showFilledVolume={false}
        src={file}
      />
    )
}
export default Player;


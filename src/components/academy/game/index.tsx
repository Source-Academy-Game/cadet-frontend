import * as React from 'react';

export class Game extends React.Component {

  public render() {
    // Consider making this an environment variable
    const GAME_LOCATION = "https://source-academy-game.github.io/prototype-sandbox/prototype/Source Academy/";
    return (
      <div style={{backgroundColor: "black", width: "100%", height: "100%"}}>
        <iframe src={GAME_LOCATION} width="100%" height="100%"/>
      </div>
    );
  }

}

export default Game;

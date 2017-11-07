import React from 'react';
import styles from './index.styles.scss'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {

    return (
      <div className="page">
        <style dangerouslySetInnerHTML={ {__html: styles} }></style>
        <div className="page__wrapper">
          <h1>Fast Sass Example</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad at autem cupiditate dignissimos dolorem
            dolores dolorum est et, exercitationem facilis fuga harum illum minima odio quae quis reiciendis soluta
            totam.</p>
        </div>
      </div>
    );
  }
}


export default Home;

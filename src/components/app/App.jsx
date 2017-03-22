import React from 'react';

export default class App extends React.Component {

  render() {
    return (
      <div className="l-app">
        <main role="main" className="l-main">
          {this.props.main}
        </main>
        {this.props.footer}
      </div>
    );
  }
}

App.propTypes = {
  main: React.PropTypes.element,
  footer: React.PropTypes.element
};

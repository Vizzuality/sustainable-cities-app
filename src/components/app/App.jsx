import React from 'react';

export default class App extends React.Component {

  render() {
    return (
      <div>
        {this.props.header}
        <main role="main" className="l-main">
          <div className="main-content l-app-wrapper">
            {this.props.main}
          </div>
        </main>
        {this.props.footer}
      </div>
    );
  }
}

App.propTypes = {
  main: React.PropTypes.element,
  footer: React.PropTypes.element,
  header: React.PropTypes.element
};

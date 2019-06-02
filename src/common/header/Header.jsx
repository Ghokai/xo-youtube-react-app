import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './Header.scss';
import Logo from '../../../public/logo.svg';
import SlideFilters from '../slide-filters/SlideFilters';
//import { constants } from 'fs';

class Header extends Component {
  state = {
    drawerIsOpened: false,
    title: '',
    showSettings: true
  };

  constructor(props) {
    super(props);
    setTimeout(() => {
      this.setState({ title: this.props.setTitle() });
    }, 100);
  }

  componentDidUpdate() {
    if (
      !this.props.location.pathname.endsWith('/youtube') &&
      this.state.showSettings
    ) {
      this.setState({ showSettings: false });
    } else if (
      this.props.location.pathname.endsWith('/youtube') &&
      !this.state.showSettings
    ) {
      this.setState({ showSettings: true });
    }
  }

  toggleDrawer = open => () => {
    this.setState({
      drawerIsOpened: open
    });
  };

  render() {
    const filterButton = (
      <Button className="menu-toggle" onClick={this.toggleDrawer(true)}>
        <SettingsIcon aria-label="Settings" />
      </Button>
    );

    return (
      <div id="page-header">
        <nav>
          <div className="logo-bg">
            <Logo className="logo" />
          </div>
          <div className="opened-module-title">{this.state.title}</div>
          {this.state.showSettings && filterButton}
        </nav>
        <Drawer
          anchor="right"
          open={this.state.drawerIsOpened}
          onClose={this.toggleDrawer(false)}
        >
          <SlideFilters
            config={this.props.config}
            onChanges={this.props.onChanges}
            onClose={this.toggleDrawer(false)}
          />
        </Drawer>
      </div>
    );
  }
}

Header.propTypes = {
  setTitle: PropTypes.func,
  config: PropTypes.object,
  onChanges: PropTypes.func,
  location: PropTypes.object
};

export default withRouter(Header);

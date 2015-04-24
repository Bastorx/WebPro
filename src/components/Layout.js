import React from 'react';
import {AppCanvas, AppBar} from './UIKit';
import AppLeftNav from './layout/AppLeftNav';

if (process.env.BROWSER) {
    require("../style/Layout.scss");
}

export default class Layout extends React.Component {

    render() {
        const { children } = this.props;

        return (
            <AppCanvas>
                <AppBar
                    className="mui-dark-theme"
                    title="Backoffice"
                    onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap.bind(this)}
                    zDepth={0} />

                <AppLeftNav ref="leftNav" />

                {children}
            </AppCanvas>
        );
    }

    _onMenuIconButtonTouchTap() {
        this.refs.leftNav.toggle();
    }
}
'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { Image, FlatButton, RaisedButton } from '../components/UIKit';
import { connectToStores } from 'fluxible-addons-react';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';

class Picture extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        return (
            <div style={{ margin: '10px', padding: '10px', border: '1px solid #eee' }}>
                <Image image={this.props.picture} options={{
                    width: 100,
                    height: 100,
                    crop: 'thumb'
                }} />
                <div style={{width: '10px', display: 'inline-block', marginLeft: '10px', position: 'absolute'}}>
                    <RaisedButton label="UP" backgroundColor='tomato' onClick={this.up}/>
                    <RaisedButton label="DOWN" backgroundColor='dodgerblue' style={{marginTop: '5px'}} onClick={this.down}/>
                </div>
                <FlatButton label="Supprimer" onClick={this.remove} />
            </div>
        );
    }
    remove = () => {
        const { business, picture } = this.props;
        this.context.executeAction(BusinessActions.removePicture, {
            businessId: business.id,
            pictureId: picture.id
        });
    }
    up = () => {
        const { business, picture } = this.props;
        var pictures = business.pictures;
        const index = _.findIndex(pictures, {id: picture.id});
        if (index <= 0)
            return;
        pictures = _.compact(_.reject(business.pictures, { id: picture.id }));
        pictures.splice((index - 1), 0, picture);
        console.log(pictures); debugger;

        //this.context.executeAction(BusinessActions.orderPictures, {
        //    businessId: business.id,
        //    pictureId: pictures
        //});
    }
    down = () => {
        const { business, picture } = this.props;
        const pictures = business.pictures;
        const index = _.findIndex(pictures, {id: picture.id});
        if (index >= pictures.length)
            return;
        const s = pictures[index + 1];
        pictures[index + 1] = picture;
        pictures[index] = s;
        this.context.executeAction(BusinessActions.orderPictures, {
            businessId: business.id,
            pictureId: pictures
        });
    }
}

class Uploading extends React.Component {
    render() {
        return (
            <p>Upload en cours...</p>
        );
    }
}

class BusinessPicturesPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        const { business, business: { pictures }, uploadIds } = this.props;

        return (
            <Layout ref="layout" {...this.props}>
                <h1>Photos</h1>
                {_.map(pictures, picture => <Picture key={picture.id} {...{business, picture}} />)}
                {_.map(uploadIds, id => <Uploading key={id} />)}
                <FlatButton label="Ajouter une photo" onClick={this.addPicture} />
                <input ref="file" type="file" style={{ display: 'none' }} accept="image/jpeg" multiple={true} onChange={this.upload} />
            </Layout>
        );
    }
    addPicture = (e) => {
        e.preventDefault();
        React.findDOMNode(this.refs.file).click();
    }
    upload = (e) => {
        e.preventDefault();
        const { business } = this.props;
        Array.prototype.map.call(e.target.files, file => {
            this.context.executeAction(BusinessActions.addPicture, { businessId: business.id, file })
        });
    }
}

BusinessPicturesPage = connectToStores(BusinessPicturesPage, [
    'BusinessStore'
], (context, props) => ({
    business : context.getStore('BusinessStore').getById(props.businessId),
    uploadIds: context.getStore('BusinessStore').getPictureUploadIds(props.businessId)
}));

export default BusinessPicturesPage;

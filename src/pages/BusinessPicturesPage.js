'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { Image, FlatButton } from '../components/UIKit';
import { connectToStores } from 'fluxible/addons';
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
                <FlatButton label="Supprimer" onClick={this.remove} />
            </div>
        );
    }
    remove = () => {
        const { business, picture } = this.props;
        this.context.executeAction(BusinessActions.removePicture, { business, picture });
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
    componentDidMount() {
        this.resetFileInput();
    }
    resetFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.accept = 'image/jpeg';

        if (this.fileInput) {
            this.fileInput = this.fileInput.parentNode.replaceChild(fileInput, this.fileInput);
        } else {
            this.fileInput = React.findDOMNode(this.refs.layout).appendChild(fileInput);
        }

        this.fileInput.addEventListener('change', this.upload);
    }
    componentWillUnmount() {
        if (this.fileInput) {
            this.fileInput.parentNode.removeChild(this.fileInput);
            this.fileInput = null;
        }
    }
    render() {
        const { business, business: { pictures }, uploadIds } = this.props;

        return (
            <Layout ref="layout">
                <h1>Photos</h1>
                {_.map(pictures, picture => <Picture key={picture.id} {...{business, picture}} />)}
                {_.map(uploadIds, id => <Uploading key={id} />)}
                <FlatButton label="Ajouter une photo" onClick={this.addPicture} />
            </Layout>
        );
    }
    addPicture = (e) => {
        e.preventDefault();
        if (this.fileInput) {
            this.fileInput.click();
        }
    }
    upload = (e) => {
        console.log(e);
        e.preventDefault();
        const { business } = this.props;
        Array.prototype.map.call(e.target.files, file => this.context.executeAction(BusinessActions.addPicture, { business, file }));
        this.resetFileInput();
    }
}

BusinessPicturesPage = connectToStores(BusinessPicturesPage, [
    'BusinessStore'
], (stores, props) => ({
    business : stores.BusinessStore.getById(props.businessId),
    uploadIds: stores.BusinessStore.getPictureUploadIds(props.businessId)
}));

export default BusinessPicturesPage;

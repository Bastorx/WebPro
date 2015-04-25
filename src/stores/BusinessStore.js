'use strict';

import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';
import _ from 'lodash';

export default class BusinessStore extends BaseStore {

    static storeName = 'BusinessStore';

    static handlers = {
        [Actions.RECEIVE_BUSINESS]: 'onReceiveBusiness',
        [Actions.RECEIVE_USER_BUSINESSES]: 'onReceiveUserBusinesses'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.businesses = {};
    }

    dehydrate() {
        return {
            businesses: this.businesses
        }
    }

    rehydrate({ businesses }) {
        this.businesses = businesses;
    }

    onReceiveBusiness(business) {
        this.businesses[business.id] = business;
        this.emitChange();
    }

    onReceiveUserBusinesses({ businesses }) {
        this.businesses = _.merge({}, this.businesses, _.indexBy(businesses, 'id'));
        this.emitChange();
    }

    getById(id) {
        return this.businesses[id];
    }

    getByIds(ids) {
        return _.map(ids, this.getById, this);
    }

}

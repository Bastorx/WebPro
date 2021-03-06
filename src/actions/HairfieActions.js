'use strict';

import Actions from '../constants/Actions';
import RouteActions from './RouteActions';

const HairfieActions = {
    loadBusinessHairfies (context, {page, pageSize, businessId, add}) {
        const query = {
            'filter[where][businessId]': businessId,
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (page - 1) * pageSize,
            'filter[limit]': pageSize + (add || 0)
        };

        return  context.hairfieApi
            .get('/hairfies', { query })
            .then(hairfies => context.dispatch(Actions.RECEIVE_BUSINESS_HAIRFIE, {
                    hairfies: hairfies,
                    businessId : businessId,
                    page: page
                })
            );
    },

    loadHairfie(context, id) {
        return context.hairfieApi
            .get('/hairfies/' + id)
            .then(hairfie => context.dispatch(Actions.RECEIVE_HAIRFIE, hairfie));
    },

    deleteHairfie(context, { id, businessId }) {
        const token = context.getStore('AuthStore').getToken();
        const user = context.getStore('UserStore').getById(token.userId);

        return context.hairfieApi
            .delete('/hairfies/' + id, { token, user })
            .then(() => {
                return context.executeAction(RouteActions.navigate, {
                         route: 'business_hairfies',
                         params: { businessId: businessId }
                    })
                .then(context.dispatch(Actions.DELETE_HAIRFIE, { id, businessId }));
            });
    },

    updateHairfie(context, { id, hairfie, businessId }) {
        const token = context.getStore('AuthStore').getToken();
        const user = context.getStore('UserStore').getById(token.userId);

        return context.hairfieApi
            .put('/hairfies/' + id, { hairfie }, { token, user })
            .then((hairfie) => {
                context.dispatch(Actions.RECEIVE_HAIRFIE, hairfie);
                return context.executeAction(RouteActions.navigate, {
                     route: 'business_hairfies',
                     params: { businessId: businessId }
                });
            });
    },

    createHairfie(context, { hairfie, businessId }) {
        const token = context.getStore('AuthStore').getToken();
        const user = context.getStore('UserStore').getById(token.userId);

        return context.hairfieApi
            .post('/hairfies', _.assign({ businessId }, hairfie), { token, user })
            .then((hairfie) => {
                context.dispatch(Actions.RECEIVE_HAIRFIE, hairfie);
                return context.executeAction(RouteActions.navigate, {
                     route: 'business_hairfies',
                     params: { businessId: businessId }
                });
            });
    }
}


export default HairfieActions;
import PageActions from './actions/PageActions';

export default {
    home: {
        path: '/',
        method: 'get'
    },
    login: {
        path: '/login',
        method: 'get',
        action: PageActions.login
    },
    logout: {
        path: '/logout',
        method: 'get',
        action: PageActions.logout
    },
    impersonate_token: {
        path: '/impersonate-token',
        method: 'get',
        action: PageActions.impersonateToken
    },
    repersonate_token: {
        path: '/repersonate_token',
        method: 'get',
        action: PageActions.repersonateToken
    },
    dashboard: {
        path: '/dashboard',
        method: 'get',
        action: PageActions.dashboard
    },
    business: {
        path: '/businesses/:businessId',
        method: 'get',
        action: PageActions.business
    },
    business_pictures: {
        path: '/businesses/:businessId/pictures',
        method: 'get',
        action: PageActions.business
    },
    business_infos: {
        path: '/businesses/:businessId/infos',
        method: 'get',
        action: PageActions.business
    },
    business_map: {
        path: '/businesses/:businessId/map',
        method: 'get',
        action: PageActions.business
    },
    business_members: {
        path: '/businesses/:businessId/members',
        method: 'get',
        action: PageActions.businessMembers
    },
    new_business_member: {
        path: '/businesses/:businessId/members/new',
        method: 'get'
    },
    edit_business_member: {
        path: '/business-members/:businessMemberId',
        method: 'get',
        action: PageActions.businessMember
    }
};

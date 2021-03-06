'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import mui from 'material-ui';
import BusinessMemberActions from '../actions/BusinessMemberActions';
import Image from '../components/Image';

class Member extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        const { member: { id, firstName, lastName, hidden } } = this.props;

        const status = hidden ? "Admin" : "Coiffeur";

        return (
            <div style={{ margin: '10px', padding: '10px' }}>
                <div style={{ width: 50, height: 50, float: 'left', display: 'block', background: '#fafafa' }}>
                    {this.renderPicture()}
                </div>
                <Link route="edit_business_member" params={{ businessMemberId: id }}>
                    {firstName} {lastName}
                </Link>
                ({status})
                {this.renderActiveSwitch()}
                <div style={{ clear: 'both' }}>&nbsp;</div>
            </div>
        );
    }
    renderPicture() {
        if (this.props.member.picture) {
            return <Image
                image={this.props.member.picture}
                options={{ width: 50, height: 50, crop: 'thumb' }}
                />;
        }
    }
    renderActiveSwitch() {
        if (this.props.member.active) {
            return <mui.FlatButton label="Désactiver" onClick={this.deactivate} />;
        }

        return <mui.FlatButton label="Réactiver" onClick={this.reactivate} />;
    }
    deactivate = () => {
        this.context.executeAction(BusinessMemberActions.deactivate, {
            memberId: this.props.member.id
        });
    }
    reactivate = () => {
        this.context.executeAction(BusinessMemberActions.reactivate, {
            memberId: this.props.member.id
        });
    }
}

class BusinessMembersPage extends React.Component {
    render() {
        const { businessId, activeMembers, inactiveMembers } = this.props;

        return (
            <Layout {...this.props}>
                <h1>Membres de l'équipe</h1>
                <Link route="new_business_member" params={{ businessId }}>Ajouter une membre</Link>
                <mui.Tabs>
                    <mui.Tab label={`Membres actifs (${activeMembers.length})`}>
                        {_.map(activeMembers, member => <Member key={member.id} {...{ member }} />)}
                    </mui.Tab>
                    <mui.Tab label={`Membres désactivés (${inactiveMembers.length})`}>
                        {_.map(inactiveMembers, member => <Member key={member.id} {...{ member }} />)}
                    </mui.Tab>
                </mui.Tabs>
            </Layout>
        );
    }
}

BusinessMembersPage = connectToStores(BusinessMembersPage, [
    'BusinessMemberStore'
], (context, props) => ({
    activeMembers: context.getStore('BusinessMemberStore').getAllActiveByBusinessId(props.businessId),
    inactiveMembers: context.getStore('BusinessMemberStore').getAllInactiveByBusinessId(props.businessId)
}));

export default BusinessMembersPage;

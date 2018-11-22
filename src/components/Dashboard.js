import React from 'react';
import DashboardItem from '../components/DashboardItem';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

import Header from '../components/Header';

import { getDecks, postDecks, putDecks, deleteDecks } from '../requests/decks';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.addDeck = this.addDeck.bind(this);
        this.deleteDeck = this.deleteDeck.bind(this);
        this.renameDeck = this.renameDeck.bind(this);

        this.state = {
            decks: []
        };
    
    }
    componentDidMount() {

        getDecks(this.props.auth.id, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);

            this.setState({
                decks: message
            });
        })
        .catch(error => console.error({error}));
    }

    addDeck() {
        const deckName = prompt('Enter name of new deck: ');
        const id = uuid();

        if (deckName) {
            postDecks(deckName, this.props.auth.id, id, this.props.auth.token)
            .then(({ status, message }) => {

                if (status === 'error') return console.log('error', message.status);

                this.setState(prev => {
                    return {
                        decks: [
                            ...prev.decks,
                            {
                                name: deckName,
                                owner: this.props.auth.id,
                                id
                            }
                        ]
                    };
                });
            })
            .catch(error => console.log({error}));
        }
    }
    renameDeck(id, name) {

        putDecks(name, id, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);

            this.setState(prev => {
                return {
                    decks: prev.decks.map(item => {
                        if (item.id === id) {
                            return {
                                ...item,
                                name
                            };
                        }
                        return item;
                    })
                };
            });
        })
        .catch(error => console.log({error}));
    }
    deleteDeck(id) {
        console.log('dashboard delete', id);

        deleteDecks(id, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);

            this.setState(prev => {
                return {
                    decks: prev.decks.filter(item => item.id !== id)
                };
            });
        })
        .catch(error => console.log({error}));
    }
    render() {
        return (
            <div>
                <Header subheading='Dashboard' auth={this.props.auth.auth} dispatch={this.props.dispatch} />

                <button className='btn dashboard-add' onClick={this.addDeck}>Add Deck</button>


                <ul className="dashboard-container">
                {
                    this.state.decks.map((deck, index) => {
                        return (
                            <DashboardItem 
                                key={index} 
                                name={deck.name} 
                                id={deck.id}
                                renameDeck={this.renameDeck}
                                deleteDeck={this.deleteDeck}
                            />                
                        );
                    })
                }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps)(Dashboard);
import React from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { withRouter } from 'react-router-dom';
import EditCard from './EditCard';

import { getCard, postCard, putCard, deleteCard } from '../requests/cards';


class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.addCard = this.addCard.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.editCard = this.editCard.bind(this);

        this.state = {
            undefined: false,
            cards: []
        };
    }
    
    componentDidMount() {

        getCard(this.props.id, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);

            console.log('get cards', message)

            this.setState({
                cards: message
            });
        })
        .catch(error => {
            // console.log({error});
            this.setState({
                undefined: true
            });
        });

    }
    addCard() {
        const front = prompt('Enter card front text: ');
        if (!front) return;
        const back = prompt('Enter card back text: ');
        if (!back) return;
    
        // const id = uuid();
        const deck = this.props.id;

        postCard(deck, front, back, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);

            console.log('add card', message)

            this.setState(prev => {
                return {
                    cards: [
                        ...prev.cards,
                        { ...message }
                    ]
                }
            });
        })
        .catch(error => console.log({error}));

    }
    editCard(_id, front, back) {
        const newFront = prompt('Enter value for front: ', front);
        if (!newFront) return false;

        const newBack = prompt('Enter value for back: ', back);
        if (!newBack) return false;

        console.log(_id, front, back)

        if (newFront !== front || newBack !== back) {

            putCard(_id, newFront, newBack, this.props.auth.token)
            .then(({ status, message }) => {

                if (status === 'error') return console.log('error', message.status);
                
                console.log('edit card', message)

                this.setState(prev => {
                    return {
                        cards: prev.cards.map(item => {
                            if (item._id === _id) {
                                return {
                                    ...item,
                                    front: newFront,
                                    back: newBack
                                };
                            }
                            return item;
                        })
                    };
                });
            })
            .catch(error => console.log({error}));
        }
    }

    deleteCard(_id) {
        deleteCard(_id, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);
            
            console.log('delete deck', message)

            this.setState(prev => {
                return {
                    cards: prev.cards.filter(item => item._id !== _id)
                }
            });
 
        })
        .catch(error => console.log({error}));
    }

    render() {
        if (this.state.undefined) {
            return (
                <div>
                    <h2>Deck undefined</h2>
                </div>
            );
        } 

        return (
            <div>
                <Header subheading='Edit' auth={this.props.auth.auth} dispatch={this.props.dispatch} />

                <div className='edit-container'>

                    {!!this.props.location.state ? 
                        <div>
                            <h2 className='edit-title'>{this.props.location.state.deck}</h2>
                            <button onClick={this.addCard} className='btn edit-add'>Add card</button>
                            <ul className='edit-list'>
                                {
                                    this.state.cards.map((item, index) => {
        
                                        return (
                                            <EditCard 
                                                key={item._id}
                                                front={item.front}
                                                back={item.back}
                                                _id={item._id}
                                                deleteCard={this.deleteCard}
                                                editCard={this.editCard}
                                            />
                                        );
                                    })
                    
                                }
                            </ul>
                        </div>
                    : 
                        <h1>Unknown deck</h1>
                    }
                    
                </div>
            </div>

        );
    }
}

const mapStateToProps = ({ auth }) => ({ auth });

export default withRouter(connect(mapStateToProps)(Edit));
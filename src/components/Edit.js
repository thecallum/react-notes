import React from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { withRouter } from 'react-router-dom';
import EditCard from './EditCard';

import { ModalAddCard, ModalDeleteCard, ModalEditCard } from '../components/Modal';


import { getCard, postCard, putCard, deleteCard } from '../requests/cards';


class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.addCard = this.addCard.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.editCard = this.editCard.bind(this);

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);

        this.state = {
            undefined: false,
            cards: [],
            modalAddCard: { isOpen: false, error: null },
            modalDeleteCard: { isOpen: false, error: null, _id: null },
            modalEditCard: { isOpen: false, error: null, _id: null }
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

    closeModal(el) {
        this.setState({ [el]: { isOpen: false } });
    }
    openModal(el, props = {}) {
        this.setState({ [el]: { isOpen: true , ...props} });
    }

    addCard(e) {

        e.preventDefault();

        const front = e.target.front.value;
        const back = e.target.back.value;

        if (!front || !back) return;
    
        const deckID = this.props.id;

        // console.log('add card deck', deckID)

        postCard(deckID, front, back, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);

            console.log('add card', message)

            this.setState(prev => ({
                cards: [ ...prev.cards, { ...message } ],
                modalAddCard: { ...prev.modalAddCard, isOpen: false }
            }));

        })
        .catch(error => console.log({error}));

    }
    editCard(e) {
        e.preventDefault();

        const newFront = e.target.front.value;
        const newBack = e.target.back.value;
        const _id = e.target._id.value;

        if (!newFront || !newBack) return;


        // if (newFront !== front || newBack !== back) {

            putCard(_id, newFront, newBack, this.props.auth.token)
            .then(({ status, message }) => {

                if (status === 'error') return console.log('error', message.status);
                
                console.log('edit card', message)

                this.setState(prev => ({
                    cards: prev.cards.map(item => item._id === _id ? { ...item, front: newFront, back: newBack } : item ),
                    modalEditCard: { ...prev.modalEditCard, isOpen: false }
                }));

            })
            .catch(error => console.log({error}));
        // }
    }

    deleteCard(e) {
        e.preventDefault();

        const _id = e.target._id.value;

        console.log('delete card', _id)

        deleteCard(_id, this.props.auth.token)
        .then(({ status, message }) => {

            if (status === 'error') return console.log('error', message.status);
            
            console.log('delete deck', message)

            this.setState(prev => {
                return {
                    cards: prev.cards.filter(item => item._id !== _id),
                    modalDeleteCard: { ...prev.modalDeleteCard, isOpen: false }
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
                            <button onClick={() => this.openModal('modalAddCard')} className='btn btn-medium edit-add'>Add card</button>
                            <ul className='edit-list'>
                                {
                                    this.state.cards.map((item, index) => {
        
                                        return (
                                            <EditCard 
                                                key={item._id}
                                                front={item.front}
                                                back={item.back}
                                                _id={item._id}
                                                openModal={this.openModal}
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

                <ModalAddCard 
                    isOpen={this.state.modalAddCard.isOpen}
                    submit={this.addCard}
                    close={this.closeModal}
                    error={this.state.modalAddCard.error}
                />

                <ModalDeleteCard
                    isOpen={this.state.modalDeleteCard.isOpen}
                    submit={this.deleteCard}
                    close={this.closeModal}
                    error={this.state.modalDeleteCard.error}
                    _id={this.state.modalDeleteCard._id}
                />

                <ModalEditCard 
                    isOpen={this.state.modalEditCard.isOpen}
                    submit={this.editCard}
                    close={this.closeModal}
                    error={this.state.modalEditCard.error}
                    _id={this.state.modalEditCard._id}
                    name={this.state.modalEditCard.name}
                    front={this.state.modalEditCard.front}
                    back={this.state.modalEditCard.back}
                />

            </div>

        );
    }
}

const mapStateToProps = ({ auth }) => ({ auth });

export default withRouter(connect(mapStateToProps)(Edit));
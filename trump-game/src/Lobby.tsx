import React from 'react';
import './Lobby.css';

const buttonImages = [
    [`${process.env.PUBLIC_URL}/lobbyImg/blackjack-icon.jpg`, "Black", "Jack", "BlackJack"],
    [`${process.env.PUBLIC_URL}/lobbyImg/blackjack-icon.jpg`, "Poker", "Poker", "Poker"],
    [`${process.env.PUBLIC_URL}/lobbyImg/blackjack-icon.jpg`, "Speed", "Speed", "Speed"],
    [`${process.env.PUBLIC_URL}/lobbyImg/blackjack-icon.jpg`, "War", "War", "War"],
    [`${process.env.PUBLIC_URL}/lobbyImg/blackjack-icon.jpg`, "Texas", "hold'em", "Texas hold'em"],
    [`${process.env.PUBLIC_URL}/lobbyImg/blackjack-icon.jpg`, "Rummy", "Rummy", "Rummy"]
];

const Lobby = () => {
    return (
        <div className="lobby">
            <h1 className="title">Playing Card</h1>
            <div className="button-container">
                {buttonImages.map((element, index) => (
                    <button key={index} className="button" onClick={() => console.log(element[3])}>
                        <p>{element[1]}</p>
                        <img src={element[0]} alt={`Button ${index + 1}`}/>
                        <p>{element[2]}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Lobby;
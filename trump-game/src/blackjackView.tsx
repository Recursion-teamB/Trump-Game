import React from 'react';
import './blackjackStyle.css';
import back from "./image/back.jpg"
//import {Card, Deck, Player} from './general'
import { BlackJackPlayer, BlackJackTable } from './blackjack';

export const StartBlackJackScreen = () => {
    const [blackjackTable, setBlackjackTable] = React.useState<BlackJackTable | null>(null);

    React.useEffect(() => {
        const player = new BlackJackPlayer("Player", "Human");
        const table = new BlackJackTable(player);
        setBlackjackTable(table);
    }, []);

    if (!blackjackTable) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bj-background px-3'>
            <div className='btn-place pt-3'>
                <button className='btn border-dark'>help</button>
                <button className='btn border-dark mx-4'>back home</button>
            </div>
            <div className='bj-table d-flex flex-column align-items-center justify-content-between pt-3 pb-5 px-5'>
                <div className='d-flex jutify-content-center'>
                    <h5>dealer</h5>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <img src={back} className="card-size"></img>
                </div>
                <div className='d-flex justify-content-between col-12'>
                    {blackjackTable.getPlayers().map(p => 
                        <div>
                            <p>Player: {p.getName()}</p>
                            <p>Coin: {p.getChips()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
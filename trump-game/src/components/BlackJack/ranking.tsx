import React from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { BlackJackPlayer } from '../../model/BlackJack/blackjack';

interface RankingProps {
    items: BlackJackPlayer[];
    onContinue: () => void;
    onEnd: () => void;
}

export const Ranking: React.FC<RankingProps> = ({ items, onContinue, onEnd }) => {
    return (
        <div
        style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            top: '15%',
            left: '25%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // background: '#301934',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '2px solid #000000',
            borderRadius: '10px',
            marginTop:'4rem',
        }}
        >
            <h1>Total Score Ranking</h1>
            <Row>
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.getName()}</td>
                                    <td>{item.getChips()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className='D-flex justify-content-center'>
                        <Button onClick={onContinue} variant="primary" className="mx-2">
                            Continue
                        </Button>
                        <Button onClick={onEnd} variant="secondary" className="mx-2">
                            End
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
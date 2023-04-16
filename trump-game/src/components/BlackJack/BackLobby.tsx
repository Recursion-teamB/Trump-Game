import React from 'react';
import { Button } from 'react-bootstrap';

interface BackLobbyProps {
    onBack: () => void;
    onRestart: () => void;
    onReset: () => void;
}

export const BackLobby: React.FC<BackLobbyProps> = ({onBack, onRestart, onReset}) => {
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '2px solid #000000',
            borderRadius: '10px',
            marginTop:'4rem',
        }}
        >
            <h1>ゲームを終了しますか？</h1>
            <div className='D-flex justify-content-center'>
                <Button className='m-1' variant="secondary" onClick={onBack}>Lobbyに戻る</Button>
                <Button className='m-1' variant='primary' onClick={onRestart}>Gameを続ける</Button>
                <Button className='m-1' variant='secondary' onClick={onReset}>最初からやり直す</Button>
            </div>
        </div>
    );
};
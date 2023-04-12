import React from 'react';
import '../../style/HelpButton.css'

interface HelpPopupProps {
    onClose: () => void;
}

export const HelpPopup: React.FC<HelpPopupProps> = ({
    onClose
}) => {
    return (
        <div
        style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            top: '25%',
            left: '25%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #000000',
            borderRadius: '10px',
            color: '#ffffff',
            overflowX: 'hidden',
            overflowY: 'scroll',
        }}
        >
            <h1 className='text'>Black Jack Help</h1>
            <h2 className='text'>ブラックジャックのルール</h2>
            <p className='text'>ゲームの目的は、手持ちのカードの合計点数が21に近い、または21に等しいようにすることです。</p>
            <p className='text'>ディーラーは、プレイヤーに2枚のカードを配ります。自分にも2枚のカードを配り、1枚は表向き、1枚は裏向きにします。</p>
            <p className='text'>プレイヤーは、自分の手札の合計点数が21に近づけるために、カードを引くことができます。ただし、手札の合計点数が21を超えると、バーストとなり、そのプレイヤーは負けになります。</p>
            <p className='text'>ディーラーは、自分の手札が17点以上になるまでカードを引きます。17点以上になったら、カードを引かないで止まります。</p>
            <p className='text'>カードの点数は、2から10まではそのままの数、絵札は10、エースは1または11として数えます。</p>
            <p className='text'>プレイヤーが最初の2枚のカードで21点を取った場合、これを「ブラックジャック」と呼び、プレイヤーは自動的に勝利します。</p>
            <p className='text'>ディーラーとプレイヤーが同点の場合は、引き分けになります。それ以外の場合は、カードの合計点数が高い方が勝利します。</p>
            <h2 className='text'>このゲームの操作</h2>
            <p className='text'>ベットするためのポップアップが表示されたら。掛け金を設定する。</p>
            <p className='text'>その後表示されるボタンをクリックしてアクションを選択してください。</p>
            <button className='button' onClick={onClose} id='closeButton'>Close</button>
        </div>
    );
};
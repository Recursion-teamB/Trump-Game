# Trump-Game

# 何を作ったのか
- Web上で複数のトランプを使ったゲームを開発した
 - BlackJack
 - War
 - Speed

# 使い方
- 以下URLから各ゲームのボタンをクリックした後Startボタンを押すとゲームを開始することができます

https://trump-game.vercel.app/

# 使用技術
- Frontend
  - TypeScript
  - Phaser
  - React
- Backend
  - Node.js
- Deploy
  - Vercel

# 工夫した点

- MVCアーキテクチャに沿ってModelとViewを分離するような実装を心がけた
- ゲームの背景はPhaserで実装したが、ポップアップ画面などUIについてはReactで実装した
- 複数のゲームで遊べるようにクラスやメソッドの再利用性を意識した

# 課題点

- Poker, TexasHoldem, Rummyは実装できなかった
- Mobile, Desktopに対応できなかった

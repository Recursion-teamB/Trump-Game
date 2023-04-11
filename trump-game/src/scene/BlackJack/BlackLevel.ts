export default class BlackLevelScene extends Phaser.Scene{
    private width : number = 0
    private height : number = 0
    private centerX : number = 0
    private centerY : number = 0
    private static count : number = 3;
    constructor() {
        // super(key:'menuScene')で渡す値はゲームの切り替えやスタートなどに使う
        // Phaser.Scene.start('menuScene')やPhaser.Scene.switch('menuScene')など
        super({ key: 'BlackLevelScene'});
    }
    public static getCount() : number{
        return this.count
    }

    public static setCount(newCount: number): void {
        this.count = newCount;
    }
    //preload()はリソースの読み込み処理
    //トランプの画像読み込みとかで使う
    preload() {
        //this.load.image();など
    }
    // 状態管理のためのオブジェクト
    create(){
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        // タイトルの表示
        const titleText = this.add.text(this.centerX, this.heightPosition(0.1), 'ブラックジャック', { fontSize: '32px', color: '#fff' });
        titleText.setOrigin(0.5, 0.5);

        // レベル選択用のテキスト
        const selectedLevelText = this.add.text(this.widthPosition(0.2), this.heightPosition(0.3), '', { fontSize: '20px', color: '#fff' });
        selectedLevelText.setOrigin(0.5, 0.5);
        updateSelectedLevel('normal')
        const levels = ['easy', 'normal', 'hard'];
        const levelButtons = levels.map((level, index) => {
            const button = this.add.text(this.widthPosition(0.1) + (index * this.widthPosition(0.13)), this.heightPosition(0.4), level.toUpperCase(), { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
            button.setOrigin(0.5, 0.5);
            button.setInteractive();

            button.on('pointerdown', () => {
                console.log(`Selected level: ${level}`);
                updateSelectedLevel(level); // 選択したレベルを更新
            });

            return button;
        });

        // 敵の数選択用のテキスト
        const selectedEnemyCountText = this.add.text(this.widthPosition(0.2), this.heightPosition(0.5), '', { fontSize: '20px', color: '#fff' });
        selectedEnemyCountText.setOrigin(0.5, 0.5);
        updateSelectedEnemyCount(3)

        // 敵の数選択用のボタン
        const enemyButtons = Array.from({ length: 6 }, (_, index) => {
            const button = this.add.text(this.widthPosition(0.1) + (index * this.widthPosition(0.05)), this.heightPosition(0.6), (index + 1).toString(), { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
            button.setOrigin(0.5, 0.5);
            button.setInteractive();

            button.on('pointerdown', () => {
                console.log(`Selected enemy count: ${index + 1}`);
                updateSelectedEnemyCount(index + 1); // 選択した敵の数を更新
                BlackLevelScene.setCount(index + 1)
            });

            return button;
        });


        const ruleFrameX : number = this.widthPosition(0.45)
        const ruleFrameY = this.heightPosition(0.22)
        const ruleWidth = this.widthPosition(0.47)
        const ruleHight = this.heightPosition(0.55)
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRect(ruleFrameX, ruleFrameY, ruleWidth, ruleHight);

        const blackjackRuleText = `
            ブラックジャックでは、カードの合計値が21と
            なるような手札を持つこと、またはその制限を
            超えない範囲でできるだけそれに近い手札を
            持つことが目標とされます。 ディーラーと対戦し、
            21に近づけるためにもう1枚カードをもらう
            (ヒット）か、持っているカードをそのままにする
            （スタンド）かのどちらかを21を超えない範囲で
            最も高い手札の価値を持つプレイヤーが
            ゲームに勝利します。
        `
        const rulesText = this.add.text(ruleFrameX + 10, ruleFrameY + 10, blackjackRuleText, { fontSize: '16px', color: '#fff', wordWrap: { width: ruleWidth - 20 } });


        //3つのボタン追加
        const buttonSpacing = this.widthPosition(0.125); // ボタン間のスペース
        const buttonY = this.centerY + 250; // ボタンのy座標

        const startButton = this.add.text(this.centerX - buttonSpacing, buttonY, 'START', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        startButton.setOrigin(1, 0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('BlackGameScene');
            this.scene.stop('BlackLevelScene');
        })
        const quitButton = this.add.text(this.centerX, buttonY, 'QUIT', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        quitButton.setOrigin(0.5, 0.5);
        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            this.scene.start('LobbyScene');
            this.scene.stop('BlackLevelScene');
        })

        const tutorialButton = this.add.text(this.centerX + buttonSpacing, buttonY, 'TUTORIAL', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        tutorialButton.setOrigin(0, 0.5);
        tutorialButton.setInteractive();
        // tutorialButtonのイベントハンドラをここに追加...

        function updateSelectedLevel(level : string) : void{
            selectedLevelText.setText(`レベル: ${level.toUpperCase()}`);
        }

        function updateSelectedEnemyCount(count : number) : void {
            selectedEnemyCountText.setText(`敵の数: ${count}`);
        }
    }
    //引数にnumをとることで, 割合をかけて得ることができる.
    widthPosition(num : number) : number{
        if(num <= 1 && num >= 0){
            return this.width * num
        }
        return 0;
    }
    heightPosition(num : number, height = this.height) : number{
        if(num <= 1 && num >= 0){
            return this.height * num
        }
        return 0;
    }

}
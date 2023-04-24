export default class BlackLevelScene extends Phaser.Scene{
    private width : number = 0
    private height : number = 0
    private centerX : number = 0
    private centerY : number = 0
    private static level : string = "normal";
    private static count : number = 3;
    constructor() {
        // super(key:'menuScene')で渡す値はゲームの切り替えやスタートなどに使う
        // Phaser.Scene.start('menuScene')やPhaser.Scene.switch('menuScene')など
        super({ key: 'BlackLevelScene'});
    }
    public static getLevel() : string{
        return this.level
    }

    public static setLevel(newLevel: string): void {
        this.level = newLevel;
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
        this.createTitleText()

        // レベル選択用のテキスト
        //this.createLevelButtons() 

        // 敵の数のテキストとボタン
        //this.createEnemyButtons()

        //ルール追加
        this.createRulesText() 

        //3つのボタン追加
        this.createControlButtons() 
    }
    //タイトルの追加
    createTitleText() {
        const titleText = this.add.text(this.centerX, this.heightPosition(0.1), 'ブラックジャック -black jack-', { fontSize: '32px', color: '#fff' });
        titleText.setOrigin(0.5, 0.5);
    }

    //難易度選択
    /*
    createLevelButtons() {
        const selectedLevelText = this.add.text(this.widthPosition(0.2), this.heightPosition(0.3), '', { fontSize: '20px', color: '#fff' });
        selectedLevelText.setOrigin(0.5, 0.5);
        this.updateSelectedLevel('normal', selectedLevelText)
        const levels = ['easy', 'normal', 'hard'];
        const levelButtons = levels.map((level, index) => {
            const button = this.add.text(this.widthPosition(0.1) + (index * this.widthPosition(0.13)), this.heightPosition(0.4), level.toUpperCase(), { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
            button.setOrigin(0.5, 0.5);
            button.setInteractive();

            button.on('pointerdown', () => {
                console.log(`Selected level: ${level}`);
                this.updateSelectedLevel(level, selectedLevelText); // 選択したレベルを更新
            });

            return button;
        });
    }

    //難易度選択時に更新するためのメソッド
    updateSelectedLevel(level : string, selectedLevelText: Phaser.GameObjects.Text) : void{
        BlackLevelScene.setLevel(level)
        selectedLevelText.setText(`レベル: ${BlackLevelScene.getLevel().toUpperCase()}`);
    }

    //敵の数を選択するボタン
    createEnemyButtons() {
        const selectedEnemyCountText = this.add.text(this.widthPosition(0.2), this.heightPosition(0.5), '', { fontSize: '20px', color: '#fff' });
        selectedEnemyCountText.setOrigin(0.5, 0.5);
        this.updateSelectedEnemyCount(3, selectedEnemyCountText)

        const enemyButtons = Array.from({ length: 6 }, (_, index) => {
            const button = this.add.text(this.widthPosition(0.1) + (index * this.widthPosition(0.05)), this.heightPosition(0.6), (index + 1).toString(), { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
            button.setOrigin(0.5, 0.5);
            button.setInteractive();

            button.on('pointerdown', () => {
                console.log(`Selected enemy count: ${index + 1}`);
                this.updateSelectedEnemyCount(index + 1, selectedEnemyCountText); // 選択した敵の数を更新
                BlackLevelScene.setCount(index + 1)
            });

            return button;
        });
    }

    //敵の数選択時に更新するためのボタン
    updateSelectedEnemyCount(count : number, selectedEnemyCountText: Phaser.GameObjects.Text) : void {
        BlackLevelScene.setCount(count)
        selectedEnemyCountText.setText(`敵の数: ${count}`);
    }
    */
    //ルールを追加するためのメソッド
    createRulesText() {
        const ruleFrameX = this.widthPosition(0.15)
        const ruleFrameY = this.heightPosition(0.2)
        const ruleWidth = this.widthPosition(0.70)
        const ruleHight = this.heightPosition(0.60)
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRect(ruleFrameX, ruleFrameY, ruleWidth, ruleHight);
        const blackjackRuleText = [
            "ゲームの目的は、手持ちのカードの合計点数が21に近い、または21に等しいようにすることです。",
            "ディーラーは、プレイヤーに2枚のカードを配ります。自分にも2枚のカードを配り、1枚は表向き、",
            "1枚は裏向きにします。",
            "プレイヤーは、自分の手札の合計点数が21に近づけるために、カードを引くことができます。",
            "ただし、手札の合計点数が21を超えると、バーストとなり、そのプレイヤーは負けになります。",
            "ディーラーは、自分の手札が17点以上になるまでカードを引きます。17点以上になったら、",
            "カードを引かないで止まります。",
            "カードの点数は、2から10まではそのままの数、絵札は10、エースは1または11として数えます。",
            "プレイヤーが最初の2枚のカードで21点を取った場合、これを「ブラックジャック」と呼び、",
            "プレイヤーは自動的に勝利します。",
            "ディーラーとプレイヤーが同点の場合は、引き分けになります。それ以外の場合は、",
            "カードの合計点数が高い方が勝利します。",
            "このゲームの操作",
            "ベットするためのポップアップが表示されたら。掛け金を設定する。",
            "その後表示されるボタンをクリックしてアクションを選択してください。",
          ].join("\n");
        const fontSize = Math.min(15.5, Math.max(8, Math.floor(this.cameras.main.width / 60)));
        const rulesText = this.add.text(ruleFrameX + 10, ruleFrameY + 10, blackjackRuleText, { fontSize: `${fontSize}px`, color: '#fff',align: 'left', wordWrap: { width: ruleWidth - 20 } });
        //const rulesText = this.add.text(ruleFrameX + 10, ruleFrameY + 10, blackjackRuleText, { fontSize: '16px', color: '#fff', wordWrap: { width: ruleWidth - 20 } });
    }

    //start, quit, tutorialボタン追加
    createControlButtons() {
        const buttonSpacing = this.widthPosition(0.1);
        const buttonY = this.centerY + 250;

        const startButton = this.add.text(this.centerX - buttonSpacing, buttonY, 'START', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        startButton.setOrigin(0.5, 0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('BlackGameScene');
            this.scene.stop('BlackLevelScene');
        })

        const quitButton = this.add.text(this.centerX + buttonSpacing, buttonY, 'QUIT', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        quitButton.setOrigin(0.5, 0.5);
        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            this.scene.start('LobbyScene');
            this.scene.stop('BlackLevelScene');
        })
        /*
        const tutorialButton = this.add.text(this.centerX + buttonSpacing, buttonY, 'TUTORIAL', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        tutorialButton.setOrigin(0, 0.5);
        tutorialButton.setInteractive();
        // tutorialButtonのイベントハンドラをここに追加...
        */
    }

    //引数にnumをとることで, 画面の幅に対する割合をかけてその数字を利用することができる.
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
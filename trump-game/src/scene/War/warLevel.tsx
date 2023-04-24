export default class WarLevelScene extends Phaser.Scene{
    private width : number = 0
    private height : number = 0
    private centerX : number = 0
    private centerY : number = 0
    private static level : string = "normal";
    private static count : number = 3;
    constructor() {
        // super(key:'menuScene')で渡す値はゲームの切り替えやスタートなどに使う
        // Phaser.Scene.start('menuScene')やPhaser.Scene.switch('menuScene')など
        super({ key: 'WarLevelScene'});
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

        //ルール追加
        this.createRulesText() 

        //3つのボタン追加
        this.createControlButtons() 
    }
    //タイトルの追加
    createTitleText() {
        const titleText = this.add.text(this.centerX, this.heightPosition(0.1), '戦争 -War- ', { fontSize: '32px', color: '#fff' });
        titleText.setOrigin(0.5, 0.5);
    }

    //ルールを追加するためのメソッド
    createRulesText() {
        const ruleFrameX = this.widthPosition(0.15)
        const ruleFrameY = this.heightPosition(0.2)
        const ruleWidth = this.widthPosition(0.70)
        const ruleHight = this.heightPosition(0.60)
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRect(ruleFrameX, ruleFrameY, ruleWidth, ruleHight);
        const warRuleText = [
            "War（ウォー）は、2人でプレイするカードゲームの一種です。",
            "ランダムに引いたカードの数字の大きさを比べ、大きい方が勝ちとなります。",
            "引いたカードは場に出され、勝者はそのカードを獲得できます。同じ数字のカードを",
            "引いた場合、それぞれ3枚のカードを伏せた状態で場に出し、「戦争」に突入します。",
            "その後、再度カードを引き、引いたカードの数字の大小で勝敗を決めます。この「戦争」",
            "に勝利すると、伏せて出されたカードをすべて獲得することができます。",
            "カードがなくなるか、相手のカードを全て獲得した場合、勝者が決定します。"
          ].join("\n");
        const fontSize = Math.min(20, Math.max(8, Math.floor(this.cameras.main.width / 60)));
        const rulesText = this.add.text(ruleFrameX + 10, ruleFrameY + 10, warRuleText, { fontSize: `${fontSize}px`, color: '#fff',align: 'left', wordWrap: { width: ruleWidth - 20 } });
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
            this.scene.start('WarScene');
            this.scene.stop('WarLevelScene');
        })

        const quitButton = this.add.text(this.centerX + buttonSpacing, buttonY, 'QUIT', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        quitButton.setOrigin(0.5, 0.5);
        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            this.scene.start('LobbyScene');
            this.scene.stop('WarLevelScene');
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
import { SpeedCardManager } from "../../model/Speed/SpeedCardManager";
import { SpeedTable } from "../../model/Speed/SpeedTable";
import { SpeedPlayer } from "../../model/Speed/SpeedPlayer";
import { Deck, Position } from '../../model/General/general';
import { SpeedGameScene } from '../../scene/Speed/SpeedGame';

export class SpeedControl {
    private scene : SpeedGameScene;
    private table : SpeedTable;
    private cpuManager : SpeedCardManager;
    private playerManager : SpeedCardManager;

    constructor(scene : SpeedGameScene, table : SpeedTable, cpuManager : SpeedCardManager, playerManager : SpeedCardManager){
        this.scene = scene;
        this.table = table;
        this.cpuManager = cpuManager;
        this.playerManager = playerManager;
    }

    public hasTurn(){
        if(this.table.getPhase() === "initial"){
            this.table.updateFieldCard(this.scene, this.playerManager, this.cpuManager, this);
        }
        else if(this.table.getPhase() === "game"){
            this.table.getPlayers()[1].cpuBehavior(this.table, this.scene, this.cpuManager);
        }
    }
}
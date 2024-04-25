interface IPlayer {
  id: number;
  name: string;
  score: number;
}

class Scoreboard {
  private players: IPlayer[];

  constructor() {
    this.players = this.loadPlayers();
    this.renderPlayers();
    this.setupEventListeners();
  }

  private loadPlayers(): IPlayer[] {
    const playersData: string | null = localStorage.getItem("players");
    return playersData ? JSON.parse(playersData) : [];
  }

  private savePlayers(players: IPlayer[]): void {
    localStorage.setItem("players", JSON.stringify(players));
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000); // Tạo id từ 0 đến 999999
  }

  private renderPlayers(): void {
    const playersContainer = document.getElementById("players-container");
    if (playersContainer) {
      playersContainer.innerHTML = "";
      this.players.forEach((player) => {
        playersContainer.innerHTML += `
                    <div class="player">
                        <div class="left">
                            <button data-id="${player.id}">X</button>
                            <h3>${player.name}</h3>
                        </div>
                        <div class="right">
                            <button data-id="${player.id}">-</button>
                            <p>${player.score}</p>
                            <button data-id="${player.id}">+</button>
                        </div>
                    </div>
                `;
      });
      this.updateStats();
    }
  }

  private setupEventListeners(): void {
    document
      .getElementById("add-player-btn")
      ?.addEventListener("click", () => this.addPlayer());
    document
      .getElementById("players-container")
      ?.addEventListener("click", (event) => this.handlePlayerAction(event));
  }

  private addPlayer(): void {
    const playerNameInput = document.getElementById(
      "new-player-name"
    ) as HTMLInputElement;
    const playerName = playerNameInput.value.trim();
    if (playerName !== "") {
      const playerId = this.generateId();
      const newPlayer: IPlayer = {
        id: playerId,
        name: playerName,
        score: 0,
      };
      this.players.push(newPlayer);
      this.savePlayers(this.players);
      this.renderPlayers();
      playerNameInput.value = "";
    }
  }

  private handlePlayerAction(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const playerId = parseInt(target.getAttribute("data-id") || "");
    if (!isNaN(playerId)) {
      if (target.tagName === "BUTTON") {
        this.updateScore(playerId, target.textContent);
      }
    }
  }

  private updateScore(playerId: number, action: string | null): void {
    const playerIndex = this.players.findIndex(
      (player) => player.id === playerId
    );
    if (playerIndex !== -1) {
      const player = this.players[playerIndex];
      if (action === "+") {
        player.score++;
      } else if (action === "-") {
        player.score = Math.max(0, player.score - 1);
      } else if (action === "X") {
        this.players.splice(playerIndex, 1);
      }
      this.savePlayers(this.players);
      this.renderPlayers();
    }
  }

  private updateStats(): void {
    const playerCount = document.getElementById("player-count");
    const totalPoints = document.getElementById("total-points");
    if (playerCount && totalPoints) {
      playerCount.innerText = `Players: ${this.players.length}`;
      totalPoints.innerText = `Total points: ${this.getTotalPoints()}`;
    }
  }

  private getTotalPoints(): number {
    return this.players.reduce((total, player) => total + player.score, 0);
  }
}

new Scoreboard();

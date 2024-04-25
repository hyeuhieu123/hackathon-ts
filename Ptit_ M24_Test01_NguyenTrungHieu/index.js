"use strict";
class Scoreboard {
    constructor() {
        this.players = this.loadPlayers();
        this.renderPlayers();
        this.setupEventListeners();
    }
    loadPlayers() {
        const playersData = localStorage.getItem("players");
        return playersData ? JSON.parse(playersData) : [];
    }
    savePlayers(players) {
        localStorage.setItem("players", JSON.stringify(players));
    }
    generateId() {
        return Math.floor(Math.random() * 1000000); // Tạo id từ 0 đến 999999
    }
    renderPlayers() {
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
    setupEventListeners() {
        var _a, _b;
        (_a = document
            .getElementById("add-player-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.addPlayer());
        (_b = document
            .getElementById("players-container")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (event) => this.handlePlayerAction(event));
    }
    addPlayer() {
        const playerNameInput = document.getElementById("new-player-name");
        const playerName = playerNameInput.value.trim();
        if (playerName !== "") {
            const playerId = this.generateId();
            const newPlayer = {
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
    handlePlayerAction(event) {
        const target = event.target;
        const playerId = parseInt(target.getAttribute("data-id") || "");
        if (!isNaN(playerId)) {
            if (target.tagName === "BUTTON") {
                this.updateScore(playerId, target.textContent);
            }
        }
    }
    updateScore(playerId, action) {
        const playerIndex = this.players.findIndex((player) => player.id === playerId);
        if (playerIndex !== -1) {
            const player = this.players[playerIndex];
            if (action === "+") {
                player.score++;
            }
            else if (action === "-") {
                player.score = Math.max(0, player.score - 1);
            }
            else if (action === "X") {
                this.players.splice(playerIndex, 1);
            }
            this.savePlayers(this.players);
            this.renderPlayers();
        }
    }
    updateStats() {
        const playerCount = document.getElementById("player-count");
        const totalPoints = document.getElementById("total-points");
        if (playerCount && totalPoints) {
            playerCount.innerText = `Players: ${this.players.length}`;
            totalPoints.innerText = `Total points: ${this.getTotalPoints()}`;
        }
    }
    getTotalPoints() {
        return this.players.reduce((total, player) => total + player.score, 0);
    }
}
new Scoreboard();

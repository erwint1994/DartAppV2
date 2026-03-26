import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

interface PlayerState {
  score: number;
  setsWon: number;
  legsWon: number;
}

interface TurnHistoryEntry {
  player: number;
  scored: number;
  remaining: number;
}

interface GameSnapshot {
  player1: PlayerState;
  player2: PlayerState;
  currentPlayer: 1 | 2;
  matchWinner: 1 | 2 | null;
  history: TurnHistoryEntry[];
}

/** Standard double-out checkout table (score → suggested route) */
const CHECKOUTS: Record<number, string> = {
  170: 'T20 T20 Bull',
  167: 'T20 T19 Bull',
  164: 'T20 T18 Bull',
  161: 'T20 T17 Bull',
  160: 'T20 T20 D20',
  158: 'T20 T20 D19',
  157: 'T20 T19 D20',
  156: 'T20 T20 D18',
  155: 'T20 T19 D19',
  154: 'T20 T18 D20',
  153: 'T20 T19 D18',
  152: 'T20 T20 D16',
  151: 'T20 T17 D20',
  150: 'T20 T18 D18',
  149: 'T20 T19 D16',
  148: 'T20 T16 D20',
  147: 'T20 T17 D18',
  146: 'T20 T18 D16',
  145: 'T20 T15 D20',
  144: 'T20 T18 D15',
  143: 'T20 T17 D16',
  142: 'T20 T14 D20',
  141: 'T20 T19 D12',
  140: 'T20 T16 D16',
  139: 'T19 T14 D20',
  138: 'T20 T18 D12',
  137: 'T20 T15 D16',
  136: 'T20 T20 D8',
  135: 'T20 T17 D12',
  134: 'T20 T14 D16',
  133: 'T20 T19 D8',
  132: 'T20 T16 D12',
  131: 'T20 T13 D16',
  130: 'T20 T18 D8',
  129: 'T19 T16 D12',
  128: 'T18 T14 D16',
  127: 'T20 T17 D8',
  126: 'T19 T15 D12',
  125: 'T20 T15 D10',
  124: 'T20 T16 D8',
  123: 'T19 T16 D9',
  122: 'T18 T18 D7',
  121: 'T20 T11 D14',
  120: 'T20 S20 D20',
  119: 'T19 T12 D13',
  118: 'T20 S18 D20',
  117: 'T20 S17 D20',
  116: 'T20 S16 D20',
  115: 'T20 S15 D20',
  114: 'T20 S14 D20',
  113: 'T20 S13 D20',
  112: 'T20 S12 D20',
  111: 'T20 S11 D20',
  110: 'T20 S10 D20',
  109: 'T20 S9 D20',
  108: 'T20 S16 D16',
  107: 'T19 S10 D20',
  106: 'T20 S6 D20',
  105: 'T20 S5 D20',
  104: 'T18 S10 D20',
  103: 'T20 S3 D20',
  102: 'T20 S2 D20',
  101: 'T20 S1 D20',
  100: 'T20 D20',
  99: 'T19 S2 D20',
  98: 'T20 D19',
  97: 'T19 D20',
  96: 'T20 D18',
  95: 'T19 D19',
  94: 'T18 D20',
  93: 'T19 D18',
  92: 'T20 D16',
  91: 'T17 D20',
  90: 'T18 D18',
  89: 'T19 D16',
  88: 'T16 D20',
  87: 'T17 D18',
  86: 'T18 D16',
  85: 'T15 D20',
  84: 'T20 D12',
  83: 'T17 D16',
  82: 'T14 D20',
  81: 'T19 D12',
  80: 'T20 D10',
  79: 'T13 D20',
  78: 'T18 D12',
  77: 'T15 D16',
  76: 'T20 D8',
  75: 'T17 D12',
  74: 'T14 D16',
  73: 'T19 D8',
  72: 'T16 D12',
  71: 'T13 D16',
  70: 'T18 D8',
  69: 'T19 D6',
  68: 'T20 D4',
  67: 'T17 D8',
  66: 'T10 D18',
  65: 'T15 D10',
  64: 'T16 D8',
  63: 'T13 D12',
  62: 'T10 D16',
  61: 'T15 D8',
  60: 'S20 D20',
  59: 'S19 D20',
  58: 'S18 D20',
  57: 'S17 D20',
  56: 'S16 D20',
  55: 'S15 D20',
  54: 'S14 D20',
  53: 'S13 D20',
  52: 'S12 D20',
  51: 'S11 D20',
  50: 'S10 D20',
  49: 'S9 D20',
  48: 'S8 D20',
  47: 'S7 D20',
  46: 'S6 D20',
  45: 'S5 D20',
  44: 'S4 D20',
  43: 'S3 D20',
  42: 'S10 D16',
  41: 'S9 D16',
  40: 'D20',
  38: 'D19',
  36: 'D18',
  34: 'D17',
  32: 'D16',
  30: 'D15',
  28: 'D14',
  26: 'D13',
  24: 'D12',
  22: 'D11',
  20: 'D10',
  18: 'D9',
  16: 'D8',
  14: 'D7',
  12: 'D6',
  10: 'D5',
  8: 'D4',
  6: 'D3',
  4: 'D2',
  2: 'D1',
};

@Component({
  selector: 'app-game',
  templateUrl: './game.html',
  styleUrl: './game.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(TranslationService);

  /** Match config */
  readonly bestOfSets = signal(1);
  readonly bestOfLegs = signal(3);
  readonly startingScore: number = 501;

  /** Player state */
  readonly player1 = signal<PlayerState>({ score: 501, setsWon: 0, legsWon: 0 });
  readonly player2 = signal<PlayerState>({ score: 501, setsWon: 0, legsWon: 0 });

  /** Turn tracking */
  readonly currentPlayer = signal<1 | 2>(1);
  readonly inputBuffer = signal('');
  readonly lastBust = signal(false);
  readonly history = signal<TurnHistoryEntry[]>([]);

  /** Undo stack — snapshots of the full state before each confirmed turn */
  readonly undoStack = signal<GameSnapshot[]>([]);

  /** Match over */
  readonly matchWinner = signal<1 | 2 | null>(null);

  /** Can the user undo? */
  readonly canUndo = computed((): boolean => this.undoStack().length > 0);

  /** How many sets/legs needed to win */
  readonly setsToWin = computed((): number => Math.ceil(this.bestOfSets() / 2));
  readonly legsToWin = computed((): number => Math.ceil(this.bestOfLegs() / 2));

  /** Current player state shortcut */
  readonly activePlayer = computed((): PlayerState =>
    this.currentPlayer() === 1 ? this.player1() : this.player2(),
  );

  /** Display the entered value (or 0) */
  readonly displayInput = computed((): string => this.inputBuffer() || '0');

  /** Checkout suggestion for the active player */
  readonly checkoutHint = computed((): string | null => {
    const score = this.activePlayer().score;
    return CHECKOUTS[score] ?? null;
  });

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.bestOfSets.set(Number(params['sets']) || 1);
    this.bestOfLegs.set(Number(params['legs']) || 3);
  }

  /** Numpad digit press */
  pressDigit(digit: string): void {
    this.lastBust.set(false);
    const current = this.inputBuffer();
    if (current.length >= 3) {
      return;
    }
    this.inputBuffer.set(current + digit);
  }

  /** Backspace */
  pressBackspace(): void {
    this.lastBust.set(false);
    const current = this.inputBuffer();
    this.inputBuffer.set(current.slice(0, -1));
  }

  /** Clear input */
  pressClear(): void {
    this.lastBust.set(false);
    this.inputBuffer.set('');
  }

  /** Confirm the score for the current turn */
  confirmScore(): void {
    if (this.matchWinner()) {
      return;
    }

    const thrown = Number(this.inputBuffer()) || 0;
    this.inputBuffer.set('');
    this.lastBust.set(false);

    // Max possible score in a single turn (3 darts) is 180
    if (thrown > 180 || thrown < 0) {
      return;
    }

    // Save snapshot before applying
    this.pushSnapshot();

    const playerSig = this.currentPlayer() === 1 ? this.player1 : this.player2;
    const state = playerSig();
    const newScore = state.score - thrown;

    // Bust rules: score goes negative, equals 1 (can't finish — need double),
    // or equals 0 but thrown was 0 (no score doesn't win)
    if (newScore < 0 || newScore === 1) {
      this.lastBust.set(true);
      this.addHistory(this.currentPlayer(), 0, state.score);
      this.switchTurn();
      return;
    }

    if (newScore === 0) {
      // Leg won!
      this.addHistory(this.currentPlayer(), thrown, 0);
      this.handleLegWon(this.currentPlayer());
      return;
    }

    // Valid score
    playerSig.set({ ...state, score: newScore });
    this.addHistory(this.currentPlayer(), thrown, newScore);
    this.switchTurn();
  }

  /** Quick-score buttons for common values */
  quickScore(value: number): void {
    this.inputBuffer.set(String(value));
    this.confirmScore();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  /** Restart the entire match */
  restartMatch(): void {
    this.player1.set({ score: this.startingScore, setsWon: 0, legsWon: 0 });
    this.player2.set({ score: this.startingScore, setsWon: 0, legsWon: 0 });
    this.currentPlayer.set(1);
    this.matchWinner.set(null);
    this.inputBuffer.set('');
    this.lastBust.set(false);
    this.history.set([]);
    this.undoStack.set([]);
  }

  /** Undo the last confirmed score */
  undoLast(): void {
    const stack = this.undoStack();
    if (stack.length === 0) {
      return;
    }
    const snapshot = stack[stack.length - 1];
    this.undoStack.set(stack.slice(0, -1));
    this.player1.set(snapshot.player1);
    this.player2.set(snapshot.player2);
    this.currentPlayer.set(snapshot.currentPlayer);
    this.matchWinner.set(snapshot.matchWinner);
    this.history.set(snapshot.history);
    this.lastBust.set(false);
    this.inputBuffer.set('');
  }

  private switchTurn(): void {
    this.currentPlayer.set(this.currentPlayer() === 1 ? 2 : 1);
  }

  private addHistory(player: number, scored: number, remaining: number): void {
    this.history.update((h) => [...h, { player, scored, remaining }]);
  }

  private pushSnapshot(): void {
    this.undoStack.update((stack) => [
      ...stack,
      {
        player1: { ...this.player1() },
        player2: { ...this.player2() },
        currentPlayer: this.currentPlayer(),
        matchWinner: this.matchWinner(),
        history: [...this.history()],
      },
    ]);
  }

  private handleLegWon(winner: 1 | 2): void {
    const playerSig = winner === 1 ? this.player1 : this.player2;
    const state = playerSig();
    const newLegsWon = state.legsWon + 1;

    if (newLegsWon >= this.legsToWin()) {
      // Set won!
      this.handleSetWon(winner, newLegsWon);
      return;
    }

    // Reset scores for new leg, keep sets/legs
    playerSig.set({ ...state, legsWon: newLegsWon, score: this.startingScore });
    const otherSig = winner === 1 ? this.player2 : this.player1;
    otherSig.set({ ...otherSig(), score: this.startingScore });
    this.switchTurn();
  }

  private handleSetWon(winner: 1 | 2, legsWon: number): void {
    const playerSig = winner === 1 ? this.player1 : this.player2;
    const state = playerSig();
    const newSetsWon = state.setsWon + 1;

    if (newSetsWon >= this.setsToWin()) {
      // Match won!
      playerSig.set({ ...state, setsWon: newSetsWon, legsWon, score: 0 });
      this.matchWinner.set(winner);
      return;
    }

    // Reset legs for new set
    playerSig.set({ ...state, setsWon: newSetsWon, legsWon: 0, score: this.startingScore });
    const otherSig = winner === 1 ? this.player2 : this.player1;
    otherSig.set({ ...otherSig(), legsWon: 0, score: this.startingScore });
    this.switchTurn();
  }
}

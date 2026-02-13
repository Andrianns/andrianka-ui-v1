import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import ScrollReveal from '@/components/scroll-reveal'
import { Button } from '@/components/ui/button'
import type { CardsSection, CardItem } from '@/lib/cms'
import { resolveMediaUrl } from '@/lib/cms'
import { cn } from '@/lib/utils'

type PlaygroundId = 'chess' | 'calculator' | 'sudoku' | 'pomodoro' | 'sketch'

type PlaygroundItem = {
  id: string
  interactiveId?: PlaygroundId
  title: string
  category: 'Game' | 'Utility'
  summary?: string
  description: string
  preview: string
  tag?: string | null
}

const INTERACTIVE_META: Record<PlaygroundId, { summary: string; defaultCategory: 'Game' | 'Utility'; preview: string }> = {
  chess: {
    summary: 'Classic strategy',
    defaultCategory: 'Game',
    preview: '/game-chess-lab.jpg',
  },
  calculator: {
    summary: 'Math scratchpad',
    defaultCategory: 'Utility',
    preview: '/utility-quick-calculator.jpg',
  },
  sudoku: {
    summary: 'Logic puzzle',
    defaultCategory: 'Game',
    preview: '/game-sudoku-studio.jpg',
  },
  pomodoro: {
    summary: 'Focus rhythm',
    defaultCategory: 'Utility',
    preview: '/utility-pomodoro-timer.jpg',
  },
  sketch: {
    summary: 'Creative sandbox',
    defaultCategory: 'Utility',
    preview: '/utility-pixel-sketch.jpg',
  },
}

const CARD_PLACEHOLDER_IMAGE = '/placeholder.svg?height=160&width=280&query=tool'

const isPlaygroundId = (value: string | undefined): value is PlaygroundId =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(INTERACTIVE_META, value)

const deriveCategory = (tag: string | undefined | null, fallback: 'Game' | 'Utility'): 'Game' | 'Utility' => {
  if (!tag) return fallback
  const normalized = tag.trim().toUpperCase()
  if (normalized === 'GAME') return 'Game'
  if (normalized === 'UTILITY') return 'Utility'
  return fallback
}

const deriveSummary = (description: string, fallback?: string): string | undefined => {
  if (fallback) return fallback
  const trimmed = description.trim()
  if (!trimmed) return undefined
  if (trimmed.length <= 80) return trimmed
  return `${trimmed.slice(0, 77).trimEnd()}…`
}

const buildPlaygroundItems = (items: CardItem[]): PlaygroundItem[] =>
  items.map((item, index) => {
    const interactiveId = isPlaygroundId(item.id) ? item.id : undefined
    const meta = interactiveId ? INTERACTIVE_META[interactiveId] : undefined
    const category = deriveCategory(item.tag, meta?.defaultCategory ?? 'Utility')
    const previewSource =
      resolveMediaUrl(item.image, item.imageUrl ?? meta?.preview ?? CARD_PLACEHOLDER_IMAGE) ??
      meta?.preview ??
      CARD_PLACEHOLDER_IMAGE

    return {
      id: item.id ?? `tool-${index}`,
      interactiveId,
      title: item.title,
      category,
      summary: deriveSummary(item.description, meta?.summary),
      description: item.description,
      preview: previewSource,
      tag: item.tag ?? null,
    }
  })

type GamesSectionProps = {
  section: CardsSection
}

const FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

const categoryBadgeClasses: Record<PlaygroundItem['category'], string> = {
  Game: 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200',
  Utility: 'border-sky-300/40 bg-sky-400/10 text-sky-100',
}

const summaryTextClasses: Record<PlaygroundItem['category'], string> = {
  Game: 'text-emerald-200/80',
  Utility: 'text-sky-100/80',
}

type PlaygroundCardProps = {
  item: PlaygroundItem
  onSelect: (item: PlaygroundItem) => void
  className?: string
}

function PlaygroundCard({ item, onSelect, className }: PlaygroundCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        'group relative flex w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/90 text-left text-card-foreground shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.preview || CARD_PLACEHOLDER_IMAGE}
          alt={item.title}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground md:text-xl">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
              categoryBadgeClasses[item.category],
            )}
          >
            {(item.tag ?? item.category).toUpperCase()}
          </span>
          {item.summary ? (
            <span className={cn('text-xs font-medium', summaryTextClasses[item.category])}>{item.summary}</span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

type PlaygroundModalProps = {
  item: PlaygroundItem
  onClose: () => void
}

function PlaygroundModal({ item, onClose }: PlaygroundModalProps) {
  return (
    <motion.div
      key="playground-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative flex w-full max-w-[92vw] sm:max-w-3xl lg:max-w-5xl max-h-[82vh] flex-col overflow-hidden rounded-3xl border border-border/60 bg-card text-card-foreground shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {(item.tag ?? item.category).toUpperCase()}
            </p>
            <h3 className="mt-1 text-2xl font-semibold md:text-3xl">{item.title}</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{item.description}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={onClose}
            aria-label="Close playground"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5 sm:px-8">
          {item.interactiveId ? renderPlayground(item.interactiveId) : null}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function GamesSection({ section }: GamesSectionProps) {
  const items = useMemo(() => buildPlaygroundItems(section.items ?? []), [section.items])
  const marqueeItems = useMemo(() => (items.length ? [...items, ...items] : []), [items])
  const [showAll, setShowAll] = useState(false)
  const [activeItem, setActiveItem] = useState<PlaygroundItem | null>(null)
  const heading = section.title ?? 'Games & Utilities'
  const description = section.subtitle ?? 'Hands-on tools and play spaces I tinker with during creative breaks.'
  const totalItems = items.length
  const hasPlaygrounds = totalItems > 0
  const showToggle = section.showViewAll !== false && hasPlaygrounds
  const ctaLabel = section.viewAllLabel ?? `Show all ${totalItems} tools`

  useEffect(() => {
    if (!activeItem) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveItem(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeItem])

  const handleSelect = (item: PlaygroundItem) => {
    if (!item.interactiveId) return
    setActiveItem(item)
  }

  return (
    <section id="games" className="py-16">
      <ScrollReveal>
        <div className="mx-auto max-w-[110rem] px-8 md:px-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-balance text-3xl font-semibold text-foreground md:text-4xl">{heading}</h2>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="mx-auto mt-8 max-w-[110rem] px-8 md:px-16">
        <AnimatePresence mode="wait" initial={false}>
          {showAll ? (
            <motion.div
              key="games-grid"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {items.map((item) => (
                <PlaygroundCard key={`grid-${item.id}`} item={item} onSelect={handleSelect} className="w-full" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="games-marquee"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="marquee">
                <div className="marquee-track">
                  {marqueeItems.map((item, index) => (
                    <PlaygroundCard
                      key={`${item.id}-${index}`}
                      item={item}
                      onSelect={handleSelect}
                      className="w-[320px] shrink-0"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showToggle ? (
          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? 'Collapse tools' : ctaLabel}
            </Button>
          </div>
        ) : null}

        {!hasPlaygrounds ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">No tools available at the moment.</p>
        ) : null}
      </div>

      <AnimatePresence>
        {activeItem ? <PlaygroundModal item={activeItem} onClose={() => setActiveItem(null)} /> : null}
      </AnimatePresence>
    </section>
  )
}

type ChessPieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
type ChessColor = 'white' | 'black'

type ChessPiece = {
  type: ChessPieceType
  color: ChessColor
}

type Square = ChessPiece | null

type Coordinate = {
  row: number
  col: number
}

type Move = {
  from: Coordinate
  to: Coordinate
}

function createInitialBoard(): Square[][] {
  const order: ChessPieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
  const board: Square[][] = Array.from({ length: 8 }, () => Array<Square>(8).fill(null))

  order.forEach((piece, index) => {
    board[0][index] = { type: piece, color: 'black' }
    board[1][index] = { type: 'pawn', color: 'black' }
    board[6][index] = { type: 'pawn', color: 'white' }
    board[7][index] = { type: piece, color: 'white' }
  })

  return board
}

function cloneBoard(board: Square[][]): Square[][] {
  return board.map((row) => row.map((square) => (square ? { ...square } : null)))
}

const pieceIcons: Record<ChessColor, Record<ChessPieceType, string>> = {
  white: {
    king: '\u2654',
    queen: '\u2655',
    rook: '\u2656',
    bishop: '\u2657',
    knight: '\u2658',
    pawn: '\u2659',
  },
  black: {
    king: '\u265A',
    queen: '\u265B',
    rook: '\u265C',
    bishop: '\u265D',
    knight: '\u265E',
    pawn: '\u265F',
  },
}

function isInBounds(row: number, col: number) {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

function getLineMoves(board: Square[][], row: number, col: number, directions: Array<[number, number]>, color: ChessColor) {
  const moves: Coordinate[] = []

  directions.forEach(([rowDelta, colDelta]) => {
    let r = row + rowDelta
    let c = col + colDelta

    while (isInBounds(r, c)) {
      const target = board[r][c]
      if (!target) {
        moves.push({ row: r, col: c })
      } else {
        if (target.color !== color) {
          moves.push({ row: r, col: c })
        }
        break
      }
      r += rowDelta
      c += colDelta
    }
  })

  return moves
}

function getLegalMoves(board: Square[][], position: Coordinate): Coordinate[] {
  const { row, col } = position
  const piece = board[row][col]
  if (!piece) return []

  const moves: Coordinate[] = []
  const forward = piece.color === 'white' ? -1 : 1

  switch (piece.type) {
    case 'pawn': {
      const nextRow = row + forward
      if (isInBounds(nextRow, col) && !board[nextRow][col]) {
        moves.push({ row: nextRow, col })
        const startRow = piece.color === 'white' ? 6 : 1
        const doubleRow = nextRow + forward
        if (row === startRow && isInBounds(doubleRow, col) && !board[doubleRow][col]) {
          moves.push({ row: doubleRow, col })
        }
      }
      const captureColumns = [col - 1, col + 1]
      captureColumns.forEach((captureCol) => {
        if (!isInBounds(nextRow, captureCol)) return
        const target = board[nextRow][captureCol]
        if (target && target.color !== piece.color) {
          moves.push({ row: nextRow, col: captureCol })
        }
      })
      break
    }
    case 'rook':
      moves.push(...getLineMoves(board, row, col, [[1, 0], [-1, 0], [0, 1], [0, -1]], piece.color))
      break
    case 'bishop':
      moves.push(...getLineMoves(board, row, col, [[1, 1], [1, -1], [-1, 1], [-1, -1]], piece.color))
      break
    case 'queen':
      moves.push(
        ...getLineMoves(board, row, col, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], piece.color),
      )
      break
    case 'king': {
      const deltas = [-1, 0, 1]
      deltas.forEach((dr) => {
        deltas.forEach((dc) => {
          if (dr === 0 && dc === 0) return
          const r = row + dr
          const c = col + dc
          if (!isInBounds(r, c)) return
          const target = board[r][c]
          if (!target || target.color !== piece.color) {
            moves.push({ row: r, col: c })
          }
        })
      })
      break
    }
    case 'knight': {
      const possibilities: Array<[number, number]> = [
        [row + 2, col + 1],
        [row + 2, col - 1],
        [row - 2, col + 1],
        [row - 2, col - 1],
        [row + 1, col + 2],
        [row + 1, col - 2],
        [row - 1, col + 2],
        [row - 1, col - 2],
      ]
      possibilities.forEach(([r, c]) => {
        if (!isInBounds(r, c)) return
        const target = board[r][c]
        if (!target || target.color !== piece.color) {
          moves.push({ row: r, col: c })
        }
      })
      break
    }
  }

  return moves
}

function ChessBoard() {
  const [board, setBoard] = useState<Square[][]>(() => createInitialBoard())
  const [turn, setTurn] = useState<ChessColor>('white')
  const [selected, setSelected] = useState<Coordinate | null>(null)
  const [legalMoves, setLegalMoves] = useState<Coordinate[]>([])
  const [lastMove, setLastMove] = useState<Move | null>(null)
  const [winner, setWinner] = useState<ChessColor | null>(null)

  const onSquareClick = (row: number, col: number) => {
    if (winner) return

    const piece = board[row][col]
    const isLegalMove = legalMoves.some((move) => move.row === row && move.col === col)

    if (selected && isLegalMove) {
      const nextBoard = cloneBoard(board)
      const movingPiece = nextBoard[selected.row][selected.col]
      if (!movingPiece) return
      const target = nextBoard[row][col]
      nextBoard[selected.row][selected.col] = null
      nextBoard[row][col] = movingPiece
      setBoard(nextBoard)
      setTurn((prev) => (prev === 'white' ? 'black' : 'white'))
      setLastMove({ from: selected, to: { row, col } })
      setSelected(null)
      setLegalMoves([])
      if (target?.type === 'king') {
        setWinner(movingPiece.color)
      }
      return
    }

    if (piece && piece.color === turn) {
      const moves = getLegalMoves(board, { row, col })
      setSelected({ row, col })
      setLegalMoves(moves)
    } else {
      setSelected(null)
      setLegalMoves([])
    }
  }

  const reset = () => {
    setBoard(createInitialBoard())
    setTurn('white')
    setSelected(null)
    setLegalMoves([])
    setLastMove(null)
    setWinner(null)
  }

  const statusMessage = winner
    ? winner === 'white'
      ? 'You win! The black king has fallen.'
      : 'You lose. Black captured your king.'
    : turn === 'white'
      ? 'Your move (White)'
      : 'Opponent move (Black)'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'text-sm font-medium uppercase tracking-[0.2em]',
            winner ? (winner === 'white' ? 'text-emerald-400' : 'text-destructive') : 'text-muted-foreground',
          )}
        >
          {statusMessage}
        </div>
        <Button variant="outline" size="sm" className="rounded-full" onClick={reset}>
          Reset board
        </Button>
      </div>
      <div className="w-full overflow-auto">
        <div className="mx-auto grid max-w-max grid-cols-8 border-4 border-border/70 shadow-inner">
          {board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 1
              const isSelected = selected?.row === rowIndex && selected?.col === colIndex
              const isLegal = legalMoves.some((move) => move.row === rowIndex && move.col === colIndex)
              const isLastMove =
                lastMove &&
                ((lastMove.from.row === rowIndex && lastMove.from.col === colIndex) ||
                  (lastMove.to.row === rowIndex && lastMove.to.col === colIndex))

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  className={cn(
                    'relative flex h-14 w-14 items-center justify-center text-2xl font-semibold transition-colors md:h-16 md:w-16 md:text-3xl',
                    isDark ? 'bg-stone-700' : 'bg-stone-200',
                    isSelected && 'ring-2 ring-accent',
                    isLegal && 'after:absolute after:inset-0 after:bg-accent/30',
                    isLastMove && 'outline-2 outline-accent/60 outline-offset-0',
                  )}
                >
                  {square ? (
                    <span
                      className={cn(
                        'drop-shadow-sm',
                        square.color === 'white'
                          ? 'text-stone-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]'
                          : 'text-stone-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]',
                      )}
                    >
                      {pieceIcons[square.color][square.type]}
                    </span>
                  ) : null}
                </button>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}

function CalculatorPad() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')

  const append = (value: string) => {
    setExpression((current) => current + value)
  }

  const clear = () => {
    setExpression('')
    setResult('0')
  }

  const backspace = () => {
    setExpression((current) => current.slice(0, -1))
  }

  const evaluate = () => {
    try {
      const safeExpression = expression.replace(/%/g, '/100')
      // eslint-disable-next-line no-new-func
      const computed = Function('return (' + (safeExpression || '0') + ')')()
      setResult(String(computed))
    } catch (error) {
      setResult('Error')
    }
  }

  const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4 text-right shadow-sm">
        <div className="min-h-[2.5rem] text-muted-foreground">{expression || '0'}</div>
        <div className="text-2xl font-semibold text-foreground">{result}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          className="col-span-2 rounded-xl bg-muted/30 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted/50"
          onClick={clear}
        >
          Clear
        </button>
        <button
          type="button"
          className="rounded-xl bg-muted/30 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted/50"
          onClick={backspace}
        >
          Back
        </button>
        <button
          type="button"
          className="rounded-xl bg-accent py-3 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
          onClick={evaluate}
        >
          Eval
        </button>
        {buttons.map((value) => (
          <button
            key={value}
            type="button"
            className="rounded-xl bg-card/60 py-3 text-lg font-semibold text-foreground shadow-sm transition-colors hover:bg-card"
            onClick={() => (value === '=' ? evaluate() : append(value))}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}

const sudokuPuzzle: number[][] = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
]

const sudokuSolution: number[][] = [
  [4, 3, 5, 2, 6, 9, 7, 8, 1],
  [6, 8, 2, 5, 7, 1, 4, 9, 3],
  [1, 9, 7, 8, 3, 4, 5, 6, 2],
  [8, 2, 6, 1, 9, 5, 3, 4, 7],
  [3, 7, 4, 6, 8, 2, 9, 1, 5],
  [9, 5, 1, 7, 4, 3, 6, 2, 8],
  [5, 1, 9, 3, 2, 6, 8, 7, 4],
  [2, 4, 8, 9, 5, 7, 1, 3, 6],
  [7, 6, 3, 4, 1, 8, 2, 5, 9],
]

function SudokuBoard() {
  const [grid, setGrid] = useState(() => sudokuPuzzle.map((row) => [...row]))
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const preset = useMemo(() => sudokuPuzzle.map((row) => row.map((value) => value !== 0)), [])

  const updateCell = (row: number, col: number, value: string) => {
    if (preset[row][col]) return
    const parsed = Number.parseInt(value, 10)
    setGrid((current) => {
      const next = current.map((r) => [...r])
      next[row][col] = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(9, parsed))
      return next
    })
    setStatus('idle')
  }

  const reset = () => {
    setGrid(sudokuPuzzle.map((row) => [...row]))
    setStatus('idle')
  }

  const check = () => {
    const isCorrect = grid.every((row, rowIndex) =>
      row.every((value, colIndex) => value === sudokuSolution[rowIndex][colIndex]),
    )
    setStatus(isCorrect ? 'correct' : 'incorrect')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div
          className={cn('text-sm font-medium uppercase tracking-[0.2em]', {
            'text-green-500': status === 'correct',
            'text-destructive': status === 'incorrect',
            'text-muted-foreground': status === 'idle',
          })}
        >
          {status === 'correct' && 'Solved perfectly!'}
          {status === 'incorrect' && 'Keep trying - there are mistakes.'}
          {status === 'idle' && 'Complete the puzzle'}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={reset}>
            Reset
          </Button>
          <Button size="sm" className="rounded-full" onClick={check}>
            Check
          </Button>
        </div>
      </div>
      <div className="mx-auto grid grid-cols-9 overflow-hidden rounded-2xl border-4 border-border/70">
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const thickBorderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8
            const thickBorderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8
            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                value={value === 0 ? '' : value}
                onChange={(event) => updateCell(rowIndex, colIndex, event.target.value.replace(/[^1-9]/g, ''))}
                maxLength={1}
                readOnly={preset[rowIndex][colIndex]}
                className={cn(
                  'h-12 w-12 border border-border/40 text-center text-lg font-semibold focus:border-accent focus:outline-none md:h-14 md:w-14 md:text-xl',
                  preset[rowIndex][colIndex] ? 'bg-muted/40 text-foreground' : 'bg-background',
                  thickBorderRight && 'border-r-2',
                  thickBorderBottom && 'border-b-2',
                )}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}

function PomodoroTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const [timeLeft, setTimeLeft] = useState(FOCUS_SECONDS)

  useEffect(() => {
    if (!isRunning) return
    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          const nextMode = mode === 'focus' ? 'break' : 'focus'
          setMode(nextMode)
          return nextMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning, mode])

  useEffect(() => {
    setTimeLeft(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS)
  }, [mode])

  const toggle = () => setIsRunning((running) => !running)
  const reset = () => {
    setIsRunning(false)
    setMode('focus')
    setTimeLeft(FOCUS_SECONDS)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = String(timeLeft % 60).padStart(2, '0')
  const total = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS
  const progress = 1 - timeLeft / total

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        {mode === 'focus' ? 'Focus' : 'Break'}
      </div>
      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="var(--border)" strokeWidth="6" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeDasharray={`${Math.PI * 90}`}
            strokeDashoffset={`${(1 - progress) * Math.PI * 90}`}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-4xl font-semibold tabular-nums">
            {minutes}:{seconds}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Time left</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button size="sm" className="rounded-full" onClick={toggle}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" onClick={reset}>
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => setMode((prev) => (prev === 'focus' ? 'break' : 'focus'))}
        >
          Toggle
        </Button>
      </div>
    </div>
  )
}

const SKETCH_SIZE = 24

function SketchPad() {
  const [cells, setCells] = useState(() => Array.from({ length: SKETCH_SIZE }, () => Array<boolean>(SKETCH_SIZE).fill(false)))
  const [isDrawing, setIsDrawing] = useState(false)

  const paintCell = (row: number, col: number) => {
    setCells((current) => {
      if (current[row][col]) return current
      const next = current.map((r) => [...r])
      next[row][col] = true
      return next
    })
  }

  const clear = () => {
    setCells(Array.from({ length: SKETCH_SIZE }, () => Array<boolean>(SKETCH_SIZE).fill(false)))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="rounded-full" onClick={clear}>
          Clear canvas
        </Button>
      </div>
      <div
        className="mx-auto grid touch-none select-none border-4 border-border/70"
        style={{ gridTemplateColumns: `repeat(${SKETCH_SIZE}, minmax(0, 1fr))` }}
        onPointerUp={() => setIsDrawing(false)}
        onPointerLeave={() => setIsDrawing(false)}
      >
        {cells.map((row, rowIndex) =>
          row.map((filled, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onPointerDown={() => {
                setIsDrawing(true)
                paintCell(rowIndex, colIndex)
              }}
              onPointerEnter={() => {
                if (isDrawing) {
                  paintCell(rowIndex, colIndex)
                }
              }}
              className={cn('h-6 w-6 border border-border/40 bg-background md:h-8 md:w-8', filled && 'bg-accent/80')}
            />
          )),
        )}
      </div>
    </div>
  )
}

function renderPlayground(id: PlaygroundId | undefined) {
  switch (id) {
    case 'chess':
      return <ChessBoard />
    case 'calculator':
      return <CalculatorPad />
    case 'sudoku':
      return <SudokuBoard />
    case 'pomodoro':
      return <PomodoroTimer />
    case 'sketch':
      return <SketchPad />
    default:
      return null
  }
}

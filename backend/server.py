import asyncio
import enum
import json
import random
from asyncio import sleep
from typing import List
from uuid import uuid4, UUID

import websockets
from websockets import WebSocketServerProtocol

produced_message_queue = []


class GetValueEnum(enum.Enum):

    @classmethod
    def get_value(cls, value):
        return cls._value2member_map_.get(value, None)


class ClientAction(GetValueEnum):
    CONNECT = 'CONNECT'
    PLAY = 'PLAY'
    MOVE = 'MOVE'


class ServerAction(enum.Enum):
    PRE_GAME = 'PRE_GAME'
    PLAYER_STATE = 'PLAYER_STATE'
    GAME_STATE = 'GAME_STATE'


def get_message(action: ServerAction, message: dict):
    return json.dumps([action.value, message])


class PlayerState(enum.Enum):
    CONNECTED = 'CONNECTED'
    PLAYING = 'PLAYING'


class PlayerColor(GetValueEnum):
    WHITE = 'W'
    BLACK = 'B'


class Player:
    socket: WebSocketServerProtocol
    state: PlayerState
    color: PlayerColor

    def __init__(self, color: PlayerColor, socket: WebSocketServerProtocol):
        self.socket = socket
        self.color = color
        self.state = PlayerState.CONNECTED

    @property
    def id(self):
        return id(self.socket)

    def set_connected(self):
        self.state = PlayerState.CONNECTED
        self.send_state()

    def set_playing(self):
        self.state = PlayerState.PLAYING
        self.send_state()

    @property
    def can_start(self):
        return self.state.value == PlayerState.CONNECTED

    def send_state(self):
        produced_message_queue.append(
            get_message(
                ServerAction.PLAYER_STATE,
                {
                    'id': str(id(self.socket)),
                    'color': self.color.value,
                    'state': self.state.value,
                }
            )
        )


class PieceType(GetValueEnum):
    PAWN = 'P'
    ROOK = 'R'
    KNIGHT = 'N'
    BISHOP = 'B'
    QUEEN = 'Q'
    KING = 'K'


class Piece:
    id: str
    type: PieceType
    color: PlayerColor
    x: int
    y: int

    def __init__(self, game, type, color, x, y):
        self.id = str(uuid4())
        self.game = game
        self.type = type
        self.color = color
        self.x = x
        self.y = y

    def to_serializable_dict(self):
        return {
            'id': self.id,
            'type': self.type.value,
            'color': self.color.value,
            'x': self.x,
            'y': self.y,
        }


class GameState(GetValueEnum):
    WAITING = 'WAITING'
    PLAYING = 'PLAYING'


class ChessGame:
    id: UUID
    state: GameState

    players: dict

    board: List[Piece]
    on_move: PlayerColor or None = None

    def __init__(self):
        self.id = uuid4()
        self.state = GameState.WAITING
        self.players = {}
        self.board = [
            Piece(self, PieceType.ROOK, PlayerColor.BLACK, x=1, y=8),
            Piece(self, PieceType.KNIGHT, PlayerColor.BLACK, x=2, y=8),
            Piece(self, PieceType.BISHOP, PlayerColor.BLACK, x=3, y=8),
            Piece(self, PieceType.QUEEN, PlayerColor.BLACK, x=4, y=8),
            Piece(self, PieceType.KING, PlayerColor.BLACK, x=5, y=8),
            Piece(self, PieceType.BISHOP, PlayerColor.BLACK, x=6, y=8),
            Piece(self, PieceType.KNIGHT, PlayerColor.BLACK, x=7, y=8),
            Piece(self, PieceType.ROOK, PlayerColor.BLACK, x=8, y=8),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=1, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=2, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=3, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=4, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=5, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=6, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=7, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.BLACK, x=8, y=7),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=1, y=2),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=2, y=2),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=3, y=2),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=4, y=2),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=5, y=2),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=6, y=2),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=7, y=2),
            Piece(self, PieceType.PAWN, PlayerColor.WHITE, x=8, y=2),
            Piece(self, PieceType.ROOK, PlayerColor.WHITE, x=1, y=1),
            Piece(self, PieceType.BISHOP, PlayerColor.WHITE, x=2, y=1),
            Piece(self, PieceType.KNIGHT, PlayerColor.WHITE, x=3, y=1),
            Piece(self, PieceType.QUEEN, PlayerColor.WHITE, x=4, y=1),
            Piece(self, PieceType.KING, PlayerColor.WHITE, x=5, y=1),
            Piece(self, PieceType.BISHOP, PlayerColor.WHITE, x=6, y=1),
            Piece(self, PieceType.KNIGHT, PlayerColor.WHITE, x=7, y=1),
            Piece(self, PieceType.ROOK, PlayerColor.WHITE, x=8, y=1),
        ]

    def connect(self, websocket: WebSocketServerProtocol, color):
        print('connect player', color, websocket)
        color = PlayerColor.get_value(color)
        player = Player(color, websocket)
        self.players[websocket] = player

        if self.can_start():
            self.start_game()
        else:
            player.set_connected()

        self.send_state()

    def can_start(self):
        return len(self.players.values()) == 2 and not any([player.can_start for player in self.players.values()])

    def start_game(self):
        self.on_move = PlayerColor.WHITE
        self.state = GameState.PLAYING

        for player in self.players.values():
            player.set_playing()

    def move(self, websocket: WebSocketServerProtocol, move_from, move_to):
        if websocket not in self.players.keys():
            return

        for piece in self.board:
            if piece.x == move_from['x'] and piece.y == move_from['y']:
                piece.x = move_to['x']
                piece.y = move_to['y']

        self.switch_on_move()
        self.send_state()

    def switch_on_move(self):
        self.on_move = PlayerColor.WHITE if self.on_move == PlayerColor.BLACK else PlayerColor.BLACK

    def send_state(self):
        produced_message_queue.append(
            get_message(
                ServerAction.GAME_STATE,
                self.to_serializable_dict()
            )
        )

    def to_serializable_dict(self):
        return {
            'id': str(self.id),
            'state': self.state.value,
            'players': [str(x.id) for x in self.players.values()],
            'board': [x.to_serializable_dict() for x in self.board],
            'on_move': self.on_move.value if self.on_move else None,
        }


connected = set()
game = ChessGame()


async def consumer_handler(websocket, path):
    async for message in websocket:
        print('...receive', websocket, path, message)

        parsed_message = json.loads(message)

        if len(parsed_message) != 2:
            print('Invalid message')
            return

        action_value = parsed_message[0]
        action = ClientAction.get_value(action_value)
        data = parsed_message[1]

        if action == ClientAction.CONNECT:
            color = data.get('color')
            game.connect(websocket, color)
        if action == ClientAction.MOVE:
            move_from = data.get('from')
            move_to = data.get('to')
            game.move(websocket, move_from, move_to)


connect_player_colors = [PlayerColor.WHITE.value, PlayerColor.BLACK.value]
random.shuffle(connect_player_colors)


async def producer_handler(websocket: WebSocketServerProtocol, path: str):
    global produced_message_queue, connect_player_colors

    player_id = str(id(websocket))
    color = None
    if connect_player_colors:
        color = connect_player_colors.pop()
    await websocket.send(
        get_message(
            ServerAction.PRE_GAME,
            {'color': color , 'id': player_id}
        )
    )

    while True:
        await sleep(0.1)

        for message in produced_message_queue:
            print('...sending message', message)
            for player_socket in game.players.keys():
                await player_socket.send(message)

        produced_message_queue = []


async def handler(websocket, path):
    print('...connected', websocket, path)
    connected.add(websocket)

    consumer_task = asyncio.ensure_future(
        consumer_handler(websocket, path))
    producer_task = asyncio.ensure_future(
        producer_handler(websocket, path))
    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )
    for task in pending:
        task.cancel()

    return None


print('Starting server...')
start_server = websockets.serve(handler, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
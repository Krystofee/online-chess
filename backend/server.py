import asyncio
import enum
import json
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
    id: UUID
    socket: WebSocketServerProtocol
    state: PlayerState
    color: PlayerColor

    def __init__(self, color: PlayerColor, socket: WebSocketServerProtocol):
        self.id = uuid4()
        self.socket = socket
        self.color = color
        self.state = PlayerState.CONNECTED

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
                    'id': str(self.id),
                    'player': self.color.value,
                    'state': self.state.value,
                }
            )
        )


class GameState(GetValueEnum):
    WAITING = 'WAITING'
    PLAYING = 'PLAYING'


class ChessGame:
    id: UUID
    state: GameState

    players: dict

    board: List[List[str or None]]
    on_move: PlayerColor or None = None

    def __init__(self):
        self.id = uuid4()
        self.state = GameState.WAITING
        self.players = {}
        self.board = []
        for _ in range(8):
            self.board.append([None] * 8)

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
        return not any([player.can_start for player in self.players.values()])

    def start_game(self):
        self.on_move = PlayerColor.WHITE
        self.state = GameState.PLAYING

        for player in self.players.values():
            player.set_playing()

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
        return json.dumps({
            'id': str(self.id),
            'state': self.state.value,
            'players': [str(x.id) for x in self.players.values()],
            'board': self.board,
            'on_move': self.on_move.value if self.on_move else None,
        })


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


async def producer_handler(websocket, path):
    global produced_message_queue

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
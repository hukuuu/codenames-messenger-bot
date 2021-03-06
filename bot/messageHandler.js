const FacebookApi = require('./facebookApi')
const RoomsManager = require('../game/roomsManager')
const PlayersManager = require('../game/playersManager')
const gp = require('../game/gamePositions')

const CreateRoomExecutor = require('../executors/CreateRoomExecutor')
const ListRoomsExecutor = require('../executors/ListRoomsExecutor')
const JoinRoomExecutor = require('../executors/JoinRoomExecutor')
const ShowRoomInfoExecutor = require('../executors/ShowRoomInfoExecutor')
const ShowBoardExecutor = require('../executors/ShowBoardExecutor')
const ShowLogExecutor = require('../executors/ShowLogExecutor')
const HintExecutor = require('../executors/HintExecutor')
const GuessExecutor = require('../executors/GuessExecutor')
const PassExecutor = require('../executors/PassExecutor')
const HelpExecutor = require('../executors/HelpExecutor')
const NickExecutor = require('../executors/NickExecutor')
const InviteExecutor = require('../executors/InviteExecutor')
const PickTeamExecutor = require('../executors/PickTeamExecutor')
const NewGameExecutor = require('../executors/NewGameExecutor')
const SeeScoreExecutor = require('../executors/SeeScoreExecutor')

const log = require('../middlewares/log')

class MessageHandler {
  constructor(pageAccessToken) {
    this.api = new FacebookApi(pageAccessToken)
    this.roomsManager = new RoomsManager()
    this.playersManager = new PlayersManager(this.api)
    this.container = {}

    new CreateRoomExecutor(this.container)
    new ListRoomsExecutor(this.container)
    new JoinRoomExecutor(this.container)
    new PickTeamExecutor(this.container)
    new ShowRoomInfoExecutor(this.container)
    new ShowBoardExecutor(this.container)
    new ShowLogExecutor(this.container)
    new HintExecutor(this.container)
    new GuessExecutor(this.container)
    new PassExecutor(this.container)
    new HelpExecutor(this.container)
    new NickExecutor(this.container)
    new InviteExecutor(this.container)
    new NewGameExecutor(this.container)
    new SeeScoreExecutor(this.container)
  }

  async handleMessage(event) {
    try {
      await this._handleMessage(event)
    } catch (e) {
      console.error(e)
      await this.api.logErrorMessage(event.sender.id, e.message)
    }
  }

  async _handleMessage(event) {
    const { playersManager, roomsManager, api } = this

    const player = await playersManager.findPlayer(event.sender.id)
    const room = roomsManager.findRoom(player.roomId)

    const messageText = event.message.quick_reply
      ? event.message.quick_reply.payload
      : event.message.text

    if (messageText) {
      const messageWords = messageText.toLowerCase().split(' ')
      const command = messageWords[0]

      const executor = this.container[command]

      if (!executor) {
        return api.unknownCommandMessage(player.id, command)
      }

      const context = {
        api,
        command,
        params: messageWords,
        player,
        playersManager,
        room,
        roomsManager
      }

      await executor.execute(context)
      await log(context)
    }
    return
  }
}

module.exports = MessageHandler

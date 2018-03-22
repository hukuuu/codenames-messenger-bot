var request = require('request-promise')

class LowLevelApi {
  constructor(pageAccessToken) {
    this.pageAccessToken = pageAccessToken
  }

  /*
 * Send an image using the Send API.
 *
 */
  sendImageMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: SERVER_URL + '/assets/rift.png'
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a Gif using the Send API.
 *
 */
  sendGifMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: SERVER_URL + '/assets/instagram_logo.gif'
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send audio using the Send API.
 *
 */
  sendAudioMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'audio',
          payload: {
            url: SERVER_URL + '/assets/sample.mp3'
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a video using the Send API.
 *
 */
  sendVideoMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'video',
          payload: {
            url: SERVER_URL + '/assets/allofus480.mov'
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a file using the Send API.
 *
 */
  sendFileMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'file',
          payload: {
            url: SERVER_URL + '/assets/test.txt'
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a text message using the Send API.
 *
 */
  async sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: 'DEVELOPER_DEFINED_METADATA'
      }
    }

    // const sleep = ms => new Promise(r => setTimeout(r, ms));
    // const ms = 1500 + messageText.length * 3;
    // await this.sendTypingOn(recipientId);
    // console.log('delay', ms, 'ms');
    // await sleep(ms);
    // await this.sendTypingOff(recipientId);

    return this.callSendAPI(messageData)
  }

  /*
 * Send a button message using the Send API.
 *
 */
  sendButtonMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'This is test text',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.oculus.com/en-us/rift/',
                title: 'Open Web URL'
              },
              {
                type: 'postback',
                title: 'Trigger Postback',
                payload: 'DEVELOPER_DEFINED_PAYLOAD'
              },
              {
                type: 'phone_number',
                title: 'Call Phone Number',
                payload: '+16505551234'
              }
            ]
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
  sendGenericMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'rift',
                subtitle: 'Next-generation virtual reality',
                item_url: 'https://www.oculus.com/en-us/rift/',
                image_url: SERVER_URL + '/assets/rift.png',
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://www.oculus.com/en-us/rift/',
                    title: 'Open Web URL'
                  },
                  {
                    type: 'postback',
                    title: 'Call Postback',
                    payload: 'Payload for first bubble'
                  }
                ]
              },
              {
                title: 'touch',
                subtitle: 'Your Hands, Now in VR',
                item_url: 'https://www.oculus.com/en-us/touch/',
                image_url: SERVER_URL + '/assets/touch.png',
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://www.oculus.com/en-us/touch/',
                    title: 'Open Web URL'
                  },
                  {
                    type: 'postback',
                    title: 'Call Postback',
                    payload: 'Payload for second bubble'
                  }
                ]
              }
            ]
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a receipt message using the Send API.
 *
 */
  sendReceiptMessage(recipientId) {
    // Generate a random receipt ID as the API requires a unique ID
    var receiptId = 'order' + Math.floor(Math.random() * 1000)

    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'receipt',
            recipient_name: 'Peter Chang',
            order_number: receiptId,
            currency: 'USD',
            payment_method: 'Visa 1234',
            timestamp: '1428444852',
            elements: [
              {
                title: 'Oculus Rift',
                subtitle: 'Includes: headset, sensor, remote',
                quantity: 1,
                price: 599.0,
                currency: 'USD',
                image_url: SERVER_URL + '/assets/riftsq.png'
              },
              {
                title: 'Samsung Gear VR',
                subtitle: 'Frost White',
                quantity: 1,
                price: 99.99,
                currency: 'USD',
                image_url: SERVER_URL + '/assets/gearvrsq.png'
              }
            ],
            address: {
              street_1: '1 Hacker Way',
              street_2: '',
              city: 'Menlo Park',
              postal_code: '94025',
              state: 'CA',
              country: 'US'
            },
            summary: {
              subtotal: 698.99,
              shipping_cost: 20.0,
              total_tax: 57.67,
              total_cost: 626.66
            },
            adjustments: [
              {
                name: 'New Customer Discount',
                amount: -50
              },
              {
                name: '$100 Off Coupon',
                amount: -100
              }
            ]
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a message with Quick Reply buttons.
 *
 */
  sendQuickReply(recipientId, text, replies) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: text,
        quick_replies: replies
        // quick_replies: [
        //   {
        //     "content_type": "text",
        //     "title": "Action",
        //     "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        //   }, {
        //     "content_type": "text",
        //     "title": "Comedy",
        //     "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        //   }, {
        //     "content_type": "text",
        //     "title": "Drama",
        //     "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        //   }
        // ]
      }
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a read receipt to indicate the message has been read
 *
 */
  sendReadReceipt(recipientId) {
    console.log('Sending a read receipt to mark message as seen')

    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: 'mark_seen'
    }

    this.callSendAPI(messageData)
  }

  /*
 * Turn typing indicator on
 *
 */
  sendTypingOn(recipientId) {
    console.log('Turning typing indicator on')

    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: 'typing_on'
    }

    this.callSendAPI(messageData)
  }

  /*
 * Turn typing indicator off
 *
 */
  sendTypingOff(recipientId) {
    console.log('Turning typing indicator off')

    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: 'typing_off'
    }

    this.callSendAPI(messageData)
  }

  /*
 * Send a message with the account linking call-to-action
 *
 */
  sendAccountLinking(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Welcome. Link your account.',
            buttons: [
              {
                type: 'account_link',
                url: SERVER_URL + '/authorize'
              }
            ]
          }
        }
      }
    }

    this.callSendAPI(messageData)
  }

  findName(id) {
    return request({
      uri: `https://graph.facebook.com/v2.6/${id}`,
      qs: {
        access_token: this.pageAccessToken
      },
      method: 'GET'
    })
      .then(body => JSON.parse(body).first_name)
      .catch(err => console.log(err))
  }

  /*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
  callSendAPI(messageData) {
    return request(
      {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
          access_token: this.pageAccessToken
        },
        method: 'POST',
        json: messageData
      },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id
          var messageId = body.message_id

          if (messageId) {
            console.log(
              'Successfully sent message with id %s to recipient %s',
              messageId,
              recipientId
            )
          } else {
            console.log(
              'Successfully called Send API for recipient %s',
              recipientId
            )
          }
        } else {
          console.error('Failed calling Send API', error, response, body)
        }
      }
    )
  }
}

module.exports = LowLevelApi

const { Schema, model } = require('mongoose');

const TicketSchema = new Schema(
  {
    // 상태
    status: {
      type: String,
      default: 'pending-deposit',
      enum: ['confrim-deposit', 'pending-deposit', 'enter', 'non-deposit']
    },

    // 전화번호
    phoneNumber: { type: String },

    ticketNumber: { type: Number, required: true },

    // 어드민 (공짜티켓관련)
    adminTicket: { type: Boolean, default: false },

    // 마지막으로 관리한 사람이 누군지.  populate 활용하세요.
    manager: { type: Schema.Types.ObjectId, ref: 'admin' }
  },
  { timestamps: true }
);

const Ticket = model('ticket', TicketSchema);
module.exports = { Ticket };

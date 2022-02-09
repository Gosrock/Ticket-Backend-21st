const { Schema, model } = require('mongoose');

const TicketSchema = new Schema(
  {
    // 상태
    status: {
      type: String,
      default: 'pending-deposit',
      enum: ['confirm-deposit', 'pending-deposit', 'enter', 'non-deposit']
    },

    // 전화번호 --> 코로나 대응 버젼으로 1인 1매 원칙 유니크 검
    phoneNumber: { type: String, unique: true },

    // 티켓 연번
    ticketNumber: { type: Number, required: true },

    // 어드민 (공짜티켓관련)
    adminTicket: { type: Boolean, default: false },

    // 입금자명
    accountName: { type: String },

    // 학번
    studentID: {
      type: String
    },

    // 소모임 신청 여부
    smallGroup: {
      type: Boolean,
      default: false
    },

    // 마지막으로 관리한 사람이 누군지.  populate 활용하세요.
    manager: { type: Schema.Types.ObjectId, ref: 'admin' }
  },
  { timestamps: true }
);

const Ticket = model('ticket', TicketSchema);
module.exports = { Ticket };

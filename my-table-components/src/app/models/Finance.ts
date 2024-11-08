import mongoose, { Schema } from "mongoose";

// Interface
interface IAccount extends Document {
    _id: mongoose.Types.ObjectId;
    account_id: number;
    limit: number;
    products: string[];
  }
  
  // Schema
  const accountSchema: Schema<IAccount> = new Schema({
    account_id: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    products: {
      type: [String],
      required: true,
    },
  });
  
  const Account = mongoose.models.Account || mongoose.model<IAccount>('Account', accountSchema);

  export default Account;
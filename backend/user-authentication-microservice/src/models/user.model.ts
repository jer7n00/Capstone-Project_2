import mongoose,{Schema,Document} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  u_id?: string;
  username: string;
  name:string;
  email: string;
  password: string;
  role: string;
  playerProfileCompleted:boolean;
}

const UserSchema = new Schema({
  u_id: { type: String,unique:true, required: false },
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Player', 'Team Manager', 'Organizer'], required: true },
  playerProfileCompleted:{type:Boolean,default:false},
}, { timestamps: true });



UserSchema.pre('save', function (next) {
  if (!this.u_id) {
    this.u_id = uuidv4(); // Generates a unique UUID
  }
  next();
});
const User = mongoose.model<IUser>('User', UserSchema);


export default User;

//export const User = mongoose.model('User', UserSchema);

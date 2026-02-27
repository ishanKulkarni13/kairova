import mongoose, { HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/error.js";

export interface IUser {
  name: string;
  username?: string;
  publicUID: number;
  profilePic: {
    public_id: string;
    URL: string;
  };
  email: string;
  authMethod: "email" | "google";
  googleOAuthID?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  isValidPassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new mongoose.Schema<
  IUser,
  mongoose.Model<IUser>,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [2, "Name must be of at least 2 characters"],
    },
    username: {
      type: String,
      unique: [true, "username already exist"],
      minLength: [3, "username must be of at least 3 characters"],
    },
    publicUID: {
      type: Number,
      default: function () {
        return Math.floor(Math.random() * 10000000000);
      },
      unique: [true, "UID already exist"],
    },
    profilePic: {
      public_id: {
        type: String,
        default: "uiccf1wbzyioazqgve5q",
      },
      URL: {
        type: String,
        default:
          "http://res.cloudinary.com/kakashib2k/image/upload/v1713685024/uiccf1wbzyioazqgve5q.png",
      },
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "Email already exist"],
    },
    authMethod: {
      type: String,
      enum: ["email", "google"],
      required: true,
    },

    googleOAuthID: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [
        function (this: IUser) {
          return this.authMethod === "email";
        },
        "Password is required when login with email",
      ],
      minLength: [6, "Password must be of at least 6 characters"],
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  try {
    // Check if googleOAuthID is provided and validate uniqueness
    if (this.isModified("googleOAuthID") && this.googleOAuthID && this.isNew) {
      const isGoogleOAuthIDUserExist = await User.findOne({
        googleOAuthID: this.googleOAuthID,
      });
      if (
        isGoogleOAuthIDUserExist &&
        isGoogleOAuthIDUserExist._id.toString() !== this._id.toString()
      ) {
        throw new Error("Invalid email format");
      }
    }

    if (!this.username) {
      let tempUserName = this.name
        .split(" ")[0]
        .toLowerCase()
        .replace(/\s+/g, "_");
      let isUsernameExists = await User.exists({
        username: { $regex: new RegExp(tempUserName, "i") },
      });
      let count = 0;
      while (isUsernameExists) {
        tempUserName = `${this.name.split(" ")[0].toLowerCase().replace(/\s+/g, "_")}_${Math.floor(Math.random() * 1000)}${count}`;
        isUsernameExists = await User.exists({
          username: { $regex: new RegExp(tempUserName, "i") },
        });
        count++;
        if (count > 10) {
          throw new Error();
        }
      }
      this.username = tempUserName.toLowerCase();
      console.log(this.username, tempUserName);
    }

    // Validate name format and length
    // if (this.isModified("name") || this.isNew) {
    //     console.log('this.name is:',this.name);
    //     const isValidName = /^[a-zA-Z]+(?:[ a-zA-Z0-9_.-]+){0,2}$/.test(this.name);
    //     if (!isValidName || this.name.length > 30) {
    //         return next(new ErrorHandler("Invalid name format or length in DB"));
    //     }
    // }

    // Validate email format
    if (this.isModified("email") || this.isNew) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
      if (!isValidEmail) {
        throw new ErrorHandler("Invalid email format");
      }
      this.email = this.email.toLowerCase();
    }

    // Validate username format
    // if (this.isModified("username") || this.isNew) {
    //     const isValidUsername = /^[a-zA-Z][a-zA-Z0-9_.-]{2,29}$/.test(this.username);
    //     if (!isValidUsername) {
    //         return next(new ErrorHandler("Invalid username format"));
    //     }
    //     this.username = this.username.toLowerCase();
    // }

    // Hash the password if it exists and is modified or if it's a new user
    if ((this.isModified("password") || this.isNew) && this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  } catch (error) {
    throw error;
  }
});

userSchema.methods.isValidPassword = async function (password: string) {
  if (!this.password) {
    return false;
  }
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(`error in isValidPassword ${error}`);
    return false;
  }
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;

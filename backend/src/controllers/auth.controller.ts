import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import passport from "passport";
import { User } from "../models/User";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { sendPasswordResetEmail } from "../utils/mailer";

function signToken(id: string): string {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError("Vui lòng nhập tên đăng nhập và mật khẩu", 400);
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Tên đăng nhập hoặc mật khẩu không đúng", 401);
    }

    const token = signToken(user._id.toString());

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          displayName: user.displayName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Public registration - creates user with role "user"
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);
    }

    if (password.length < 6) {
      throw new AppError("Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      throw new AppError("Tên đăng nhập hoặc email đã tồn tại", 400);
    }

    const user = await User.create({ username, email, password, role: "user" });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          displayName: user.displayName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Admin-only: create admin accounts
export async function adminRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);
    }

    if (password.length < 6) {
      throw new AppError("Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      throw new AppError("Tên đăng nhập hoặc email đã tồn tại", 400);
    }

    const user = await User.create({ username, email, password, role: "admin" });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Vui lòng nhập email", 400);
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      res.json({
        success: true,
        message:
          "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.",
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateModifiedOnly: true });

    // Send email
    const resetUrl = `${env.frontendUrl}/dat-lai-mat-khau/${resetToken}`;
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateModifiedOnly: true });
      throw new AppError("Không thể gửi email. Vui lòng thử lại sau.", 500);
    }

    res.json({
      success: true,
      message:
        "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.",
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.params.token as string;
    const { password } = req.body;

    if (!password) {
      throw new AppError("Vui lòng nhập mật khẩu mới", 400);
    }

    if (password.length < 6) {
      throw new AppError("Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    // Hash token to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      throw new AppError(
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.",
        400
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = signToken(user._id.toString());

    res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công!",
      data: {
        token: jwtToken,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          displayName: user.displayName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate(
    "google",
    { session: false },
    (err: Error | null, user: any) => {
      if (err || !user) {
        return res.redirect(
          `${env.frontendUrl}/dang-nhap?error=google_auth_failed`
        );
      }

      const token = signToken(user._id.toString());
      res.redirect(`${env.frontendUrl}/auth/callback?token=${token}`);
    }
  )(req, res, next);
}

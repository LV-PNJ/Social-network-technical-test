import { Request, Response, NextFunction } from "express";
import { tokenVerify } from "../helpers/verifyToken";
import { AppDataSource } from "../config/dbConfig";
import { User } from "../models/User";
import { formatResponse } from "../helpers/formatResponse";
import { errorFormat } from "../helpers/errors";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";
// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const validateRegisterInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json(
        formatResponse(
          400,
          errorFormat({
            status: 400,
            message: "Username, email and password are required",
          })
        )
      );
    }

    // Crear una instancia de User para validar con class-validator
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    const errors = await validate(user);
    if (errors.length > 0) {
      const formErrors = errors.map((error) => ({
        field: error.property,
        message: Object.values(error.constraints!)[0],
      }));
      return res.status(400).json(
        formatResponse(
          400,
          errorFormat({
            status: 400,
            message: "Validation failed",
            formErrors,
          })
        )
      );
    }

    // Verificar si username o email ya existen
    const existingUser = await AppDataSource.getRepository(User).findOneBy([
      { username },
      { email },
    ]);
    if (existingUser) {
      return res.status(409).json(
        formatResponse(
          409,
          errorFormat({
            status: 409,
            message: "Username or email already registered",
          })
        )
      );
    }

    next();
  } catch (error) {
    console.error("Register validation error:", error);
    return res
      .status(500)
      .json(
        formatResponse(
          500,
          errorFormat({ status: 500, message: "Internal server error" })
        )
      );
  }
};

export const validateLoginInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json(
        formatResponse(
          400,
          errorFormat({
            status: 400,
            message: "Username or email and password are required",
          })
        )
      );
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: [{ username }, { email }],
    });

    if (!user) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: "Invalid credentials" })
          )
        );
    }

    const valid = await user.verifyPassword(password);
    if (!valid) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: "Invalid credentials" })
          )
        );
    }

    // Adjuntar el usuario a la request para usarlo en el controller
    req.user = user;
    next();
  } catch (error) {
    console.error("Login validation error:", error);
    return res
      .status(500)
      .json(
        formatResponse(
          500,
          errorFormat({ status: 500, message: "Internal server error" })
        )
      );
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: "No token provided" })
          )
        );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: "Invalid token format" })
          )
        );
    }

    const decoded = tokenVerify(token);

    const user = await AppDataSource.getRepository(User).findOneBy({
      id: decoded.id,
    });
    if (!user) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: "User not found" })
          )
        );
    }

    // Adjuntar el usuario a la request para usarlo en otros middlewares/controllers
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: "Token expired" })
          )
        );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: "Invalid token" })
          )
        );
    }

    console.error("Unexpected token verification error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
